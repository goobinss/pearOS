import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
const skipped = new Set([
  ".git",
  ".local-archive",
  "node_modules",
  ".next",
  ".agents",
  ".codex",
  ".aws",
  "test-results",
  "playwright-report",
]);
const files = [];
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (skipped.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (
      e.isFile() &&
      !(/(^|\/)\.env(?:\.|$)/.test(p) && !p.endsWith(".env.example"))
    )
      files.push(p);
  }
}
walk(".");
const errors = [];
for (const file of files) {
  if (
    /(^|\/)(secrets|credentials|private|database|db)(\/|$)/i.test(file) ||
    /\.(pem|key)$/i.test(file)
  )
    errors.push(`${file}: prohibited private artifact`);
  if (
    ![".ts", ".tsx", ".js", ".mjs", ".json"].includes(extname(file)) ||
    file === "scripts/check-boundary.mjs"
  )
    continue;
  const content = readFileSync(file, "utf8");
  if (
    /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|ghp_[A-Za-z0-9]{30,}/.test(content)
  )
    errors.push(`${file}: credential marker`);
  if (
    /(?:from\s*["']|import\s*\(["'])(?:@pear-core|pear-core\/|\.\.\/\.\.\/pear-core)/.test(
      content,
    )
  )
    errors.push(`${file}: private backend import`);
  if (
    file.startsWith("apps/web/app/api/") &&
    /export\s+(?:async\s+)?function\s+(?:POST|PUT|PATCH|DELETE)/.test(content)
  )
    errors.push(`${file}: public write route`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Public boundary check passed (${files.length} files; local env excluded, Git history scanned separately).`,
  );
