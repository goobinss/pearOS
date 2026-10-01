import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const errors = [];
for (const file of files) {
  if (!existsSync(file)) continue;
  if (/(^|\/)\.env(?:\.|$)/.test(file) && !file.endsWith(".env.example")) errors.push(`${file}: environment file`);
  if (/(^|\/)(secrets|credentials|private|database|db|services\/api)(\/|$)/i.test(file)) errors.push(`${file}: private path`);
  if (/\.(pem|key)$/i.test(file)) errors.push(`${file}: key file`);
  if (![".ts", ".tsx", ".js", ".mjs", ".json"].includes(extname(file)) || file === "pnpm-lock.yaml" || file === "scripts/check-boundary.mjs") continue;
  const contents = readFileSync(file, "utf8");
  if (/SUPABASE_SERVICE_ROLE_KEY|SNAPSHOT_SECRET|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|ghp_[A-Za-z0-9]{30,}/.test(contents)) errors.push(`${file}: sensitive marker`);
  if ((file.startsWith("apps/") || file.startsWith("packages/")) && /(?:from\s*["']|import\s*\(["'])(?:@pear-core|pear-core\/|\.\.\/\.\.\/pear-core)/.test(contents)) errors.push(`${file}: private backend import`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Public boundary check passed (${files.length} files).`);
