# BreakPass plugin

Let your AI agent reach you by **WhatsApp, SMS or phone call**, and see whether you got it. BreakPass is a product of X Labs L.L.C-FZ ([breakpass.ai](https://breakpass.ai)).

This repository holds the plugin and extension files only: manifests, a skill and listing text. The BreakPass server is not in this repository. It is a remote MCP server at `https://mcp.breakpass.ai/mcp` (Streamable HTTP, OAuth 2.1 with PKCE).

**You need a paid BreakPass account** ([pricing](https://breakpass.ai/pricing/)). There is no free tier. Sign in happens in your browser when your agent connects; this repository contains no keys or tokens.

## Install

| Client | How |
|---|---|
| **Cursor** | [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=breakpass&config=eyJ1cmwiOiJodHRwczovL21jcC5icmVha3Bhc3MuYWkvbWNwIn0=), or install the plugin from the Cursor Marketplace. |
| **Claude** | Add the connector `https://mcp.breakpass.ai/mcp` under Settings, Connectors, or install the BreakPass plugin from the Claude directory. |
| **ChatGPT / Codex** | Install BreakPass from the plugin directory. |
| **Gemini CLI** | `gemini extensions install https://github.com/breakpassai/breakpass-plugin` |
| **Any MCP client** | Add a remote server with the URL above (Streamable HTTP). See [llms-install.md](llms-install.md). |

## What it does

Eight tools: `get_setup_status`, `list_workflows`, `send_whatsapp`, `send_sms`, `make_call`, `start_workflow`, `get_alert_status`, `cancel_alert`. The skill in `skills/get-started/SKILL.md` tells the agent when and how to alert you, and that an acknowledgement is not approval to act.

## What it does not do

BreakPass is **not for emergencies or life-safety use.** An acknowledgement means you saw the alert; it is not a go-ahead for your agent. Your phone number never appears in a tool result.

## Files

- `plugin.json`, `mcp.json`, `skills/`: Agent Plugins layout (OpenAI, Codex).
- `.cursor-plugin/plugin.json`: Cursor. `.claude-plugin/plugin.json`, `.mcp.json`: Claude.
- `gemini-extension.json`, `GEMINI.md`: Gemini CLI.
- `server.json`: the official MCP Registry (`ai.breakpass/breakpass`).
- `clawhub/breakpass/SKILL.md`: the ClawHub skill (MIT-0).
- `listing/`: the text for each store. `grok-template/`: the Grok Bot template.
- `assets/`: logos.

## Licence

MIT, except `clawhub/breakpass/`, which is MIT-0. See [LICENSE](LICENSE).

Support: [breakpass.ai/support](https://breakpass.ai/support/) or hello@breakpass.ai. Privacy: [breakpass.ai/privacy](https://breakpass.ai/privacy/). Terms: [breakpass.ai/terms](https://breakpass.ai/terms/).
