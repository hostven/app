<div class="wrap kbr-wrap">
  <div class="kbr-header"><h1>KB Rewriter Pro</h1><p>AI-powered hosting KB optimization engine.</p></div>
  <nav class="kbr-tabs">
    <a href="#" class="kbr-tab <?php echo $tab==='audit'?'active':''; ?>" data-tab="audit">Audit</a>
    <a href="#" class="kbr-tab <?php echo $tab==='scanner'?'active':''; ?>" data-tab="scanner">AI Scanner</a>
    <a href="#" class="kbr-tab <?php echo $tab==='queue'?'active':''; ?>" data-tab="queue">Queue</a>
    <a href="#" class="kbr-tab <?php echo $tab==='performance'?'active':''; ?>" data-tab="performance">Performance</a>
    <a href="#" class="kbr-tab <?php echo $tab==='settings'?'active':''; ?>" data-tab="settings">Settings</a>
  </nav>
  <div id="kbr-notice"></div>
  <section id="kbr-tab-audit" class="kbr-panel <?php echo $tab==='audit'?'active':''; ?>"><?php include KBR_PLUGIN_DIR.'admin/views/tab-audit.php'; ?></section>
  <section id="kbr-tab-scanner" class="kbr-panel <?php echo $tab==='scanner'?'active':''; ?>"><?php include KBR_PLUGIN_DIR.'admin/views/tab-scanner.php'; ?></section>
  <section id="kbr-tab-queue" class="kbr-panel <?php echo $tab==='queue'?'active':''; ?>"><?php include KBR_PLUGIN_DIR.'admin/views/tab-queue.php'; ?></section>
  <section id="kbr-tab-performance" class="kbr-panel <?php echo $tab==='performance'?'active':''; ?>"><?php include KBR_PLUGIN_DIR.'admin/views/tab-performance.php'; ?></section>
  <section id="kbr-tab-settings" class="kbr-panel <?php echo $tab==='settings'?'active':''; ?>"><?php include KBR_PLUGIN_DIR.'admin/views/tab-settings.php'; ?></section>
</div>
