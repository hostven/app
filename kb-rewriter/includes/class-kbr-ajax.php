<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Ajax
{
    public static function init()
    {
        $actions = array(
            'kbr_run_audit','kbr_fetch_keywords','kbr_fetch_keywords_batch','kbr_run_ai_scan','kbr_run_ai_scan_batch','kbr_add_to_queue','kbr_remove_from_queue','kbr_get_queue','kbr_process_single','kbr_update_category','kbr_update_instructions','kbr_toggle_scheduler','kbr_save_settings','kbr_get_stats','kbr_get_activity_log','kbr_get_scan_result','kbr_get_performance','kbr_get_site_performance','kbr_clear_completed','kbr_gsc_oauth_init','kbr_gsc_disconnect','kbr_test_claude','kbr_test_dataforseo','kbr_reset_prompt','kbr_pause_item','kbr_retry_failed','kbr_bulk_action','kbr_rollback_post'
        );
        foreach ($actions as $a) {
            add_action('wp_ajax_' . $a, array(__CLASS__, $a));
        }
    }

    private static function guard()
    {
        if (! current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Unauthorized'), 403);
        }
        check_ajax_referer('kbr_nonce', 'nonce');
    }

    public static function kbr_run_audit(){ self::guard(); wp_send_json_success(KBR_Audit::run(sanitize_key($_POST['post_type'] ?? 'post'), absint($_POST['page'] ?? 1), absint($_POST['limit'] ?? 50))); }
    public static function kbr_fetch_keywords(){ self::guard(); $id=absint($_POST['post_id']??0); wp_send_json_success(KBR_Keywords::get_gsc_keywords($id, get_permalink($id))); }
    public static function kbr_fetch_keywords_batch(){ self::guard(); wp_send_json_success(array('message'=>'Use scheduler for batch')); }
    public static function kbr_run_ai_scan(){ self::guard(); wp_send_json_success(KBR_Scanner::scan_post(absint($_POST['post_id']??0))); }
    public static function kbr_run_ai_scan_batch(){ self::guard(); wp_send_json_success(array('message'=>'Use bulk action')); }
    public static function kbr_add_to_queue(){ self::guard(); global $wpdb; $t=KBR_Database::queue_table(); $id=absint($_POST['post_id']??0); $wpdb->query($wpdb->prepare("INSERT INTO {$t}(post_id,status,stage,scheduled_at) VALUES(%d,'pending','audit',%s) ON DUPLICATE KEY UPDATE status='pending',stage='audit'",$id,gmdate('Y-m-d H:i:s'))); wp_send_json_success(); }
    public static function kbr_remove_from_queue(){ self::guard(); global $wpdb; $wpdb->delete(KBR_Database::queue_table(), array('post_id'=>absint($_POST['post_id']??0)), array('%d')); wp_send_json_success(); }
    public static function kbr_get_queue(){ self::guard(); global $wpdb; $rows=$wpdb->get_results("SELECT * FROM ".KBR_Database::queue_table()." ORDER BY updated_at DESC LIMIT 200", ARRAY_A); wp_send_json_success($rows); }
    public static function kbr_process_single(){ self::guard(); global $wpdb; $r=$wpdb->get_row($wpdb->prepare("SELECT * FROM ".KBR_Database::queue_table()." WHERE post_id=%d",absint($_POST['post_id']??0)), ARRAY_A); if($r){KBR_Scheduler::process_item($r);} wp_send_json_success(); }
    public static function kbr_update_category(){ self::guard(); global $wpdb; $wpdb->update(KBR_Database::queue_table(), array('category'=>sanitize_key($_POST['category']??'rewrite')), array('post_id'=>absint($_POST['post_id']??0))); wp_send_json_success(); }
    public static function kbr_update_instructions(){ self::guard(); global $wpdb; $wpdb->update(KBR_Database::queue_table(), array('rewrite_instructions'=>wp_kses_post($_POST['instructions']??'')), array('post_id'=>absint($_POST['post_id']??0))); wp_send_json_success(); }
    public static function kbr_toggle_scheduler(){ self::guard(); update_option('kbr_scheduler_enabled', empty($_POST['enabled'])?0:1, false); wp_send_json_success(); }
    public static function kbr_save_settings(){ self::guard(); foreach((array)($_POST['settings']??array()) as $k=>$v){ if(strpos($k,'kbr_')===0){ update_option(sanitize_key($k), is_array($v)?wp_json_encode($v):sanitize_text_field((string)$v), false);} } wp_send_json_success(); }
    public static function kbr_get_stats(){ self::guard(); global $wpdb; $t=KBR_Database::queue_table(); wp_send_json_success(array('pending'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE status='pending'"),'done'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE status='done'"))); }
    public static function kbr_get_activity_log(){ self::guard(); $log=json_decode((string)get_option('kbr_activity_log','[]'), true); wp_send_json_success(array_slice((array)$log,-50)); }
    public static function kbr_get_scan_result(){ self::guard(); global $wpdb; $r=$wpdb->get_row($wpdb->prepare("SELECT scan_result,rewrite_instructions,suggested_faq FROM ".KBR_Database::queue_table()." WHERE post_id=%d",absint($_POST['post_id']??0)), ARRAY_A); wp_send_json_success($r); }
    public static function kbr_get_performance(){ self::guard(); wp_send_json_success(KBR_Performance::get_comparison(absint($_POST['post_id']??0))); }
    public static function kbr_get_site_performance(){ self::guard(); wp_send_json_success(KBR_Performance::get_site_summary()); }
    public static function kbr_clear_completed(){ self::guard(); global $wpdb; $wpdb->query("DELETE FROM ".KBR_Database::queue_table()." WHERE status IN ('done','skipped')"); wp_send_json_success(); }
    public static function kbr_gsc_oauth_init(){ self::guard(); wp_send_json_success(array('url'=>KBR_Keywords::connect_gsc())); }
    public static function kbr_gsc_disconnect(){ self::guard(); foreach(array('kbr_gsc_access_token','kbr_gsc_refresh_token','kbr_gsc_token_expires') as $k){ delete_option($k);} wp_send_json_success(); }
    public static function kbr_test_claude(){ self::guard(); $ok=KBR_Claude::test_connection(); if(is_wp_error($ok)){wp_send_json_error(array('message'=>$ok->get_error_message()));} wp_send_json_success(array('connected'=>(bool)$ok)); }
    public static function kbr_test_dataforseo(){ self::guard(); $r=KBR_Keywords::get_dataforseo_keywords(array('ssl certificate install cpanel')); if(is_wp_error($r)){wp_send_json_error(array('message'=>$r->get_error_message()));} wp_send_json_success(array('ok'=>true)); }
    public static function kbr_reset_prompt(){ self::guard(); $type=sanitize_key($_POST['type']??'scan'); update_option('kbr_'.$type.'_prompt','',false); wp_send_json_success(); }
    public static function kbr_pause_item(){ self::guard(); global $wpdb; $wpdb->update(KBR_Database::queue_table(), array('status'=>'paused'), array('post_id'=>absint($_POST['post_id']??0))); wp_send_json_success(); }
    public static function kbr_retry_failed(){ self::guard(); global $wpdb; $wpdb->update(KBR_Database::queue_table(), array('status'=>'pending','scheduled_at'=>gmdate('Y-m-d H:i:s')), array('post_id'=>absint($_POST['post_id']??0))); wp_send_json_success(); }
    public static function kbr_bulk_action(){ self::guard(); $action=sanitize_key($_POST['bulk']??''); $ids=array_map('absint',(array)($_POST['ids']??array())); global $wpdb; foreach($ids as $id){ if('queue'===$action){$wpdb->query($wpdb->prepare("INSERT INTO ".KBR_Database::queue_table()."(post_id,status,stage,scheduled_at) VALUES(%d,'pending','audit',%s) ON DUPLICATE KEY UPDATE status='pending'",$id,gmdate('Y-m-d H:i:s')));} elseif('scan'===$action){KBR_Scanner::scan_post($id);} elseif('delete'===$action){$wpdb->update(KBR_Database::queue_table(),array('scan_decision'=>'delete','status'=>'skipped','stage'=>'done'),array('post_id'=>$id));} } wp_send_json_success(); }
    public static function kbr_rollback_post(){ self::guard(); $r=KBR_Rewriter::rollback(absint($_POST['post_id']??0)); if(is_wp_error($r)){wp_send_json_error(array('message'=>$r->get_error_message()));} wp_send_json_success(); }
}
