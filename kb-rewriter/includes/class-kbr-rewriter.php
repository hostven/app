<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Rewriter
{
    public static function rewrite_post($post_id)
    {
        global $wpdb;
        $queue_t = KBR_Database::queue_table();
        $post = get_post($post_id);
        if (! $post) {
            return new WP_Error('missing_post', 'Post missing.');
        }
        $q = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$queue_t} WHERE post_id=%d", $post_id), ARRAY_A);
        if (! $q) {
            return new WP_Error('missing_queue', 'Queue row missing.');
        }

        if ((int) get_option('kbr_auto_snapshot', 1) === 1) {
            KBR_Performance::snapshot($post_id, 'before');
        }

        update_post_meta($post_id, '_kbr_original_title', $post->post_title);
        update_post_meta($post_id, '_kbr_original_content', $post->post_content);

        $scan = json_decode($q['scan_result'] ?? '{}', true);
        $system_default = 'You are a senior technical content writer for a web hosting company. Return strict JSON with title/content/meta_description.';
        $system = get_option('kbr_rewrite_prompt', $system_default);
        if (empty($system)) {
            $system = $system_default;
        }

        $user = "ORIGINAL TITLE: {$post->post_title}\nPRIMARY KEYWORD: {$q['selected_primary_kw']} ({$q['keyword_volume']}/mo, difficulty: {$q['keyword_difficulty']})\nSECONDARY KEYWORDS: {$q['selected_secondary_kw']}\nSEARCH INTENT: " . ($scan['search_intent'] ?? '') . "\nSUGGESTED TITLE: {$q['suggested_title']}\nSUGGESTED META: {$q['suggested_meta']}\n\nORIGINAL CONTENT (reference only — do not copy):\n{$post->post_content}\n\nAI SCAN FINDINGS:\nOverall Score: {$q['scan_overall_score']}/100\nConfidence: {$q['scan_confidence']}%\nDecision: {$q['scan_decision']}\nPriority: " . ($scan['priority'] ?? '') . "\n\nCRITICAL ISSUES TO FIX:\n{$q['critical_issues']}\n\nMISSING SECTIONS TO ADD:\n{$q['missing_sections']}\n\nOUTDATED INFORMATION TO UPDATE:\n" . wp_json_encode($scan['outdated_information'] ?? array()) . "\n\nSUGGESTED H2 STRUCTURE:\n" . wp_json_encode($scan['suggested_h2s'] ?? array()) . "\n\nSPECIFIC REWRITE INSTRUCTIONS:\n{$q['rewrite_instructions']}\n\nCOMPETITOR GAPS TO FILL:\n" . wp_json_encode($scan['competitor_gaps'] ?? array()) . "\n\nFAQ QUESTIONS TO INCLUDE:\n{$q['suggested_faq']}\n\nTARGET WORD COUNT: " . (int) ($scan['estimated_rewrite_word_count'] ?? max(800, (int) $q['original_word_count'])) . " words";

        $model = get_option('kbr_rewrite_model', get_option('kbr_claude_model', 'claude-sonnet-4-5'));
        $resp = KBR_Claude::complete($system, $user, (int) get_option('kbr_max_tokens', 6000), $model);
        if (is_wp_error($resp)) {
            return self::handle_error($post_id, $resp);
        }
        $json = KBR_Claude::parse_json($resp);
        if (is_wp_error($json)) {
            return self::handle_error($post_id, $json, $resp);
        }

        $content = wp_kses_post($json['content'] ?? '');
        $title = sanitize_text_field($json['title'] ?? $post->post_title);
        $meta = sanitize_text_field($json['meta_description'] ?? $q['suggested_meta']);

        wp_update_post(array(
            'ID' => $post_id,
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'publish',
            'post_modified' => current_time('mysql'),
            'post_modified_gmt' => gmdate('Y-m-d H:i:s'),
        ));

        update_post_meta($post_id, '_yoast_wpseo_metadesc', $meta);
        update_post_meta($post_id, '_aioseo_description', $meta);
        update_post_meta($post_id, '_rankmath_focus_keyword', sanitize_text_field($q['selected_primary_kw']));
        update_post_meta($post_id, '_kbr_rewritten_at', current_time('mysql'));
        update_post_meta($post_id, '_kbr_primary_keyword', sanitize_text_field($q['selected_primary_kw']));

        $words = str_word_count(wp_strip_all_tags($content));
        $wpdb->update($queue_t, array(
            'status' => 'done',
            'stage' => 'done',
            'rewritten_word_count' => $words,
            'completed_at' => gmdate('Y-m-d H:i:s'),
            'error_message' => '',
        ), array('post_id' => (int) $post_id));

        if ((int) get_option('kbr_performance_tracking', 1) === 1) {
            KBR_Performance::snapshot($post_id, 'after');
        }

        self::maybe_run_readability_pass($post_id, $title, $content, $meta);
        return true;
    }

    private static function handle_error($post_id, $error, $raw = '')
    {
        global $wpdb;
        $queue_t = KBR_Database::queue_table();
        $row = $wpdb->get_row($wpdb->prepare("SELECT retry_count FROM {$queue_t} WHERE post_id=%d", $post_id), ARRAY_A);
        $retry = (int) ($row['retry_count'] ?? 0) + 1;
        $code = is_wp_error($error) ? $error->get_error_code() : 'unknown';
        $msg = is_wp_error($error) ? $error->get_error_message() : 'Unknown error';
        $status = 'failed';
        $scheduled = null;

        if ('rate_limit' === $code && $retry < 3) {
            $scheduled = gmdate('Y-m-d H:i:s', time() + 10 * MINUTE_IN_SECONDS);
            $status = 'pending';
        } elseif ('overloaded' === $code && $retry < 3) {
            $scheduled = gmdate('Y-m-d H:i:s', time() + 5 * MINUTE_IN_SECONDS);
            $status = 'pending';
        } elseif ($retry < 3 && in_array($code, array('claude_error', 'empty_response', 'json_parse_failed'), true)) {
            $scheduled = gmdate('Y-m-d H:i:s', time() + 5 * MINUTE_IN_SECONDS);
            $status = 'pending';
        }

        $wpdb->update($queue_t, array(
            'status' => $status,
            'error_message' => sanitize_textarea_field($msg . (empty($raw) ? '' : ' | RAW: ' . mb_substr($raw, 0, 5000))),
            'retry_count' => $retry,
            'scheduled_at' => $scheduled,
        ), array('post_id' => (int) $post_id));

        return is_wp_error($error) ? $error : new WP_Error('rewrite_failed', $msg);
    }

    private static function maybe_run_readability_pass($post_id, $title, $content, $meta)
    {
        $plain = wp_strip_all_tags($content);
        $score = self::flesch_kincaid($plain);
        if ($score >= 50) {
            return;
        }
        update_post_meta($post_id, '_kbr_rewrite_version_original', wp_json_encode(array('title' => $title, 'content' => $content, 'meta' => $meta)));
        $resp = KBR_Claude::complete('Simplify readability while preserving technical correctness. Return JSON title/content/meta_description.', 'Improve readability for this article: ' . $content, 2000, 'claude-haiku-4-5-20251001');
        if (is_wp_error($resp)) {
            return;
        }
        $json = KBR_Claude::parse_json($resp);
        if (is_wp_error($json)) {
            return;
        }
        wp_update_post(array('ID' => $post_id, 'post_title' => sanitize_text_field($json['title'] ?? $title), 'post_content' => wp_kses_post($json['content'] ?? $content)));
        update_post_meta($post_id, '_kbr_rewrite_version_simplified', wp_json_encode($json));
        update_post_meta($post_id, '_kbr_readability_score', $score);
    }

    private static function flesch_kincaid($text)
    {
        $sentences = max(1, preg_match_all('/[.!?]+/', $text));
        $words_arr = preg_split('/\s+/', trim($text));
        $words = max(1, count(array_filter($words_arr)));
        $syllables = 0;
        foreach ($words_arr as $w) {
            $w = strtolower(preg_replace('/[^a-z]/', '', $w));
            if ($w === '') {
                continue;
            }
            preg_match_all('/[aeiouy]+/', $w, $m);
            $syllables += max(1, count($m[0]));
        }
        return round(206.835 - 1.015 * ($words / $sentences) - 84.6 * ($syllables / $words), 2);
    }

    public static function rollback($post_id)
    {
        $title = get_post_meta($post_id, '_kbr_original_title', true);
        $content = get_post_meta($post_id, '_kbr_original_content', true);
        if (empty($title) || empty($content)) {
            return new WP_Error('no_backup', 'No rollback backup found.');
        }
        wp_update_post(array('ID' => $post_id, 'post_title' => $title, 'post_content' => $content, 'post_status' => 'publish'));
        return true;
    }
}
