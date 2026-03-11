<?php
/**
 * Plugin Name: KB Rewriter Pro
 * Plugin URI:  https://example.com/kb-rewriter-pro
 * Description: AI-powered knowledge base optimization engine for web hosting companies.
 * Version:     1.0.0
 * Author:      KB Rewriter Pro
 * License:     GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: kb-rewriter
 * Domain Path: /languages
 *
 * @package KBRewriterPro
 */

if (! defined('ABSPATH')) {
    exit;
}

if (! defined('KBR_PLUGIN_FILE')) {
    define('KBR_PLUGIN_FILE', __FILE__);
}

if (! defined('KBR_PLUGIN_DIR')) {
    define('KBR_PLUGIN_DIR', plugin_dir_path(__FILE__));
}

if (! defined('KBR_PLUGIN_URL')) {
    define('KBR_PLUGIN_URL', plugin_dir_url(__FILE__));
}

if (! defined('KBR_VERSION')) {
    define('KBR_VERSION', '1.0.0');
}

/**
 * Main plugin bootstrap class.
 */
final class KB_Rewriter_Pro
{
    /**
     * Singleton instance.
     *
     * @var KB_Rewriter_Pro|null
     */
    private static $instance = null;

    /**
     * Get singleton instance.
     *
     * @return KB_Rewriter_Pro
     */
    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Constructor.
     */
    private function __construct()
    {
        $this->load_dependencies();
        $this->register_hooks();
    }

    /**
     * Load required class files.
     *
     * @return void
     */
    private function load_dependencies()
    {
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-database.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-claude.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-audit.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-keywords.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-scanner.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-decider.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-rewriter.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-performance.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-scheduler.php';
        require_once KBR_PLUGIN_DIR . 'includes/class-kbr-ajax.php';
        require_once KBR_PLUGIN_DIR . 'admin/class-kbr-admin.php';
    }

    /**
     * Register plugin hooks.
     *
     * @return void
     */
    private function register_hooks()
    {
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        add_action('init', array($this, 'init_modules'));
    }

    /**
     * Load plugin translations.
     *
     * @return void
     */
    public function load_textdomain()
    {
        load_plugin_textdomain('kb-rewriter', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    /**
     * Initialize runtime modules.
     *
     * @return void
     */
    public function init_modules()
    {
        KBR_Database::init();
        KBR_Scheduler::init();
        KBR_Ajax::init();

        if (is_admin()) {
            KBR_Admin::init();
        }
    }
}

/**
 * Activation callback.
 *
 * @return void
 */
function kbr_activate_plugin()
{
    KBR_Database::create_tables();
    KBR_Database::seed_default_options();
    KBR_Scheduler::schedule();
}
register_activation_hook(__FILE__, 'kbr_activate_plugin');

/**
 * Deactivation callback.
 *
 * @return void
 */
function kbr_deactivate_plugin()
{
    KBR_Scheduler::unschedule();
}
register_deactivation_hook(__FILE__, 'kbr_deactivate_plugin');

KB_Rewriter_Pro::instance();
