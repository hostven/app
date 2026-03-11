<?php
if (! defined('ABSPATH')) {
    exit;
}

class KBR_Claude
{
    public static function complete($system, $user, $max_tokens = 4000, $model_override = '')
    {
        $api_key = get_option('kbr_anthropic_api_key', '');
        $model = ! empty($model_override) ? sanitize_text_field($model_override) : get_option('kbr_claude_model', 'claude-sonnet-4-5');

        if (empty($api_key)) {
            return new WP_Error('no_api_key', 'Anthropic API key is not configured.');
        }

        $body = array(
            'model' => $model,
            'max_tokens' => (int) $max_tokens,
            'system' => (string) $system,
            'messages' => array(
                array('role' => 'user', 'content' => (string) $user),
            ),
        );

        $temperature = (float) get_option('kbr_temperature', 0.7);
        if ($temperature > 0) {
            $body['temperature'] = min(1.0, max(0.0, $temperature));
        }

        $attempts = 0;
        do {
            $attempts++;
            $response = wp_remote_post('https://api.anthropic.com/v1/messages', array(
                'timeout' => 120,
                'headers' => array(
                    'x-api-key' => $api_key,
                    'anthropic-version' => '2023-06-01',
                    'content-type' => 'application/json',
                ),
                'body' => wp_json_encode($body),
            ));

            if (is_wp_error($response)) {
                return $response;
            }

            $code = wp_remote_retrieve_response_code($response);
            $raw = wp_remote_retrieve_body($response);
            $data = json_decode($raw, true);

            if (429 === (int) $code) {
                return new WP_Error('rate_limit', 'Rate limit hit. Will retry in 10 minutes.');
            }
            if (529 === (int) $code) {
                return new WP_Error('overloaded', 'Claude API overloaded. Will retry in 5 minutes.');
            }
            if (200 !== (int) $code) {
                $msg = isset($data['error']['message']) ? $data['error']['message'] : 'HTTP error: ' . $code;
                return new WP_Error('claude_error', $msg);
            }

            $text = isset($data['content'][0]['text']) ? trim((string) $data['content'][0]['text']) : '';
            if ('' === $text && $attempts < 2) {
                continue;
            }
            if ('' === $text) {
                return new WP_Error('empty_response', 'Claude returned an empty response.');
            }

            $stop_reason = isset($data['stop_reason']) ? $data['stop_reason'] : '';
            if ('max_tokens' === $stop_reason) {
                error_log('KBR Warning: Claude hit max_tokens for post. Consider increasing max_tokens.');
            }

            return $text;
        } while ($attempts < 2);

        return new WP_Error('empty_response', 'Claude returned an empty response.');
    }

    public static function clean_json_response($response_text)
    {
        $text = trim((string) $response_text);
        $text = preg_replace('/^```(?:json)?\s*/i', '', $text);
        $text = preg_replace('/\s*```$/', '', $text);
        return trim($text);
    }

    public static function parse_json($response_text)
    {
        $clean = self::clean_json_response($response_text);
        $data = json_decode($clean, true);
        if (! is_array($data)) {
            error_log('KBR Claude parse failure raw: ' . substr($response_text, 0, 5000));
            return new WP_Error('json_parse_failed', 'Unable to parse Claude JSON response.');
        }
        return $data;
    }

    public static function test_connection()
    {
        $r = self::complete('You are a connectivity checker.', 'Reply with: connected', 100);
        if (is_wp_error($r)) {
            return $r;
        }
        return stripos($r, 'connected') !== false;
    }
}
