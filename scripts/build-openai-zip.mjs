// Builds the OpenAI plugin upload ZIP from this repository: dist/breakpass-openai.zip (not committed).
// Contents: plugin.json, mcp.json, skills/, and the two assets the plugin names. No screenshots, no reviewer credentials.
// Run on main after `node scripts/check.mjs`: node scripts/build-openai-zip.mjs
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";

execFileSync("node", ["scripts/check.mjs"], { stdio: "inherit" });
const plugin = JSON.parse(readFileSync("plugin.json", "utf8"));
const oa = plugin.extensions["com.openai"];
const files = ["plugin.json", "mcp.json", "skills/get-started/SKILL.md", oa.interface.logo, oa.interface.composerIcon].map((f) => f.replace(/^\.\//, ""));
for (const f of files) if (!existsSync(f)) throw new Error(`missing ${f}`);
const forbidden = /test_credentials|reviewer_instructions|screenshots/;
if (forbidden.test(readFileSync("plugin.json", "utf8"))) throw new Error("plugin.json carries a field the portal rejects");
mkdirSync("dist", { recursive: true });
rmSync("dist/breakpass-openai.zip", { force: true });
execFileSync("zip", ["-q", "-X", "dist/breakpass-openai.zip", ...files], { stdio: "inherit" });
console.log(`built dist/breakpass-openai.zip (${files.length} files)`);
