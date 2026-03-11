<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Scanner
{
    public static function scan_post($post_id)
    {
        global $wpdb;
        $queue_t = KBR_Database::queue_table();
        $post = get_post($post_id);
        if (! $post) {
            return new WP_Error('missing_post', 'Post not found.');
        }
        $q = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$queue_t} WHERE post_id=%d", $post_id), ARRAY_A);
        if (! $q) {
            return new WP_Error('missing_queue', 'Queue row missing.');
        }

        $content = wp_strip_all_tags($post->post_content);
        $word_count = str_word_count($content);
        $has_h2 = (bool) preg_match('/<h2/i', $post->post_content);
        $has_h3 = (bool) preg_match('/<h3/i', $post->post_content);
        $has_ol = (bool) preg_match('/<ol/i', $post->post_content);
        $has_img = (bool) preg_match('/<img/i', $post->post_content);
        $has_meta = get_post_meta($post_id, '_yoast_wpseo_metadesc', true) || get_post_meta($post_id, '_aioseo_description', true);

        $competitors = json_decode($q['dfs_keywords'] ?? '{}', true);
        $competitor_lines = '';
        foreach (($competitors['competitors'] ?? array()) as $idx => $c) {
            $competitor_lines .= ($idx + 1) . '. ' . ($c['title'] ?? '') . ' | ' . ($c['url'] ?? '') . "\n";
        }

        $system_default = 'You are a senior SEO content strategist and web hosting expert. Return strict JSON only for the requested audit schema.';
        $system = get_option('kbr_scan_prompt', $system_default);
        if (empty($system)) {
            $system = $system_default;
        }

        $user = "ARTICLE TITLE: {$post->post_title}\nTARGET KEYWORD: {$q['selected_primary_kw']}\nCURRENT GSC RANKING: {$q['gsc_top_keyword']} at position {$q['gsc_top_position']}\nSEARCH VOLUME: {$q['keyword_volume']}\nDIFFICULTY: {$q['keyword_difficulty']}\n\nTOP 10 COMPETITORS CURRENTLY RANKING FOR THIS KEYWORD:\n{$competitor_lines}\n\nARTICLE CONTENT:\n{$content}\n\nARTICLE METRICS:\n- Word count: {$word_count}\n- Has H2 headings: " . ($has_h2 ? 'yes' : 'no') . "\n- Has H3 headings: " . ($has_h3 ? 'yes' : 'no') . "\n- Has numbered lists: " . ($has_ol ? 'yes' : 'no') . "\n- Has images: " . ($has_img ? 'yes' : 'no') . "\n- Has meta desc: " . ($has_meta ? 'yes' : 'no') . "\n- Last modified: {$post->post_modified}";

        $resp = KBR_Claude::complete($system, $user, 3000, 'claude-sonnet-4-5');
        if (is_wp_error($resp)) {
            return $resp;
        }

        $json = KBR_Claude::parse_json($resp);
        if (is_wp_error($json)) {
            $wpdb->update($queue_t, array('status' => 'failed', 'error_message' => maybe_serialize($resp)), array('post_id' => $post_id), array('%s', '%s'), array('%d'));
            return $json;
        }

        $wpdb->update($queue_t, array(
            'scan_result' => wp_json_encode($json),
            'scan_decision' => sanitize_text_field($json['decision'] ?? ''),
            'scan_confidence' => (int) ($json['confidence'] ?? 0),
            'scan_reason' => sanitize_textarea_field($json['reason'] ?? ''),
            'scan_overall_score' => (int) ($json['overall_score'] ?? 0),
            'rewrite_instructions' => wp_kses_post($json['rewrite_instructions'] ?? ''),
            'suggested_title' => sanitize_text_field($json['suggested_title'] ?? ''),
            'suggested_meta' => sanitize_text_field($json['suggested_meta'] ?? ''),
            'suggested_faq' => wp_json_encode($json['suggested_faq'] ?? array()),
            'critical_issues' => wp_json_encode($json['critical_issues'] ?? array()),
            'missing_sections' => wp_json_encode($json['missing_sections'] ?? array()),
            'status' => 'scanned',
            'stage' => 'scan',
        ), array('post_id' => (int) $post_id));

        return $json;
    }
}
