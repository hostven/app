<?php
if (! defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

global $wpdb;
$delete = (int) get_option('kbr_delete_data_on_uninstall', 0);
if ($delete !== 1) {
    return;
}

$wpdb->query('DROP TABLE IF EXISTS ' . $wpdb->prefix . 'kbr_queue');
$wpdb->query('DROP TABLE IF EXISTS ' . $wpdb->prefix . 'kbr_performance');

$opts = $wpdb->get_col("SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE 'kbr\\_%'");
foreach ($opts as $opt) {
    delete_option($opt);
}

$wpdb->query("DELETE FROM {$wpdb->postmeta} WHERE meta_key LIKE '_kbr\\_%'");

$timestamp = wp_next_scheduled('kbr_process_queue');
while ($timestamp) {
    wp_unschedule_event($timestamp, 'kbr_process_queue');
    $timestamp = wp_next_scheduled('kbr_process_queue');
}
