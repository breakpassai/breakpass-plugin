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

const plugin = json("plugin.json");
const oai = plugin.extensions?.["com.openai"] ?? {};
const oa = oai.interface ?? {};
ok(oa.displayName?.length > 0 && oa.displayName.length <= 30, "openai: displayName 1 to 30");
ok(oa.shortDescription?.length > 0 && oa.shortDescription.length <= 30, `openai: shortDescription ${oa.shortDescription?.length} > 30`);
ok(oa.longDescription?.length > 0 && oa.longDescription.length <= 4000, `openai: longDescription ${oa.longDescription?.length} > 4000`);
ok(oa.developerName?.length > 0 && oa.developerName.length <= 80, "openai: developerName");
ok(/^#[0-9A-Fa-f]{6}$/.test(oa.brandColor ?? ""), "openai: brandColor must be a six-digit hex");
ok(!("screenshots" in oa), "openai: no screenshots (the portal rejects them without a UI template)");
ok((oa.defaultPrompt ?? []).length >= 1 && oa.defaultPrompt.length <= 3, "openai: 1 to 3 default prompts");
ok(new Set(oa.defaultPrompt).size === oa.defaultPrompt.length, "openai: default prompts must be unique");
for (const p of oa.defaultPrompt ?? []) ok(p.length <= 128 && !p.includes("\n") && !p.includes("@"), `openai: default prompt over 128, multi-line or with an @: ${p}`);
for (const c of oa.capabilities ?? []) ok(c.length <= 120, "openai: capability over 120");
const price = /\b(price|prices|pricing|plan|plans|subscription|subscribe|trial|free|discount|promo|promotion|offer|checkout|coupon)\b|\$\d/i;
for (const [k, v] of Object.entries({ longDescription: oa.longDescription, shortDescription: oa.shortDescription, prompts: (oa.defaultPrompt ?? []).join(" "), capabilities: (oa.capabilities ?? []).join(" ") }))
  ok(!price.test(v ?? ""), `openai ${k}: price, plan, trial or promo wording`);
for (const f of ["logo", "composerIcon", "onboardingSkill"]) ok(oa[f] && existsSync(oa[f]), `openai: ${f} file missing`);
const cases = oai.review?.test_cases ?? [];
ok(cases.filter((c) => c.id.startsWith("P")).length === 5 && cases.filter((c) => c.id.startsWith("N")).length === 3, "openai: 5 positive and 3 negative test cases");
for (const c of cases) ok(c.prompt && Array.isArray(c.tools_triggered) && c.expected_behavior, `openai test case ${c.id}: prompt, tools_triggered, expected_behavior`);
ok(oai.review && !("test_credentials" in oai.review) && !("reviewer_instructions" in oai.review), "openai: reviewer credentials must not be in plugin.json");
ok(oai.review?.commerce === false, "openai: review.commerce must be false");
ok(oai.publication?.release_notes?.length > 0, "openai: release_notes");
ok(Array.isArray(oai.publication?.countries) && oai.publication.countries.length > 100 && oai.publication.countries.every((c) => /^[A-Z]{2}$/.test(c)), "openai: publication.countries must be a list of ISO 3166 alpha-2 codes");
for (const c of ["AE", "CN", "CU", "IR", "KP", "RU", "BY"]) ok(!oai.publication?.countries?.includes(c), `openai: ${c} must not be in publication.countries`);
const ann = json("listing/openai-tool-annotations.json");
const TOOLS = ["get_setup_status", "list_workflows", "get_alert_status", "send_whatsapp", "send_sms", "make_call", "start_workflow", "cancel_alert"];
ok(JSON.stringify(ann.map((a) => a.tool).sort()) === JSON.stringify([...TOOLS].sort()), "openai-tool-annotations: all eight tools, each once");
for (const a of ann) ok(a.justification?.length > 20 && typeof a.readOnlyHint === "boolean" && typeof a.openWorldHint === "boolean" && typeof a.destructiveHint === "boolean", `openai-tool-annotations ${a.tool}: justification and three hints`);
const DESTRUCTIVE = ["send_whatsapp", "send_sms", "make_call", "start_workflow", "cancel_alert"];
ok(JSON.stringify(ann.filter((a) => a.destructiveHint).map((a) => a.tool).sort()) === JSON.stringify([...DESTRUCTIVE].sort()), "openai-tool-annotations: destructiveHint true on the four send tools and cancel_alert, as the server says (D-1306)");
ok(ann.filter((a) => a.readOnlyHint).length === 3 && ann.filter((a) => a.readOnlyHint && a.destructiveHint).length === 0, "openai-tool-annotations: three read-only tools, none destructive");
const cur = json(".cursor-plugin/plugin.json");
ok(cur.name === "breakpass" && cur.logo && existsSync(cur.logo), "cursor: name and committed logo");
ok(cur.homepage.includes("utm_source=store_cursor"), "cursor: homepage utm_source");
ok(reg.websiteUrl.includes("utm_source=mcp_official_registry"), "server.json: websiteUrl utm_source");

const claude = readFileSync("listing/claude.md", "utf8");
const oneLiner = /One-liner \| (.+) \|/.exec(claude)?.[1] ?? "";
ok(oneLiner.length > 0 && oneLiner.length <= 200, `claude one-liner ${oneLiner.length} (1 to 200)`);
const desc = /\*\*Description\*\*\n\n([\s\S]*?)\n\n\*\*Example prompts/.exec(claude)?.[1] ?? "";
ok(desc.length > 0 && desc.length <= 2000, `claude description ${desc.length} (1 to 2000)`);

const skill = readFileSync("skills/get-started/SKILL.md", "utf8");
ok(/acknowledgement means your owner saw the alert/i.test(skill) && /not approval/i.test(skill), "skill: acknowledgement is not approval");
ok(/not for emergencies/i.test(skill), "skill: not for emergencies");
const claw = readFileSync("clawhub/breakpass/SKILL.md", "utf8");
ok(/paid BreakPass account/i.test(claw) && /\$5 a month/.test(claw) && /\$7 month to month/.test(claw), "clawhub: must state the paid account and its cost");
ok(/license: MIT-0/.test(claw), "clawhub: MIT-0");

const secret = /(sk-[A-Za-z0-9]{16,}|xox[abp]-|ghp_[A-Za-z0-9]{20,}|Bearer\s+[A-Za-z0-9._-]{20,}|-----BEGIN|\+\d{9,15})/;
for (const f of files.filter((f) => /\.(md|json|mjs)$/.test(f) && f !== "scripts/check.mjs"))
  ok(!secret.test(readFileSync(f, "utf8")), `${f}: looks like a key, token or phone number`);
for (const f of files.filter((f) => /\.(md|json)$/.test(f)))
  ok(!/credit/i.test(readFileSync(f, "utf8")), `${f}: the word "credit(s)" is not used`);

const clawDesc = /^description: (.*)$/m.exec(claw)?.[1] ?? "";
ok(clawDesc.length > 0 && clawDesc.length < 1024 && !/[<>]/.test(clawDesc), "clawhub: description under 1024 characters, no angle brackets");
for (const f of ["assets/logo-512.png", "assets/logo.png", "assets/icon.png", "assets/composer-icon.png", "clawhub/breakpass/LICENSE"]) ok(existsSync(f), `${f} is missing`);
ok(existsSync("LICENSE") && /MIT License/.test(readFileSync("LICENSE", "utf8")), "LICENSE (MIT)");

if (fail.length) {
  console.error(fail.map((m) => `FAIL ${m}`).join("\n"));
  process.exit(1);
}
console.log("ok: all checks passed");
