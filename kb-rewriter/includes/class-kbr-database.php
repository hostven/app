<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Database
{
    public static function init()
    {
        // Runtime init placeholder for future migrations.
    }

    public static function queue_table()
    {
        global $wpdb;
        return $wpdb->prefix . 'kbr_queue';
    }

    public static function performance_table()
    {
        global $wpdb;
        return $wpdb->prefix . 'kbr_performance';
    }

    public static function create_tables()
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset_collate = $wpdb->get_charset_collate();
        $queue = self::queue_table();
        $performance = self::performance_table();

        $sql1 = "CREATE TABLE $queue (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            post_id BIGINT UNSIGNED NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            stage VARCHAR(20) DEFAULT 'audit',
            priority_score FLOAT DEFAULT 0,
            category VARCHAR(20) DEFAULT 'rewrite',
            gsc_top_keyword VARCHAR(255) DEFAULT '',
            gsc_top_position FLOAT DEFAULT 0,
            gsc_impressions INT DEFAULT 0,
            gsc_clicks INT DEFAULT 0,
            gsc_raw LONGTEXT,
            dfs_keywords LONGTEXT,
            selected_primary_kw VARCHAR(255) DEFAULT '',
            selected_secondary_kw LONGTEXT,
            keyword_opportunity VARCHAR(20) DEFAULT '',
            keyword_volume INT DEFAULT 0,
            keyword_difficulty FLOAT DEFAULT 0,
            scan_result LONGTEXT,
            scan_decision VARCHAR(20) DEFAULT '',
            scan_confidence TINYINT DEFAULT 0,
            scan_reason TEXT,
            scan_overall_score TINYINT DEFAULT 0,
            rewrite_instructions LONGTEXT,
            suggested_title VARCHAR(255) DEFAULT '',
            suggested_meta VARCHAR(255) DEFAULT '',
            suggested_faq LONGTEXT,
            merge_with_post_id BIGINT UNSIGNED DEFAULT NULL,
            critical_issues LONGTEXT,
            missing_sections LONGTEXT,
            original_title VARCHAR(255) DEFAULT '',
            original_word_count INT DEFAULT 0,
            rewritten_word_count INT DEFAULT 0,
            custom_prompt LONGTEXT,
            error_message LONGTEXT,
            retry_count TINYINT DEFAULT 0,
            scheduled_at DATETIME DEFAULT NULL,
            started_at DATETIME DEFAULT NULL,
            completed_at DATETIME DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY post_id (post_id),
            KEY idx_status (status),
            KEY idx_stage (stage),
            KEY idx_scheduled (scheduled_at)
        ) $charset_collate;";

        $sql2 = "CREATE TABLE $performance (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            post_id BIGINT UNSIGNED NOT NULL,
            snapshot_date DATE NOT NULL,
            keyword VARCHAR(255) DEFAULT '',
            position FLOAT DEFAULT 0,
            impressions INT DEFAULT 0,
            clicks INT DEFAULT 0,
            ctr FLOAT DEFAULT 0,
            word_count INT DEFAULT 0,
            snapshot_type VARCHAR(20) DEFAULT 'before',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_post_date (post_id, snapshot_date),
            KEY idx_snapshot_type (snapshot_type)
        ) $charset_collate;";

        dbDelta($sql1);
        dbDelta($sql2);
    }

    public static function seed_default_options()
    {
        $defaults = array(
            'kbr_claude_model' => 'claude-sonnet-4-5',
            'kbr_temperature' => 0.7,
            'kbr_max_tokens' => 4000,
            'kbr_scheduler_enabled' => 1,
            'kbr_batch_size' => 3,
            'kbr_max_per_day' => 20,
            'kbr_start_hour' => 8,
            'kbr_end_hour' => 22,
            'kbr_active_days' => wp_json_encode(array(1, 2, 3, 4, 5)),
            'kbr_pause_on_3_failures' => 1,
            'kbr_gsc_date_range' => 90,
            'kbr_dfs_country' => 2840,
            'kbr_min_keyword_volume' => 100,
            'kbr_max_keyword_difficulty' => 40,
            'kbr_focus_positions' => 1,
            'kbr_activity_log' => wp_json_encode(array()),
            'kbr_scan_prompt' => '',
            'kbr_rewrite_prompt' => '',
            'kbr_performance_tracking' => 1,
            'kbr_auto_snapshot' => 1,
            'kbr_rescan_days' => 30,
            'kbr_delete_data_on_uninstall' => 0,
        );
        foreach ($defaults as $key => $value) {
            if (false === get_option($key, false)) {
                add_option($key, $value);
            }
        }
    }
}
