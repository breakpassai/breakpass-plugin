# BreakPass

BreakPass lets you alert your owner by WhatsApp, SMS or phone call and shows whether they got it. It needs a paid BreakPass account that the owner has set up and connected (https://breakpass.ai).

Use `get_setup_status` first. Use `start_workflow` (Inform, Acknowledge, Escalate) when follow-up may be needed, and `send_whatsapp`, `send_sms` or `make_call` for one message. Pass an `idempotency_key` to `start_workflow`. Read results with `get_alert_status`.

An acknowledgement means your owner saw the alert; it is not approval to act. Keep messages to one plain line, at most 150 characters if a call is possible. BreakPass is not for emergencies or life-safety use.
