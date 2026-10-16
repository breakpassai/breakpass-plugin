// Offline checks for the plugin repo: JSON files parse, listing limits hold, the OpenAI listing has no price words,
// nothing looks like a secret, the registry description fits. Run: node scripts/check.mjs
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const fail = [];
const ok = (cond, msg) => {
  if (!cond) fail.push(msg);
};
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    if (n === ".git" || n === "node_modules") return [];
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(".");
for (const f of files.filter((f) => f.endsWith(".json"))) {
  try {
    json(f);
  } catch (e) {
    fail.push(`${f}: not valid JSON`);
  }
}

const MCP = "https://mcp.breakpass.ai/mcp";
const mcp = json("mcp.json");
ok(mcp.mcpServers.breakpass.url === MCP, "mcp.json: wrong url");
ok(mcp.mcpServers.breakpass.type === "streamable-http", "mcp.json: not streamable-http");
ok(json(".mcp.json").mcpServers.breakpass.url === MCP, ".mcp.json: wrong url");
ok(json("gemini-extension.json").mcpServers.breakpass.httpUrl === MCP, "gemini-extension.json: wrong url");

const reg = json("server.json");
ok(reg.name === "ai.breakpass/breakpass", "server.json: name");
ok(reg.$schema.includes("2025-12-11"), "server.json: schema version");
ok(reg.description.length <= 100, `server.json: description ${reg.description.length} > 100`);
ok(reg.remotes?.[0]?.url === MCP && reg.remotes[0].type === "streamable-http", "server.json: remote");

for (const f of ["plugin.json", ".cursor-plugin/plugin.json", ".claude-plugin/plugin.json"]) {
  const p = json(f);
  ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.name), `${f}: name must be kebab-case`);
  ok(p.license === "MIT", `${f}: license`);
}

const oa = json("listing/openai.json");
ok(oa.displayName.length <= 30, "openai: displayName > 30");
ok(oa.shortDescription.length <= 30, `openai: shortDescription ${oa.shortDescription.length} > 30`);
ok(oa.defaultPrompts.length <= 3, "openai: more than 3 default prompts");
const price = /\b(price|prices|pricing|plan|plans|subscription|subscribe|trial|free|discount|promo|promotion|offer|checkout|coupon)\b|\$\d/i;
for (const [k, v] of Object.entries({ description: oa.description, shortDescription: oa.shortDescription, prompts: oa.defaultPrompts.join(" ") }))
  ok(!price.test(v), `openai ${k}: price, plan, trial or promo wording`);
const root = json("plugin.json").interface;
ok(root.shortDescription === oa.shortDescription && root.displayName === oa.displayName, "plugin.json interface differs from listing/openai.json");
ok(JSON.stringify(root.defaultPrompts) === JSON.stringify(oa.defaultPrompts), "plugin.json default prompts differ from listing/openai.json");

const claude = readFileSync("listing/claude.md", "utf8");
const oneLiner = /One-liner \| (.+) \|/.exec(claude)?.[1] ?? "";
ok(oneLiner.length > 0 && oneLiner.length <= 200, `claude one-liner ${oneLiner.length} (1 to 200)`);
const desc = /\*\*Description\*\*\n\n([\s\S]*?)\n\n\*\*Example prompts/.exec(claude)?.[1] ?? "";
ok(desc.length > 0 && desc.length <= 2000, `claude description ${desc.length} (1 to 2000)`);

const skill = readFileSync("skills/get-started/SKILL.md", "utf8");
ok(/acknowledgement means your owner saw the alert/i.test(skill) && /not approval/i.test(skill), "skill: acknowledgement is not approval");
ok(/not for emergencies/i.test(skill), "skill: not for emergencies");
const claw = readFileSync("clawhub/breakpass/SKILL.md", "utf8");
ok(/paid BreakPass account/i.test(claw) && /\$7 a month/.test(claw), "clawhub: must state the paid account and its cost");
ok(/license: MIT-0/.test(claw), "clawhub: MIT-0");

const secret = /(sk-[A-Za-z0-9]{16,}|xox[abp]-|ghp_[A-Za-z0-9]{20,}|Bearer\s+[A-Za-z0-9._-]{20,}|-----BEGIN|\+\d{9,15})/;
for (const f of files.filter((f) => /\.(md|json|mjs)$/.test(f) && f !== "scripts/check.mjs"))
  ok(!secret.test(readFileSync(f, "utf8")), `${f}: looks like a key, token or phone number`);
for (const f of files.filter((f) => /\.(md|json)$/.test(f)))
  ok(!/credit/i.test(readFileSync(f, "utf8")), `${f}: the word "credit(s)" is not used`);

for (const f of ["assets/logo-512.png", "assets/composer-icon.png", "clawhub/breakpass/LICENSE"]) ok(existsSync(f), `${f} is missing`);
ok(existsSync("LICENSE") && /MIT License/.test(readFileSync("LICENSE", "utf8")), "LICENSE (MIT)");

if (fail.length) {
  console.error(fail.map((m) => `FAIL ${m}`).join("\n"));
  process.exit(1);
}
console.log("ok: all checks passed");
