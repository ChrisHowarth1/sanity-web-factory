import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PageData, SiteData } from "@factory/sanity-client";

/**
 * Before a Sanity project is connected, the site renders the same starter
 * content that `pnpm seed` imports, read straight from the NDJSON file.
 */
const SEED_FILE = path.resolve(process.cwd(), "../../templates/seed/starter.ndjson");

type SeedDoc = Record<string, unknown> & { _id: string; _type: string };

let cache: Promise<SeedDoc[]> | undefined;

function loadSeed(): Promise<SeedDoc[]> {
  cache ??= readFile(SEED_FILE, "utf8")
    .then((text) =>
      text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line) as SeedDoc),
    )
    .catch(() => []);
  return cache;
}

export async function demoSite(): Promise<SiteData> {
  const docs = await loadSeed();
  return {
    settings: (docs.find((d) => d._id === "siteSettings") as SiteData["settings"]) ?? null,
    theme: (docs.find((d) => d._id === "theme") as SiteData["theme"]) ?? null,
  };
}

function toPage(doc: SeedDoc): PageData {
  const slug = (doc.slug as { current?: string } | undefined)?.current ?? "";
  return { ...(doc as unknown as PageData), slug };
}

export async function demoPage(slug: string): Promise<PageData | null> {
  const docs = await loadSeed();
  const doc = docs.find((d) => d._type === "page" && (d.slug as { current?: string })?.current === slug);
  return doc ? toPage(doc) : null;
}

export async function demoSlugs(): Promise<string[]> {
  const docs = await loadSeed();
  return docs
    .filter((d) => d._type === "page")
    .map((d) => (d.slug as { current?: string })?.current)
    .filter((s): s is string => Boolean(s));
}
