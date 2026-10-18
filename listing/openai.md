# OpenAI (ChatGPT and Codex plugin directory)

The fields live in the root `plugin.json`, under `extensions.com.openai` (`interface`, `review`, `publication`); that file is the source of truth and `node scripts/check.mjs` checks its limits. Build the upload ZIP with `node scripts/build-openai-zip.mjs` (output in `dist/`, not committed).

Limits: displayName at most 30 characters; shortDescription at most 30; longDescription at most 4,000; at most 3 default prompts, each at most 128, unique; no pricing, subscription, trial, discount or promo wording; no checkout, plan display or upsell in the plugin; **no screenshots** (the portal rejects them unless the tool scan reports a UI template; BreakPass has none). Signing in to an existing paid account is allowed; an informational pricing page may be linked.

- Category: Communication (the store's fixed list also has Productivity).
- Tool annotations and their justifications: `listing/openai-tool-annotations.json`.
- Test cases (5 positive, 3 negative, with `tools_triggered` and `expected_behavior`): `review.test_cases` in `plugin.json`.
- Reviewer credentials are never in the ZIP or this repository: they go in the store dashboard's Review details form.
