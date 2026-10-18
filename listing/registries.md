# Registries and catalogs

| Store | What to submit | Notes |
|---|---|---|
| Official MCP Registry | `server.json` | `mcp-publisher init`, `login dns` (TXT record on breakpass.ai for `ai.breakpass`), `validate`, `publish`. Description at most 100 characters (checked). |
| Smithery | The URL | smithery.ai/new or `smithery mcp publish "https://mcp.breakpass.ai/mcp" -n @breakpass/breakpass`. Needs 401 plus OAuth metadata. |
| Glama | The GitHub repo | Claim via GitHub. |
| ClawHub | `clawhub/breakpass/` | `clawhub skill publish`. MIT-0. States the paid account and its cost. GitHub account age rule applies. |
| Gemini CLI | The repo | Topic `gemini-cli-extension`; `gemini-extension.json` at the root. |
| Docker MCP Catalog | A PR | `servers/breakpass/server.yaml`, `tools.json`, `readme.md`; MIT is fine. Phase 3. |
| Cline | A GitHub issue | Repo URL, 400x400 PNG, reason; installs from README or `llms-install.md`. |
| Grok Bot | A template | See `grok-template/`. Launch day. |
