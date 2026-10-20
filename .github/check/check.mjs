// Repository checks for the BreakPass plugin. Run from the repo root: `node .github/check/check.mjs`.
//
// 1. Manifests against their published JSON schemas. Each schema is fetched from its published URL; if that fails, the
//    vendored copy in .github/check/schemas/ is used (sources and dates in schemas/sources.json) and a warning is
//    printed. Every *.json file in the repo must be covered: a file with a `$schema` is checked against it, the known
//    manifests below against their client's schema, and an unknown .json file fails the run (add it here).
// 2. Manifests with no published schema (Claude's .mcp.json, gemini-extension.json): a small structural check.
// 3. Every SKILL.md: YAML front matter with `name` (lowercase letters, digits and single hyphens, at most 64, equal to
//    its folder's name) and `description` (1 to 1024 characters), as in the Agent Skills format.
// 4. Brand contrast in every .svg, .css and .html file (WCAG 2.x relative luminance):
//    - CSS (a rule block or an inline style="..."): when one block sets both `color` and `background`/
//      `background-color`, the pair needs at least 4.5:1, and white text on lime (#C6FE1E) always fails.
//    - SVG: when the image has a full-canvas background <rect>, every other fill or stroke drawn on it (text and
//      logo glyphs alike) needs at least 4.5:1 against it, and white on lime always fails. An SVG with no
//      background rect (a transparent glyph) has no pair to check.
//    Only hex colors and the names white and black are read; other color syntax is not checked.
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import Ajv07 from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parse as parseYaml } from "yaml";

const ROOT = process.cwd();
const HERE = dirname(new URL(import.meta.url).pathname);
const SOURCES = JSON.parse(readFileSync(join(HERE, "schemas", "sources.json"), "utf8"));
const LIME = "#c6fe1e";
const MIN_CONTRAST = 4.5;

const failures = [];
const fail = (file, msg) => failures.push(`${file}: ${msg}`);
const ok = (msg) => console.log(`ok   ${msg}`);

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(relative(ROOT, p));
  }
  return out;
}
const files = walk(ROOT).filter((f) => !f.startsWith(".github/"));

// ---- 1 and 2: manifests ----------------------------------------------------------------------------------------
// Manifests whose format has no `$schema` field: the client's published schema.
const KNOWN = {
  ".claude-plugin/plugin.json": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  ".cursor-plugin/plugin.json": "https://raw.githubusercontent.com/cursor/plugins/main/schemas/plugin.schema.json",
};
const STRUCTURAL = {
  ".mcp.json": checkClaudeMcp,
  "gemini-extension.json": checkGeminiExtension,
};

async function loadSchema(url) {
  const src = SOURCES[url];
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const schema = await res.json();
    return { schema, from: "published" };
  } catch (e) {
    if (!src) throw new Error(`cannot fetch ${url} (${e.message}) and no vendored copy is listed in sources.json`);
    console.warn(`warn ${url} not reachable (${e.message}); using the vendored copy of ${src.fetched}`);
    return { schema: JSON.parse(readFileSync(join(HERE, "schemas", src.file), "utf8")), from: "vendored" };
  }
}

async function validate(file, data, url) {
  const { schema, from } = await loadSchema(url);
  const is2020 = String(schema.$schema ?? "").includes("2020-12");
  const ajv = is2020 ? new Ajv2020({ allErrors: true, strict: false }) : new Ajv07({ allErrors: true, strict: false });
  addFormats(ajv);
  const check = ajv.compile(schema);
  if (check(data)) ok(`${file} matches ${url} (${from})`);
  else for (const e of check.errors) fail(file, `${e.instancePath || "/"} ${e.message} ${JSON.stringify(e.params)}`);
}

function checkServers(file, servers, allowed) {
  if (!servers || typeof servers !== "object" || Object.keys(servers).length === 0)
    return fail(file, "mcpServers must be a non-empty object");
  for (const [name, s] of Object.entries(servers)) {
    const keys = Object.keys(s ?? {});
    if (!allowed(s)) fail(file, `mcpServers.${name}: unexpected shape ${JSON.stringify(keys)}`);
    for (const k of ["url", "httpUrl"])
      if (k in s && !/^https:\/\/\S+$/.test(s[k])) fail(file, `mcpServers.${name}.${k} must be an https URL`);
  }
}
function checkClaudeMcp(file, d) {
  checkServers(file, d.mcpServers, (s) =>
    s.type === "stdio" ? typeof s.command === "string" : ["http", "sse"].includes(s.type) && typeof s.url === "string",
  );
}
function checkGeminiExtension(file, d) {
  if (typeof d.name !== "string" || !/^[a-z0-9-]+$/.test(d.name)) fail(file, "name must be lowercase letters, digits, -");
  if (typeof d.version !== "string" || d.version === "") fail(file, "version is required");
  if ("contextFileName" in d && !files.includes(d.contextFileName)) fail(file, `${d.contextFileName} does not exist`);
  if ("mcpServers" in d)
    checkServers(file, d.mcpServers, (s) => ["httpUrl", "url", "command"].some((k) => typeof s[k] === "string"));
}

