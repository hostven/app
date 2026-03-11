<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Audit
{
    public static function run($post_type = 'post', $paged = 1, $per_page = 50)
    {
        global $wpdb;
        $queue = KBR_Database::queue_table();
        $per_page = min(100, max(1, absint($per_page)));

        $query = new WP_Query(array(
            'post_type' => sanitize_key($post_type),
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'paged' => max(1, absint($paged)),
            'orderby' => 'modified',
            'order' => 'DESC',
            'fields' => 'ids',
        ));

        $inserted = 0;
        foreach ($query->posts as $post_id) {
            $post = get_post($post_id);
            if (! $post) {
                continue;
            }
            $word_count = str_word_count(wp_strip_all_tags($post->post_content));
            $age_days = floor((time() - strtotime($post->post_modified_gmt ? $post->post_modified_gmt : $post->post_modified)) / DAY_IN_SECONDS);
            $priority = max(0, min(100, (100 - min(100, $word_count / 30)) + min(100, $age_days / 3)));

            $wpdb->query($wpdb->prepare(
                "INSERT INTO {$queue} (post_id, status, stage, priority_score, category, original_title, original_word_count, scheduled_at)
                 VALUES (%d, 'pending', 'audit', %f, 'rewrite', %s, %d, %s)
                 ON DUPLICATE KEY UPDATE priority_score=VALUES(priority_score), original_title=VALUES(original_title), original_word_count=VALUES(original_word_count), updated_at=NOW()",
                $post_id,
                $priority,
                sanitize_text_field($post->post_title),
                $word_count,
                gmdate('Y-m-d H:i:s')
            ));
            $inserted++;
        }

        return array(
            'inserted' => $inserted,
            'total' => (int) $query->found_posts,
            'pages' => (int) $query->max_num_pages,
        );
    }
}
