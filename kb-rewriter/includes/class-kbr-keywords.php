<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Keywords
{
    public static function connect_gsc()
    {
        $client_id = get_option('kbr_gsc_client_id', '');
        $redirect = admin_url('admin.php?page=kb-rewriter&gsc_callback=1');
        $state = wp_generate_password(20, false);
        update_option('kbr_gsc_state', $state, false);
        $url = add_query_arg(array(
            'client_id' => rawurlencode($client_id),
            'redirect_uri' => rawurlencode($redirect),
            'response_type' => 'code',
            'scope' => rawurlencode('https://www.googleapis.com/auth/webmasters.readonly'),
            'access_type' => 'offline',
            'prompt' => 'consent',
            'state' => $state,
        ), 'https://accounts.google.com/o/oauth2/v2/auth');
        return $url;
    }

    public static function maybe_handle_oauth_callback()
    {
        if (! is_admin() || empty($_GET['page']) || 'kb-rewriter' !== $_GET['page'] || empty($_GET['gsc_callback'])) {
            return;
        }
        if (empty($_GET['state']) || get_option('kbr_gsc_state', '') !== sanitize_text_field(wp_unslash($_GET['state']))) {
            wp_die('Invalid OAuth state.');
        }
        if (empty($_GET['code'])) {
            wp_safe_redirect(admin_url('admin.php?page=kb-rewriter&tab=settings&gsc=error'));
            exit;
        }

        $client_id = get_option('kbr_gsc_client_id', '');
        $client_secret = get_option('kbr_gsc_client_secret', '');
        $redirect_uri = admin_url('admin.php?page=kb-rewriter&gsc_callback=1');

        $resp = wp_remote_post('https://oauth2.googleapis.com/token', array(
            'timeout' => 30,
            'body' => array(
                'code' => sanitize_text_field(wp_unslash($_GET['code'])),
                'client_id' => $client_id,
                'client_secret' => $client_secret,
                'redirect_uri' => $redirect_uri,
                'grant_type' => 'authorization_code',
            ),
        ));

        if (is_wp_error($resp)) {
            wp_safe_redirect(admin_url('admin.php?page=kb-rewriter&tab=settings&gsc=error'));
            exit;
        }
        $body = json_decode(wp_remote_retrieve_body($resp), true);
        if (! empty($body['access_token'])) {
            update_option('kbr_gsc_access_token', sanitize_text_field($body['access_token']), false);
            if (! empty($body['refresh_token'])) {
                update_option('kbr_gsc_refresh_token', sanitize_text_field($body['refresh_token']), false);
            }
            update_option('kbr_gsc_token_expires', time() + absint($body['expires_in']), false);
            wp_safe_redirect(admin_url('admin.php?page=kb-rewriter&tab=settings&gsc=connected'));
            exit;
        }
        wp_safe_redirect(admin_url('admin.php?page=kb-rewriter&tab=settings&gsc=error'));
        exit;
    }

    public static function refresh_gsc_token()
    {
        $refresh = get_option('kbr_gsc_refresh_token', '');
        if (empty($refresh)) {
            return new WP_Error('no_refresh', 'Missing refresh token.');
        }
        $resp = wp_remote_post('https://oauth2.googleapis.com/token', array(
            'timeout' => 30,
            'body' => array(
                'client_id' => get_option('kbr_gsc_client_id', ''),
                'client_secret' => get_option('kbr_gsc_client_secret', ''),
                'refresh_token' => $refresh,
                'grant_type' => 'refresh_token',
            ),
        ));
        if (is_wp_error($resp)) {
            return $resp;
        }
        $body = json_decode(wp_remote_retrieve_body($resp), true);
        if (empty($body['access_token'])) {
            return new WP_Error('token_refresh_failed', 'Failed refreshing GSC token.');
        }
        update_option('kbr_gsc_access_token', sanitize_text_field($body['access_token']), false);
        update_option('kbr_gsc_token_expires', time() + absint($body['expires_in']), false);
        return $body['access_token'];
    }

    private static function gsc_token()
    {
        $token = get_option('kbr_gsc_access_token', '');
        $exp = (int) get_option('kbr_gsc_token_expires', 0);
        if (empty($token) || time() >= $exp) {
            $token = self::refresh_gsc_token();
        }
        return $token;
    }

    public static function get_gsc_keywords($post_id, $url)
    {
        $token = self::gsc_token();
        if (is_wp_error($token)) {
            return $token;
        }
        $site = get_option('kbr_gsc_site_url', home_url('/'));
        $range = absint(get_option('kbr_gsc_date_range', 90));
        $payload = array(
            'startDate' => gmdate('Y-m-d', strtotime('-' . $range . ' days')),
            'endDate' => gmdate('Y-m-d'),
            'dimensions' => array('query'),
            'dimensionFilterGroups' => array(array('filters' => array(array(
                'dimension' => 'page',
                'operator' => 'equals',
                'expression' => esc_url_raw($url),
            )))),
            'rowLimit' => 25,
        );
        $endpoint = 'https://searchconsole.googleapis.com/webmasters/v3/sites/' . rawurlencode($site) . '/searchAnalytics/query';
        $resp = wp_remote_post($endpoint, array(
            'timeout' => 30,
            'headers' => array('Authorization' => 'Bearer ' . $token, 'content-type' => 'application/json'),
            'body' => wp_json_encode($payload),
        ));
        if (is_wp_error($resp)) {
            return $resp;
        }
        $data = json_decode(wp_remote_retrieve_body($resp), true);
        $rows = ! empty($data['rows']) && is_array($data['rows']) ? $data['rows'] : array();
        usort($rows, function ($a, $b) {
            return ($b['impressions'] ?? 0) <=> ($a['impressions'] ?? 0);
        });

        global $wpdb;
        $queue = KBR_Database::queue_table();
        $top = isset($rows[0]) ? $rows[0] : array();
        $wpdb->update($queue, array(
            'gsc_top_keyword' => isset($top['keys'][0]) ? sanitize_text_field($top['keys'][0]) : '',
            'gsc_top_position' => isset($top['position']) ? (float) $top['position'] : 0,
            'gsc_impressions' => isset($top['impressions']) ? (int) $top['impressions'] : 0,
            'gsc_clicks' => isset($top['clicks']) ? (int) $top['clicks'] : 0,
            'gsc_raw' => wp_json_encode($data),
        ), array('post_id' => (int) $post_id), array('%s', '%f', '%d', '%d', '%s'), array('%d'));

        return $rows;
    }

    public static function get_dataforseo_keywords($seeds)
    {
        $login = get_option('kbr_dfs_login', '');
        $password = get_option('kbr_dfs_password', '');
        if (empty($login) || empty($password)) {
            return new WP_Error('dfs_auth', 'DataForSEO credentials missing.');
        }
        $auth = 'Basic ' . base64_encode($login . ':' . $password);
        $location = absint(get_option('kbr_dfs_country', 2840));

        $volume_payload = array(array('keywords' => array_values(array_unique(array_filter(array_map('sanitize_text_field', (array) $seeds)))), 'location_code' => $location, 'language_code' => 'en', 'search_partners' => false));
        $volume = self::dfs_post('/v3/keywords_data/google_ads/search_volume/live', $volume_payload, $auth);
        if (is_wp_error($volume)) {
            return $volume;
        }

        $primary = ! empty($seeds[0]) ? sanitize_text_field($seeds[0]) : '';
        $related_payload = array(array('keyword' => $primary, 'language_code' => 'en', 'location_code' => $location, 'limit' => 20, 'filters' => array('keyword_info.search_volume', '>', 50)));
        $related = self::dfs_post('/v3/dataforseo_labs/google/related_keywords/live', $related_payload, $auth);

        $serp_payload = array(array('keyword' => $primary, 'location_code' => $location, 'language_code' => 'en', 'device' => 'desktop', 'depth' => 10));
        $serp = self::dfs_post('/v3/serp/google/organic/live/advanced', $serp_payload, $auth);

        $map = array();
        $tasks = $volume['tasks'][0]['result'] ?? array();
        foreach ($tasks as $row) {
            $kw = sanitize_text_field($row['keyword'] ?? '');
            if ($kw === '') {
                continue;
            }
            $map[$kw] = array(
                'keyword' => $kw,
                'search_volume' => (int) ($row['search_volume'] ?? 0),
                'competition' => (float) ($row['competition'] ?? 0),
                'cpc' => (float) ($row['cpc'] ?? 0),
                'keyword_difficulty' => (float) ($row['keyword_difficulty'] ?? 0),
                'main_intent' => sanitize_text_field($row['main_intent'] ?? ''),
            );
        }

        if (! is_wp_error($related)) {
            $items = $related['tasks'][0]['result'][0]['items'] ?? array();
            foreach ($items as $it) {
                $kw = sanitize_text_field($it['keyword_data']['keyword'] ?? $it['keyword'] ?? '');
                if ($kw === '' || isset($map[$kw])) {
                    continue;
                }
                $map[$kw] = array(
                    'keyword' => $kw,
                    'search_volume' => (int) ($it['keyword_info']['search_volume'] ?? 0),
                    'competition' => (float) ($it['keyword_info']['competition'] ?? 0),
                    'cpc' => (float) ($it['keyword_info']['cpc'] ?? 0),
                    'keyword_difficulty' => (float) ($it['keyword_properties']['keyword_difficulty'] ?? 0),
                    'main_intent' => sanitize_text_field($it['search_intent_info']['main_intent'] ?? ''),
                );
            }
        }

        $competitors = array();
        if (! is_wp_error($serp)) {
            foreach (($serp['tasks'][0]['result'][0]['items'] ?? array()) as $it) {
                if (($it['type'] ?? '') !== 'organic') {
                    continue;
                }
                $competitors[] = array(
                    'title' => sanitize_text_field($it['title'] ?? ''),
                    'url' => esc_url_raw($it['url'] ?? ''),
                    'description' => sanitize_text_field($it['description'] ?? ''),
                );
            }
        }

        return array('keywords' => array_values($map), 'competitors' => $competitors);
    }

    private static function dfs_post($path, $payload, $auth)
    {
        $resp = wp_remote_post('https://api.dataforseo.com' . $path, array(
            'timeout' => 30,
            'headers' => array('Authorization' => $auth, 'content-type' => 'application/json'),
            'body' => wp_json_encode($payload),
        ));
        if (is_wp_error($resp)) {
            return $resp;
        }
        return json_decode(wp_remote_retrieve_body($resp), true);
    }

    public static function select_best_keyword($post_id, $kw_data, $title)
    {
        global $wpdb;
        $queue = KBR_Database::queue_table();
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$queue} WHERE post_id=%d", $post_id), ARRAY_A);

        $system = "You are an SEO keyword strategist for a web hosting company.\nGiven keyword data with real search volumes and difficulty\nscores, select the single best primary keyword and up to 5\nsecondary keywords for a hosting KB article.\n\nSelection criteria (in priority order):\n1. Keyword difficulty under 40\n2. Search volume over 100 per month\n3. Search intent is informational or commercial\n4. Keyword closely matches the article topic\n5. Current ranking position between 8-30 (quick wins)\n6. Hosting-specific terminology is present\n\nRespond ONLY with valid JSON. No markdown. No explanation.\nNo text before or after the JSON object.\n\n{\n  \"primary_keyword\":\"string\",\n  \"primary_volume\":0,\n  \"primary_difficulty\":0,\n  \"primary_intent\":\"informational|commercial|navigational|transactional\",\n  \"secondary_keywords\":[{\"keyword\":\"string\",\"volume\":0}],\n  \"opportunity_rating\":\"hot|good|meh\",\n  \"reasoning\":\"1-2 sentences explaining choice\"\n}";

        $user = "Article title: {$title}\nCurrent GSC top keyword: " . ($row['gsc_top_keyword'] ?? '') . "\nCurrent position: " . ($row['gsc_top_position'] ?? '') . "\nKeyword candidates with data:\n" . wp_json_encode($kw_data, JSON_PRETTY_PRINT);
        $resp = KBR_Claude::complete($system, $user, 1500, 'claude-haiku-4-5-20251001');
        if (is_wp_error($resp)) {
            return $resp;
        }
        $json = KBR_Claude::parse_json($resp);
        if (is_wp_error($json)) {
            return $json;
        }

        $wpdb->update($queue, array(
            'selected_primary_kw' => sanitize_text_field($json['primary_keyword'] ?? ''),
            'selected_secondary_kw' => wp_json_encode($json['secondary_keywords'] ?? array()),
            'keyword_opportunity' => sanitize_text_field($json['opportunity_rating'] ?? ''),
            'keyword_volume' => (int) ($json['primary_volume'] ?? 0),
            'keyword_difficulty' => (float) ($json['primary_difficulty'] ?? 0),
            'stage' => 'keyword',
        ), array('post_id' => (int) $post_id), array('%s', '%s', '%s', '%d', '%f', '%s'), array('%d'));

        return $json;
    }
}
