# BreakPass plugin

Let your AI agent reach you by **WhatsApp, SMS or phone call**, and see whether you got it. BreakPass is a product of X Labs L.L.C-FZ ([breakpass.ai](https://breakpass.ai)).

This repository holds the plugin and extension files only: manifests, a skill and the Grok Bot template. The BreakPass server is not in this repository. It is a remote MCP server at `https://mcp.breakpass.ai/mcp` (Streamable HTTP, OAuth 2.1 with PKCE).

**Requires a BreakPass account** ([breakpass.ai](https://breakpass.ai)). A paid account is needed to send alerts. Sign-in happens in your browser when your agent connects; this repository contains no keys or tokens.

## Install

Each client needs the same server address: `https://mcp.breakpass.ai/mcp` (Streamable HTTP, sign-in with OAuth). The store listings are not live yet, so use the steps below.

| Client | Steps |
|---|---|
| **Cursor** | [Add to Cursor](https://cursor.com/install-mcp?name=breakpass&config=eyJ1cmwiOiJodHRwczovL21jcC5icmVha3Bhc3MuYWkvbWNwIn0=). Cursor asks you to confirm, then opens BreakPass sign-in. |
| **Claude** (claude.ai, Desktop) | Settings, Connectors, Add custom connector. Paste the address and sign in. |
| **Claude Code** | `claude mcp add --transport http breakpass https://mcp.breakpass.ai/mcp`, then run `/mcp` and sign in. |
| **ChatGPT** | Turn on developer mode in the app settings, add a custom app with the address, and sign in. |
| **Grok** | grok.com, Connectors, Custom connector: paste the address and sign in. |
| **Gemini CLI** | `gemini extensions install https://github.com/breakpassai/breakpass-plugin` |
| **Any MCP client** | Add a remote server with the address above. See [llms-install.md](llms-install.md). |

## Tools

| Tool | What it does |
|---|---|
| `get_setup_status` | Shows which channels work and what is left to set up. |
| `list_workflows` | Lists Inform, Acknowledge and Escalate with their steps. |
| `send_whatsapp` | Sends one WhatsApp message to your verified number. |
| `send_sms` | Sends one SMS to your verified number. |
| `make_call` | Calls you and reads the message aloud. |
| `start_workflow` | Starts a workflow: Inform (one message), Acknowledge (up to three messages until you confirm) or Escalate (a message and a call at once, then up to two more calls until you press 1). |
| `get_alert_status` | Says whether an alert was delivered, answered and acknowledged. |
| `cancel_alert` | Stops an alert that is no longer needed. |

The skill in `skills/get-started/SKILL.md` tells the agent when and how to alert you, and that an acknowledgement is not approval to act.

## What it does not do

BreakPass is **not designed or guaranteed for emergency or life-safety use**; delivery can fail, and it can't contact emergency services. An acknowledgement means you saw the alert; it is not a go-ahead for your agent. Your phone number never appears in a tool result.

## Files

- `plugin.json`, `mcp.json`, `skills/`: Agent Plugins layout (OpenAI, Codex).
- `.cursor-plugin/plugin.json`: Cursor. `.claude-plugin/plugin.json`, `.mcp.json`: Claude.
- `gemini-extension.json`, `GEMINI.md`: Gemini CLI.
- `server.json`: the official MCP Registry (`ai.breakpass/breakpass`).
- `clawhub/breakpass/SKILL.md`: the ClawHub skill (MIT-0).
- `grok-template/`: Breaky, the Grok Bot template (the full template is published from Grok Bot; this file is its short form).
- `assets/`: logos.

## Licence

MIT, except `clawhub/breakpass/`, which is MIT-0. See [LICENSE](LICENSE).

Support: [breakpass.ai/support](https://breakpass.ai/support/) or hello@breakpass.ai. Privacy: [breakpass.ai/privacy](https://breakpass.ai/privacy/). Terms: [breakpass.ai/terms](https://breakpass.ai/terms/).
