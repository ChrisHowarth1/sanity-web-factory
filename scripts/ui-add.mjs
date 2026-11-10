#!/usr/bin/env node
// pnpm ui:add <component...>
// Runs the shadcn CLI in packages/ui, then rewrites the imports it generates
// to relative paths. The CLI doesn't resolve this monorepo's aliases cleanly:
// it has written `from "cn"` and even installed an unrelated npm package
// called "cn", so this also removes that dependency if it reappears.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ui = path.join(root, "packages/ui");
const args = process.argv.slice(2);

if (args.length) {
  execFileSync("pnpm", ["dlx", "shadcn@latest", "add", ...args], { cwd: ui, stdio: "inherit" });
}

const dir = path.join(ui, "src/components");
for (const file of readdirSync(dir).filter((f) => /\.tsx?$/.test(f))) {
  const full = path.join(dir, file);
  const before = readFileSync(full, "utf8");
  const after = before
    .replace(/from ["'](?:cn|@factory\/ui\/lib\/utils|@factory\/ui\/utils|@\/lib\/utils)["']/g, 'from "../lib/utils"')
    .replace(/from ["']@factory\/ui\/components\/([\w-]+)["']/g, 'from "./$1"');
  if (after !== before) {
    writeFileSync(full, after);
    console.log(`fixed imports in components/${file}`);
  }
}

const pkgPath = path.join(ui, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
if (pkg.dependencies?.cn) {
  delete pkg.dependencies.cn;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log('removed the unrelated "cn" package; run pnpm install');
}
