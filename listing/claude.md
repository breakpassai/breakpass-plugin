# Claude directory (connector and plugin bundle)

Limits: name at most 100 characters; one-liner at most 200; description at most 2,000; 1 to 5 categories; permanent slug `breakpass`. Attestations: financial transactions = No. The privacy policy says alert text is sent off-platform.

| Field | Value |
|---|---|
| Name | BreakPass |
| Slug | breakpass |
| One-liner | Let Claude reach you by WhatsApp, SMS or a phone call when something needs you, escalating until you acknowledge. |
| Categories | Communication; Productivity; Developer tools |
| Docs | https://breakpass.ai/docs/mcp/ |
| Privacy | https://breakpass.ai/privacy/ |
| Support | https://breakpass.ai/support/ |
| Icon | assets/logo-400.png |

**Description**

BreakPass lets Claude reach you when something needs your attention and you're away from the chat. It sends a WhatsApp message or SMS to your own verified phone number, or calls you and reads the message out loud.

Three ways to reach you:
- Inform: one message, no reply needed.
- Acknowledge: messages repeat until you confirm you saw it.
- Escalate: a message, then phone calls until you press 1 on a call.

Workflows run on BreakPass servers, so an alert keeps going even if the conversation ends. You can ask whether an alert was delivered or acknowledged, and cancel one that's no longer needed.

What you need: a BreakPass account with at least one verified phone number. You sign in with OAuth. Claude only sees an alias for each verified number; phone numbers never appear in tool results.

Limitations:
- BreakPass only contacts numbers the account owner has verified and opted in. It can't message customers, contacts or lists.
- An acknowledgement means you saw the alert. It is not approval for any action.
- Calls can get through Do Not Disturb only if you allow it on your phone.
- SMS isn't offered in every country.
- Sending an alert uses your BreakPass account balance.
- Not for emergencies or life-safety use.

Each alert is paid from your account balance; no money moves through the tools. A paid BreakPass account is required.

**Example prompts (4)**

1. Send me an SMS saying the nightly backup finished.
2. Call me and read this out loud: the deploy is blocked waiting for me.
3. Did I acknowledge the last alert you sent me?
4. Escalate this to me until I acknowledge: the payment provider is returning errors.

**Plugin bundle:** `.claude-plugin/plugin.json`, `.mcp.json`, `skills/get-started/SKILL.md` ("when and how to reach your owner"; an acknowledgement is not approval).
