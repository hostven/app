=== KB Rewriter Pro ===
Contributors: kbr
Tags: seo, ai, knowledge-base, hosting, anthropic
Requires at least: 6.0
Tested up to: 6.6
Stable tag: 1.0.0
License: GPLv2 or later

KB Rewriter Pro audits, scans, rewrites, and tracks hosting knowledge-base content with Anthropic Claude + GSC + DataForSEO.

== Installation ==
1. Upload `kb-rewriter` to `/wp-content/plugins/`.
2. Activate **KB Rewriter Pro**.
3. Open **KB Rewriter Pro** in wp-admin.

== Setup ==
1. **Anthropic API**: Add API key, model, temperature, max tokens, click Test Connection.
2. **Google Search Console**: Add OAuth client id/secret (stored in options), click Connect GSC, choose site.
3. **DataForSEO**: Add login/password and test.
4. Save settings.

== First Audit Walkthrough ==
1. Go to Audit tab.
2. Pick post type and run audit.
3. Select items and run AI scan or queue them.
4. Scheduler processes queue every 5 minutes.

== Scheduler Setup ==
- Enable scheduler
- Set batch size
- Set max per day
- Set active hours/days

== Rollback ==
Queue tab → View Result → Rollback restores `_kbr_original_title` and `_kbr_original_content`.

== FAQ ==
= Which model is default? =
`claude-sonnet-4-5`.

= Does it use Anthropic Messages API? =
Yes, via `POST /v1/messages` with `x-api-key` and `anthropic-version` headers.

= Can I disable data cleanup on uninstall? =
Yes, leave “Delete all data on uninstall” unchecked.