for (const file of files.filter((f) => f.endsWith(".json"))) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail(file, `not valid JSON (${e.message})`);
    continue;
  }
  if (typeof data.$schema === "string") await validate(file, data, data.$schema);
  else if (KNOWN[file]) await validate(file, data, KNOWN[file]);
  else if (STRUCTURAL[file]) {
    const before = failures.length;
    STRUCTURAL[file](file, data);
    if (failures.length === before) ok(`${file} structural check (no published schema)`);
  } else fail(file, "unknown JSON file: add its schema to .github/check/check.mjs");
}

// ---- 3: SKILL.md front matter ----------------------------------------------------------------------------------
for (const file of files.filter((f) => basename(f) === "SKILL.md")) {
  const text = readFileSync(file, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) {
    fail(file, "no YAML front matter (--- ... ---) at the top");
    continue;
  }
  let fm;
  try {
    fm = parseYaml(m[1]);
  } catch (e) {
    fail(file, `front matter is not valid YAML (${e.message})`);
    continue;
  }
  const before = failures.length;
  const folder = basename(dirname(file));
  if (typeof fm?.name !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name) || fm.name.length > 64)
    fail(file, "name: lowercase letters, digits and single hyphens, at most 64 characters");
  else if (fm.name !== folder) fail(file, `name "${fm.name}" differs from its folder "${folder}"`);
  if (typeof fm?.description !== "string" || fm.description.trim() === "" || fm.description.length > 1024)
    fail(file, "description: 1 to 1024 characters");
  if (failures.length === before) ok(`${file} front matter`);
}

// ---- 4: brand contrast -----------------------------------------------------------------------------------------
function hex(c) {
  const v = String(c).trim().toLowerCase();
  if (v === "white") return "#ffffff";
  if (v === "black") return "#000000";
  if (/^#[0-9a-f]{3}$/.test(v)) return `#${[...v.slice(1)].map((x) => x + x).join("")}`;
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  return null;
}
function luminance(h) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
function pair(file, where, fg, bg) {
  if (!fg || !bg) return;
  if (bg === LIME && fg === "#ffffff") return fail(file, `${where}: white on lime; text on lime is dark ink`);
  const r = contrast(fg, bg);
  if (r < MIN_CONTRAST) fail(file, `${where}: ${fg} on ${bg} is ${r.toFixed(2)}:1, below ${MIN_CONTRAST}:1`);
  else ok(`${file} ${where}: ${fg} on ${bg} ${r.toFixed(2)}:1`);
}
function cssBlocks(file, text) {
  const blocks = [...text.matchAll(/\{([^{}]*)\}/g), ...text.matchAll(/style\s*=\s*"([^"]*)"/g)].map((m) => m[1]);
  for (const b of blocks) {
    const color = b.match(/(?:^|[;\s])color\s*:\s*([^;!]+)/)?.[1];
    const bg = b.match(/background(?:-color)?\s*:\s*([^;!\s]+)/)?.[1];
    if (color && bg) pair(file, `"${b.trim().slice(0, 60)}"`, hex(color), hex(bg));
  }
}
function svgPairs(file, text) {
  const vb = text.match(/viewBox="([^"]+)"/)?.[1]?.trim().split(/[\s,]+/).map(Number);
  const rects = [...text.matchAll(/<rect\b[^>]*>/g)].map((m) => m[0]);
  const attr = (tag, n) => tag.match(new RegExp(`\\b${n}="([^"]+)"`))?.[1];
  const full = rects.find((r) => {
    const w = attr(r, "width");
    const h = attr(r, "height");
    return (w === "100%" && h === "100%") || (vb && Number(w) >= vb[2] && Number(h) >= vb[3]);
  });
  const bg = full && hex(attr(full, "fill"));
  if (!bg) return;
  const rest = text.replace(full, "");
  const fgs = new Set(
    [...rest.matchAll(/\b(?:fill|stroke)\s*[=:]\s*"?\s*(#[0-9a-fA-F]{3,6}|white|black)\b/g)].map((m) => hex(m[1])),
  );
  for (const fg of fgs) pair(file, "glyph on background", fg, bg);
}
for (const file of files.filter((f) => /\.(svg|css|html?)$/i.test(f))) {
  const text = readFileSync(file, "utf8");
  if (/\.svg$/i.test(file)) svgPairs(file, text);
  cssBlocks(file, text);
}

if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures) console.error(`FAIL ${f}`);
  process.exit(1);
}
console.log("\nAll checks passed.");
