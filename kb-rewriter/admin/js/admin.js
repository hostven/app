jQuery(function($){
  const api=(action,data={})=>$.post(kbrAdmin.ajax_url,Object.assign({action,nonce:kbrAdmin.nonce},data));
  const notice=(msg,type='success')=>$('#kbr-notice').html('<div class="notice notice-'+type+'"><p>'+msg+'</p></div>');

  $(document).on('click','.kbr-tab',function(e){e.preventDefault();const t=$(this).data('tab');$('.kbr-tab').removeClass('active');$(this).addClass('active');$('.kbr-panel').removeClass('active');$('#kbr-tab-'+t).addClass('active');});

  $('#kbr-run-audit').on('click',()=>api('kbr_run_audit',{post_type:$('#kbr-post-type').val(),page:1,limit:100}).done(r=>notice('Audit complete: '+r.data.inserted+' items queued')).fail(()=>notice('Audit failed','error')));
  $('#kbr-scan-selected').on('click',()=>bulk('scan'));
  $('#kbr-queue-selected').on('click',()=>bulk('queue'));

  function bulk(type){
    const ids=[];$('#kbr-audit-table tbody input[type=checkbox]:checked').each(function(){ids.push($(this).val());});
    api('kbr_bulk_action',{bulk:type,ids}).done(()=>notice('Bulk action complete')).fail(()=>notice('Bulk failed','error'));
  }

  function loadQueue(){
    api('kbr_get_queue').done(r=>{
      const tbody=$('#kbr-queue-table tbody').empty();
      (r.data||[]).forEach(row=>{
        const cannibal=row.selected_primary_kw?'':'⚠️';
        const stale=row.completed_at && (Date.now()-new Date(row.completed_at).getTime())>90*86400000?'Needs Review':'';
        tbody.append(`<tr><td>${row.original_title||row.post_id} ${stale}</td><td><span class="kbr-pill">${row.stage}</span></td><td>${row.category||''}</td><td>${row.scan_overall_score||0}</td><td>${row.selected_primary_kw||''} ${cannibal}</td><td>${row.status}</td><td>${row.scheduled_at||''}</td><td><button class="button kbr-run-now" data-id="${row.post_id}">▶</button><button class="button kbr-pause" data-id="${row.post_id}">⏸</button><button class="button kbr-remove" data-id="${row.post_id}">✕</button><button class="button kbr-view" data-id="${row.post_id}">👁</button></td></tr>`);
      });
    });
  }

  function loadLog(){api('kbr_get_activity_log').done(r=>{$('#kbr-activity-log').html((r.data||[]).map(l=>`<div class="kbr-log kbr-${l.action}"><strong>${l.time}</strong> #${l.post_id} ${l.action}: ${l.detail}</div>`).join(''));});}

  $('#kbr-refresh-queue').on('click',()=>{loadQueue();loadLog();});
  $('#kbr-clear-done').on('click',()=>api('kbr_clear_completed').done(()=>loadQueue()));
  $(document).on('click','.kbr-run-now',function(){api('kbr_process_single',{post_id:$(this).data('id')}).done(()=>{loadQueue();loadLog();});});
  $(document).on('click','.kbr-pause',function(){api('kbr_pause_item',{post_id:$(this).data('id')}).done(loadQueue);});
  $(document).on('click','.kbr-remove',function(){api('kbr_remove_from_queue',{post_id:$(this).data('id')}).done(loadQueue);});
  $(document).on('click','.kbr-view',function(){const id=$(this).data('id');api('kbr_get_performance',{post_id:id}).done(r=>{$('#kbr-result-body').html(`<p>Word Count Change: ${r.data.word_count_change||0}</p><button class="button kbr-rollback" data-id="${id}">Rollback</button>`);$('#kbr-result-modal').addClass('open');});});
  $(document).on('click','.kbr-close',()=>$('#kbr-result-modal').removeClass('open'));
  $(document).on('click','.kbr-rollback',function(){api('kbr_rollback_post',{post_id:$(this).data('id')}).done(()=>notice('Rollback complete'));});

  $('#kbr-test-claude').on('click',()=>api('kbr_test_claude').done(()=>notice('Claude connected')).fail(x=>notice(x.responseJSON?.data?.message||'Claude failed','error')));
  $('#kbr-connect-gsc').on('click',()=>api('kbr_gsc_oauth_init').done(r=>window.location=r.data.url));
  $('#kbr-disconnect-gsc').on('click',()=>api('kbr_gsc_disconnect').done(()=>notice('GSC disconnected')));
  $('#kbr-test-dfs').on('click',()=>api('kbr_test_dataforseo').done(()=>notice('DataForSEO connected')).fail(()=>notice('DataForSEO failed','error')));

  $('#kbr_claude_model').on('change',function(){const m=$(this).val();$('#kbr-cost-estimator').text('Estimated cost for 1000 articles: ~$'+(kbrAdmin.models[m]||30));});

  $('#kbr-save-settings').on('click',()=>{
    const settings={
      kbr_anthropic_api_key:$('#kbr_anthropic_api_key').val(), kbr_claude_model:$('#kbr_claude_model').val(), kbr_max_tokens:$('#kbr_max_tokens').val(), kbr_temperature:$('#kbr_temperature').val(),
      kbr_dfs_login:$('#kbr_dfs_login').val(), kbr_dfs_password:$('#kbr_dfs_password').val(),
      kbr_scheduler_enabled:$('#kbr_scheduler_enabled').is(':checked')?1:0, kbr_batch_size:$('#kbr_batch_size').val(),
      kbr_scan_prompt:$('#kbr_scan_prompt').val(), kbr_rewrite_prompt:$('#kbr_rewrite_prompt').val(),
      kbr_delete_data_on_uninstall:$('#kbr_delete_data_on_uninstall').is(':checked')?1:0, kbr_notification_email:$('#kbr_notification_email').val()
    };
    api('kbr_save_settings',{settings}).done(()=>notice('Settings saved')).fail(()=>notice('Save failed','error'));
  });

  $('[data-reset]').on('click',function(){api('kbr_reset_prompt',{type:$(this).data('reset')}).done(()=>notice('Prompt reset'));});

  api('kbr_get_site_performance').done(r=>{
    $('#kbr-stat-articles').text(r.data.articles_rewritten);$('#kbr-stat-position').text(r.data.avg_position_improvement);$('#kbr-stat-impressions').text(r.data.impression_gain);$('#kbr-stat-clicks').text(r.data.click_gain);
    const ctx=document.getElementById('kbr-performance-chart');if(ctx){new Chart(ctx,{type:'line',data:{labels:['Before','After'],datasets:[{label:'Avg Position',data:[10,Math.max(1,10-r.data.avg_position_improvement)]}]}});} 
  });

  setInterval(()=>{ if($('#kbr-auto-refresh').is(':checked')){loadQueue();loadLog();}},15000);
  loadQueue();loadLog();
});
