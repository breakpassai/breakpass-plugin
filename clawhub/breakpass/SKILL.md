---
name: breakpass
description: Lets your agent reach you when it matters through BreakPass (hosted MCP): WhatsApp, SMS, or a phone call that reads the alert aloud until you press 1. Use Inform for one message, Acknowledge for repeats until you confirm, Escalate for calls. Requires a paid BreakPass account (from 5 USD a month billed yearly, 7 USD month to month, no free tier) and a verified phone number; sign-in is OAuth. Opt-in only, not for emergencies or marketing.
license: MIT-0
metadata:
  homepage: https://breakpass.ai/docs/mcp/?utm_source=mcp_clawhub&utm_medium=directory&utm_campaign=mcp_launch
  topics: notifications, phone-calls, sms, whatsapp, human-in-the-loop
  requires:
    account: "A paid BreakPass account (from $5 a month billed yearly, $7 month to month; see https://breakpass.ai/pricing/). No free tier."
    env: []
---

# BreakPass

BreakPass lets you reach your owner by WhatsApp, SMS or phone call and tells you whether the alert was delivered, answered and acknowledged.

**This skill needs a paid BreakPass account.** Plans start at $5 a month billed yearly, or $7 month to month (pricing: https://breakpass.ai/pricing/); there is no free tier, and every alert is paid from the account's balance. The skill itself is free (MIT-0).

**Credentials:** none are stored or passed by this skill. BreakPass is a remote MCP server (`https://mcp.breakpass.ai/mcp`, Streamable HTTP). Your owner signs in to their account in a browser (OAuth); the MCP client keeps the token. No environment variable is read.

## Use

1. `get_setup_status`: which channels work, what is left to set up.
2. `start_workflow` with Inform, Acknowledge or Escalate when follow-up may be needed (always with an `idempotency_key`), or `send_whatsapp`, `send_sms`, `make_call` for one message.
3. `get_alert_status` to see the result. Delivered is not acknowledged.

An acknowledgement means your owner saw the alert; it is not approval to act. One plain line, at most 150 characters if a call is possible. No secrets, no phone numbers. Not for emergencies or life-safety use.
