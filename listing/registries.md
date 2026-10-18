# Registries and catalogs

Tracking links: each listing's website field uses its own `utm_source` (the site keeps `utm_source` in the session and copies it into the sign-up record).

| Store | What to submit | Notes |
|---|---|---|
| Official MCP Registry | `server.json` | `mcp-publisher login dns`, `validate`, `publish`. Name `ai.breakpass/breakpass`; description 84 characters; `websiteUrl` carries `utm_source=mcp_official_registry`. Needs the DNS TXT record for `ai.breakpass`. |
| Smithery | The URL | smithery.ai/new. Needs 401 plus OAuth metadata. Short: "Let your AI agents call you when it matters: WhatsApp, SMS or a call through Do Not Disturb." Website link `?utm_source=mcp_smithery`. Tags: notifications, alerts, human-in-the-loop, phone, sms, whatsapp. |
| Glama | The registry listing | Claim by domain (TXT at `_glama-claim.breakpass.ai` or `/.well-known/glama.json`), then use Glama's listing details as the source. Website link `?utm_source=mcp_glama`. |
| PulseMCP | Registry description | When submissions reopen. `?utm_source=mcp_pulsemcp`. |
| mcp.so | The GitHub repo URL | Free review path. `?utm_source=mcp_mcpso`. |
| ClawHub | `clawhub/breakpass/` | `clawhub skill publish`. MIT-0. States the paid account and its price. `?utm_source=mcp_clawhub`. |
| Gemini CLI | The repo | Topic `gemini-cli-extension`; `gemini-extension.json` at the root. |
| Docker MCP Catalog | A PR | `servers/breakpass/server.yaml`, `tools.json`, `readme.md`. |
| Cline | A GitHub issue | Repo URL, 400x400 PNG, reason; installs from README or `llms-install.md`. |
| Grok Bot | A template | See `grok-template/`. |

Link format: `https://breakpass.ai/docs/mcp/?utm_source=<tag>&utm_medium=directory&utm_campaign=mcp_launch`.
