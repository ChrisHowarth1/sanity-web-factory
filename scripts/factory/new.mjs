#!/usr/bin/env node
// pnpm factory:new <name> [--title "Site title"] [--blocks hero,cta,faq]
//
// Phase 1: copies apps/starter into apps/<name> and rewrites its config.
// Phase 4 adds the API steps (Sanity project, tokens, CORS, Netlify sites,
// build hook, webhook): see the architecture doc.
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { title: { type: "string" }, blocks: { type: "string" } },
});

const name = positionals[0];
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('Usage: pnpm factory:new <name> [--title "Site title"] [--blocks hero,cta]\n<name> must be lowercase letters, numbers and dashes.');
  process.exit(1);
}

const source = path.join(root, "apps/starter");
const target = path.join(root, "apps", name);
if (existsSync(target)) {
  console.error(`apps/${name} already exists.`);
  process.exit(1);
}

const skip = new Set(["node_modules", ".next", ".env", ".env.local", ".netlify", ".sanity", "next-env.d.ts"]);
cpSync(source, target, { recursive: true, filter: (src) => !skip.has(path.basename(src)) });

// package.json name
const pkgPath = path.join(target, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = `@factory/${name}`;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

// factory.config.ts
const title = values.title ?? name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const configPath = path.join(target, "factory.config.ts");
let config = readFileSync(configPath, "utf8")
  .replace(/name: "[^"]*"/, `name: "${name}"`)
  .replace(/title: "[^"]*"/, `title: ${JSON.stringify(title)}`);
if (values.blocks) {
  const list = values.blocks.split(",").map((b) => JSON.stringify(b.trim())).join(", ");
  config = config.replace(/blocks: \[[^\]]*\]/, `blocks: [${list}]`);
}
writeFileSync(configPath, config);

console.log(`
Created apps/${name} ("${title}")

Next steps
  1. pnpm install
  2. Create a Sanity project at https://www.sanity.io/manage (or: pnpm dlx sanity@latest init --bare)
  3. cp apps/${name}/.env.example apps/${name}/.env.local and add the project ID
  4. pnpm --filter @factory/${name} seed     # import starter content
  5. pnpm --filter @factory/${name} dev
`);
