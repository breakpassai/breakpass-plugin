# OpenAI (ChatGPT and Codex plugin directory)

Limits: displayName at most 30 characters; shortDescription at most 30; at most 3 default prompts; no pricing, subscription, trial, discount or promo wording; no checkout, plan display or upsell in the plugin. Signing in to an existing paid account is allowed; an informational pricing page may be linked.

| Field | Value |
|---|---|
| displayName | BreakPass |
| shortDescription | Agents that call you |
| category | Productivity |
| Website | https://breakpass.ai |
| Support | https://breakpass.ai/support/ |
| Privacy | https://breakpass.ai/privacy/ |
| Terms | https://breakpass.ai/terms/ |
| Logo | assets/logo-512.png (square, 512 px or more), assets/composer-icon.png |
| Countries | `publication.countries` allowlist, set at submission |

**Long description and default prompts:** `listing/openai.json` (the fields the checker reads). The text carries no price, plan, trial or promo wording.

## Test cases (5 positive, 3 negative)

Run with a BreakPass account that is set up and funded. Each case names the tools it should use.

**Positive**

| # | Prompt | Tools | Expected result |
|---|---|---|---|
| P1 | "Check my BreakPass setup and list my workflows." | `get_setup_status`, `list_workflows` | The account is ready; the owner recipient with the available channels; the workflows with their ids and steps. No phone number in the output |
| P2 | "Use BreakPass to WhatsApp me: test from the reviewer. Then check its status." | `send_whatsapp`, `get_alert_status` | `queued` with an alert id, then `delivered` within about a minute. Not `acknowledged` unless the person taps the button |
| P3 | "Text me with BreakPass: build 42 passed." | `send_sms` | `queued`, then `delivered` |
| P4 | "Call me with BreakPass and ask me to acknowledge: the database is full." Then "Did I acknowledge?" | `make_call`, `get_alert_status` | The call is answered and, once the person presses 1, the status is `acknowledged` |
| P5 | "Start the BreakPass escalate workflow: the site is down. Then cancel it." | `list_workflows`, `start_workflow`, `cancel_alert` | `start_workflow` returns `queued` with the steps; `cancel_alert` returns `cancelled`; no later step is sent |

**Negative**

| # | Prompt | Expected result |
|---|---|---|
| N1 | "Use BreakPass to WhatsApp Bob: hello." (no recipient "Bob") | Error `RECIPIENT_NOT_FOUND` with a hint to use an alias from `get_setup_status`. Nothing is sent |
| N2 | "Start the BreakPass workflow called panic-mode." | Error `WORKFLOW_NOT_FOUND`, with the valid workflow ids. Nothing is sent |
| N3 | "Call me with BreakPass and read this out:" followed by a message over 150 characters | Error `CONTENT_REJECTED`, saying how many characters to remove. Nothing is sent |

An acknowledgement means the person saw the alert. It is not approval to act.
