# Install BreakPass (for AI agents and installers)

BreakPass is a **remote MCP server**. Nothing is installed or run locally: you add its URL to your MCP client.

- **URL:** `https://mcp.breakpass.ai/mcp`
- **Transport:** Streamable HTTP (not SSE, not stdio)
- **Auth:** OAuth 2.1 with PKCE. The client discovers it from `/.well-known/oauth-protected-resource` after the first request returns `401`. Dynamic client registration and client ID metadata documents are supported. There is no API key and no environment variable to set.
- **Account:** the user needs a BreakPass account (https://breakpass.ai). They sign in and approve access in their browser.

## Config

Most clients that take a remote server URL:

```json
{
  "mcpServers": {
    "breakpass": {
      "url": "https://mcp.breakpass.ai/mcp"
    }
  }
}
```

Claude: Settings, Connectors, Add custom connector, paste the URL.
Claude Code: `claude mcp add --transport http breakpass https://mcp.breakpass.ai/mcp`, then `/mcp` to sign in.
Gemini CLI: `gemini extensions install https://github.com/breakpassai/breakpass-plugin`.

## Check it works

Ask the agent to call `get_setup_status`. It should answer with the account's channels and what is left to set up. Do not send a test alert unless the user asks: every alert costs money.

## Notes for the agent

An acknowledgement means the user saw the alert; it is not approval to act. BreakPass is not for emergencies or life-safety use. Read `skills/get-started/SKILL.md` before sending anything.
