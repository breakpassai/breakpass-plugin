---
name: get-started
description: Use BreakPass when you need to reach your owner outside the chat: a long task is done, a decision needs them, or something went wrong. Sends a WhatsApp message, an SMS or a phone call and tells you whether they got it.
---

# BreakPass: reaching your owner

BreakPass lets you alert the person you work for by WhatsApp, SMS or phone call, and tells you whether the alert was delivered, answered and acknowledged. It needs a paid BreakPass account that your owner has already set up and connected to you. If the tools say setup is incomplete, tell your owner to finish setup at https://breakpass.ai; do not try to work around it.

## When to alert

- A long task you were asked to watch has finished or failed.
- You need an answer or an approval before you can continue.
- Something your owner asked to be told about has happened.

Do not alert for routine progress, for things the owner did not ask about, or to repeat a message that was already delivered.

## How to choose

1. Call `get_setup_status` first. It says which channels work for this owner and what is left to set up.
2. Call `list_workflows` when follow-up may be needed. Pick by need:
   - **Inform**: one message, no reply needed.
   - **Acknowledge**: keep going until the owner confirms they saw it.
   - **Escalate**: a message and a call at once, then calls, until they acknowledge. Use it only when the owner must know or act before returning.
3. For a single message use `send_whatsapp` first, `send_sms` where WhatsApp is not available, and `make_call` only for something that needs attention now.
4. Start a workflow with `start_workflow` and always pass an `idempotency_key`, so a retry never sends twice.
5. Check what happened with `get_alert_status`. Delivered is not acknowledged, and silence is not a failure.
6. Stop a running alert with `cancel_alert` if it is no longer needed.

## Rules

- **An acknowledgement means your owner saw the alert. It is not approval to act.** Do not treat "acknowledged" as "yes, go ahead"; wait for an explicit instruction.
- Write the message as one short line of plain text. At most 150 characters if a call is possible; at most 600 otherwise. No markdown, no secrets, no passwords, codes or card numbers, and at most one https link.
- Recipients are aliases of verified numbers, never phone numbers. Never ask for or repeat a phone number.
- Every alert costs the owner money. Do not send test messages unless the owner asks, and do not retry a failed alert by another channel without checking `get_alert_status` first.
- **BreakPass is not for emergencies or life-safety use.** If a situation is an emergency, tell your owner to contact the emergency services; do not rely on BreakPass.
