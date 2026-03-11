<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Scheduler
{
    const HOOK = 'kbr_process_queue';

    public static function init()
    {
        add_filter('cron_schedules', array(__CLASS__, 'cron_schedules'));
        add_action(self::HOOK, array(__CLASS__, 'process_batch'));
        add_action('admin_init', array('KBR_Keywords', 'maybe_handle_oauth_callback'));
    }

    public static function cron_schedules($schedules)
    {
        $schedules['kbr_five_minutes'] = array('interval' => 300, 'display' => 'Every 5 Minutes (KBR)');
        return $schedules;
    }

    public static function schedule()
    {
        if (! wp_next_scheduled(self::HOOK)) {
            wp_schedule_event(time() + 60, 'kbr_five_minutes', self::HOOK);
        }
    }

    public static function unschedule()
    {
        $timestamp = wp_next_scheduled(self::HOOK);
        while ($timestamp) {
            wp_unschedule_event($timestamp, self::HOOK);
            $timestamp = wp_next_scheduled(self::HOOK);
        }
    }

    public static function within_window()
    {
        $enabled = (int) get_option('kbr_scheduler_enabled', 1);
        if (! $enabled) {
            return false;
        }
        $hour = (int) current_time('G');
        $start = (int) get_option('kbr_start_hour', 8);
        $end = (int) get_option('kbr_end_hour', 22);
        $day = (int) current_time('N');
        $days = json_decode((string) get_option('kbr_active_days', wp_json_encode(array(1,2,3,4,5))), true);
        return $hour >= $start && $hour <= $end && in_array($day, (array) $days, true);
    }

    public static function process_batch($force = false)
    {
        if (! $force && ! self::within_window()) {
            return;
        }

        global $wpdb;
        $queue = KBR_Database::queue_table();
        $batch = max(1, min(10, (int) get_option('kbr_batch_size', 3)));
        $items = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$queue} WHERE status IN ('pending','scanned') AND (scheduled_at IS NULL OR scheduled_at <= %s) ORDER BY priority_score DESC, created_at ASC LIMIT %d",
            gmdate('Y-m-d H:i:s'),
            $batch
        ), ARRAY_A);

        $used_stage = array();
        foreach ($items as $item) {
            $stage = $item['stage'];
            if (isset($used_stage[$stage])) {
                continue;
            }
            $used_stage[$stage] = true;
            self::process_item($item);
        }
    }

    public static function process_item($item)
    {
        global $wpdb;
        $queue = KBR_Database::queue_table();
        $post_id = (int) $item['post_id'];
        $post = get_post($post_id);
        if (! $post) {
            return;
        }

        $stage = $item['stage'];
        if ('audit' === $stage) {
            $wpdb->update($queue, array('stage' => 'audit', 'status' => 'scanning'), array('post_id' => $post_id));
            $rows = KBR_Keywords::get_gsc_keywords($post_id, get_permalink($post_id));
            if (! is_wp_error($rows)) {
                $seeds = array();
                foreach ($rows as $r) {
                    $seeds[] = $r['keys'][0] ?? '';
                }
                $dfs = KBR_Keywords::get_dataforseo_keywords($seeds);
                if (! is_wp_error($dfs)) {
                    $wpdb->update($queue, array('dfs_keywords' => wp_json_encode($dfs), 'stage' => 'keyword', 'status' => 'pending'), array('post_id' => $post_id));
                    KBR_Keywords::select_best_keyword($post_id, $dfs['keywords'], $post->post_title);
                    self::log($post_id, $post->post_title, 'keyword_complete', 'Keyword data collected');
                }
            }
            return;
        }

        if ('keyword' === $stage) {
            $result = KBR_Scanner::scan_post($post_id);
            if (! is_wp_error($result)) {
                self::log($post_id, $post->post_title, 'scan_complete', 'AI scan finished. Model: claude-sonnet-4-5');
            }
            return;
        }

        if ('scan' === $stage) {
            if (KBR_Decider::should_skip_rewrite($item)) {
                $wpdb->update($queue, array('status' => 'skipped', 'stage' => 'done', 'category' => KBR_Decider::category_from_decision($item['scan_decision'])), array('post_id' => $post_id));
                self::log($post_id, $post->post_title, 'skipped', 'Decision: ' . $item['scan_decision']);
                return;
            }
            $wpdb->update($queue, array('stage' => 'rewrite', 'status' => 'pending'), array('post_id' => $post_id));
            return;
        }

        if ('rewrite' === $stage) {
            $before = str_word_count(wp_strip_all_tags($post->post_content));
            $result = KBR_Rewriter::rewrite_post($post_id);
            if (! is_wp_error($result)) {
                $after = str_word_count(wp_strip_all_tags(get_post_field('post_content', $post_id)));
                self::log($post_id, $post->post_title, 'rewrite_complete', $before . ' words → ' . $after . ' words. Keyword: ' . $item['selected_primary_kw'] . '. Model: ' . get_option('kbr_rewrite_model', get_option('kbr_claude_model', 'claude-sonnet-4-5')));
            }
        }
    }

    public static function log($post_id, $title, $action, $detail)
    {
        $log = json_decode((string) get_option('kbr_activity_log', '[]'), true);
        if (! is_array($log)) {
            $log = array();
        }
        $log[] = array('time' => current_time('mysql'), 'post_id' => (int) $post_id, 'post_title' => sanitize_text_field($title), 'action' => sanitize_key($action), 'detail' => sanitize_textarea_field($detail));
        if (count($log) > 500) {
            $log = array_slice($log, -500);
        }
        update_option('kbr_activity_log', wp_json_encode($log), false);
    }
}
