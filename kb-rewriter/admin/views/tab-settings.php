<div class="kbr-settings-grid">
  <div class="kbr-setting-section"><h3>Anthropic Claude</h3>
    <label>API Key <input type="password" id="kbr_anthropic_api_key" /></label>
    <button class="button" id="kbr-test-claude">Test Connection</button>
    <label>Model
      <select id="kbr_claude_model">
        <option value="claude-opus-4-5">claude-opus-4-5</option>
        <option value="claude-sonnet-4-5" selected>claude-sonnet-4-5</option>
        <option value="claude-haiku-4-5-20251001">claude-haiku-4-5-20251001</option>
      </select>
    </label>
    <label>Max tokens <input type="range" min="1000" max="8000" value="4000" id="kbr_max_tokens" /></label>
    <label>Temperature <input type="range" min="0" max="1" step="0.1" value="0.7" id="kbr_temperature" /></label>
    <p id="kbr-cost-estimator">Estimated cost for 1000 articles: ~$30</p>
  </div>
  <div class="kbr-setting-section"><h3>Google Search Console</h3><button class="button" id="kbr-connect-gsc">Connect GSC</button><button class="button" id="kbr-disconnect-gsc">Disconnect</button></div>
  <div class="kbr-setting-section"><h3>DataForSEO</h3><label>API Login <input type="text" id="kbr_dfs_login" /></label><label>Password <input type="password" id="kbr_dfs_password" /></label><button class="button" id="kbr-test-dfs">Test Connection</button></div>
  <div class="kbr-setting-section"><h3>Scheduler</h3><label><input type="checkbox" id="kbr_scheduler_enabled" checked /> Enable scheduler</label><label>Batch size <input type="number" id="kbr_batch_size" value="3" min="1" max="10" /></label></div>
  <div class="kbr-setting-section"><h3>Prompts</h3><label>Scan prompt <textarea id="kbr_scan_prompt"></textarea></label><button class="button" data-reset="scan">Reset</button><label>Rewrite prompt <textarea id="kbr_rewrite_prompt"></textarea></label><button class="button" data-reset="rewrite">Reset</button></div>
  <div class="kbr-setting-section"><h3>Advanced</h3><label><input type="checkbox" id="kbr_delete_data_on_uninstall" /> Delete all data on uninstall</label><label>Notification email <input type="email" id="kbr_notification_email" /></label></div>
</div>
<button class="button button-primary" id="kbr-save-settings">Save Settings</button>
