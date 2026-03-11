<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Admin
{
    public static function init()
    {
        add_action('admin_menu', array(__CLASS__, 'menu'));
        add_action('admin_enqueue_scripts', array(__CLASS__, 'assets'));
    }

    public static function menu()
    {
        add_menu_page('KB Rewriter Pro', 'KB Rewriter Pro', 'manage_options', 'kb-rewriter', array(__CLASS__, 'render'), 'dashicons-edit-page', 58);
    }

    public static function assets($hook)
    {
        if (false === strpos($hook, 'kb-rewriter')) {
            return;
        }
        wp_enqueue_style('kbr-admin-font', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', array(), KBR_VERSION);
        wp_enqueue_style('kbr-admin', KBR_PLUGIN_URL . 'admin/css/admin.css', array(), KBR_VERSION);
        wp_enqueue_script('chart-js', 'https://cdn.jsdelivr.net/npm/chart.js', array(), '4.4.0', true);
        wp_enqueue_script('kbr-admin', KBR_PLUGIN_URL . 'admin/js/admin.js', array('jquery'), KBR_VERSION, true);
        wp_localize_script('kbr-admin', 'kbrAdmin', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('kbr_nonce'),
            'models' => array('claude-opus-4-5' => 120, 'claude-sonnet-4-5' => 30, 'claude-haiku-4-5-20251001' => 5),
        ));
    }

    public static function render()
    {
        $tab = sanitize_key($_GET['tab'] ?? 'audit');
        include KBR_PLUGIN_DIR . 'admin/views/main.php';
    }
}
