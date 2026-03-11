<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Decider
{
    public static function should_skip_rewrite($queue_row)
    {
        $decision = $queue_row['scan_decision'] ?? '';
        return in_array($decision, array('keep', 'delete'), true);
    }

    public static function category_from_decision($decision)
    {
        $decision = sanitize_key($decision);
        if (in_array($decision, array('delete', 'merge', 'keep', 'expand', 'rewrite'), true)) {
            return $decision;
        }
        return 'rewrite';
    }
}
