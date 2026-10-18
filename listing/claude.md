# Claude directory (connector and plugin bundle)

Limits: name at most 100 characters; one-liner at most 200; description at most 2,000; 1 to 5 categories; permanent slug `breakpass`. Attestations: financial transactions = No. Privacy policy must say alert text is sent off-platform.

| Field | Value |
|---|---|
| Name | BreakPass |
| Slug | breakpass |
| One-liner | Your AI agent alerts you by WhatsApp, SMS or phone call, and sees whether you got it. |
| Categories | Productivity; Communication |
| Docs | https://breakpass.ai/docs/mcp/ |
| Privacy | https://breakpass.ai/privacy/ |
| Support | https://breakpass.ai/support/ |
| Icon | assets/logo-512.png |

**Description**

BreakPass connects Claude to your phone. When Claude finishes a long task, needs your approval, or sees something go wrong, it can send you a WhatsApp message, an SMS or a phone call through BreakPass, and read back whether the alert was delivered, answered and acknowledged.

Choose how persistent it is. Inform sends one message. Acknowledge keeps trying until you confirm. Escalate sends a message and a call together, then keeps calling until you answer. Calls ring through Do Not Disturb once you save the BreakPass contact on your phone.

An acknowledgement means you saw the alert; it is never approval for Claude to act. Alert text is sent to your phone through WhatsApp, SMS or a phone call, so do not put passwords or secrets in an alert. Your phone number is never shown to Claude. A paid BreakPass account is required; you sign in and approve access in your browser. BreakPass is not for emergencies or life-safety use.

**Example prompts (3)**

1. Ask me to acknowledge via BreakPass when the contract is ready to sign.
2. Escalate to me via BreakPass if the shop goes offline.
3. Check my BreakPass setup, then text me via BreakPass when the deploy finishes.

**Plugin bundle:** `.claude-plugin/plugin.json`, `.mcp.json`, `skills/get-started/SKILL.md`.
