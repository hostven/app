<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Performance
{
    public static function snapshot($post_id, $type = 'before')
    {
        global $wpdb;
        $post = get_post($post_id);
        if (! $post) {
            return new WP_Error('missing_post', 'Post missing.');
        }
        $perf = KBR_Database::performance_table();
        $rows = KBR_Keywords::get_gsc_keywords($post_id, get_permalink($post_id));
        if (is_wp_error($rows)) {
            return $rows;
        }
        $top = ! empty($rows[0]) ? $rows[0] : array();
        $keyword = sanitize_text_field($top['keys'][0] ?? '');
        $position = (float) ($top['position'] ?? 0);
        $impressions = (int) ($top['impressions'] ?? 0);
        $clicks = (int) ($top['clicks'] ?? 0);
        $ctr = (float) ($top['ctr'] ?? 0);
        $word_count = str_word_count(wp_strip_all_tags($post->post_content));

        $wpdb->insert($perf, array(
            'post_id' => (int) $post_id,
            'snapshot_date' => gmdate('Y-m-d'),
            'keyword' => $keyword,
            'position' => $position,
            'impressions' => $impressions,
            'clicks' => $clicks,
            'ctr' => $ctr,
            'word_count' => $word_count,
            'snapshot_type' => sanitize_key($type),
        ));

        return true;
    }

    public static function get_comparison($post_id)
    {
        global $wpdb;
        $perf = KBR_Database::performance_table();
        $before = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$perf} WHERE post_id=%d AND snapshot_type='before' ORDER BY id DESC LIMIT 1", $post_id), ARRAY_A);
        $after = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$perf} WHERE post_id=%d AND snapshot_type='after' ORDER BY id DESC LIMIT 1", $post_id), ARRAY_A);
        if (! $before || ! $after) {
            return array();
        }
        return array(
            'before' => $before,
            'after' => $after,
            'position_change' => (float) $before['position'] - (float) $after['position'],
            'impression_change' => (int) $after['impressions'] - (int) $before['impressions'],
            'click_change' => (int) $after['clicks'] - (int) $before['clicks'],
            'word_count_change' => (int) $after['word_count'] - (int) $before['word_count'],
        );
    }

    public static function get_site_summary()
    {
        global $wpdb;
        $perf = KBR_Database::performance_table();
        $rows = $wpdb->get_results("SELECT post_id,
            MAX(CASE WHEN snapshot_type='before' THEN position END) as before_pos,
            MAX(CASE WHEN snapshot_type='after' THEN position END) as after_pos,
            MAX(CASE WHEN snapshot_type='before' THEN impressions END) as before_imp,
            MAX(CASE WHEN snapshot_type='after' THEN impressions END) as after_imp,
            MAX(CASE WHEN snapshot_type='before' THEN clicks END) as before_click,
            MAX(CASE WHEN snapshot_type='after' THEN clicks END) as after_click
            FROM {$perf}
            GROUP BY post_id", ARRAY_A);

        $count = 0; $pos_sum = 0; $imp_gain = 0; $click_gain = 0; $best = null; $best_val = -INF;
        foreach ($rows as $r) {
            if ($r['before_pos'] === null || $r['after_pos'] === null) {
                continue;
            }
            $count++;
            $pos = (float) $r['before_pos'] - (float) $r['after_pos'];
            $pos_sum += $pos;
            $imp_gain += ((int) $r['after_imp'] - (int) $r['before_imp']);
            $click_gain += ((int) $r['after_click'] - (int) $r['before_click']);
            if ($pos > $best_val) {
                $best_val = $pos;
                $best = (int) $r['post_id'];
            }
        }

        return array(
            'articles_rewritten' => $count,
            'avg_position_improvement' => $count ? round($pos_sum / $count, 2) : 0,
            'impression_gain' => $imp_gain,
            'click_gain' => $click_gain,
            'best_performing_rewrite' => $best,
        );
    }
}
