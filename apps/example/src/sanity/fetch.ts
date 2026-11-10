import { draftMode } from "next/headers";
import { stegaClean } from "next-sanity";
import { pageQuery, siteQuery, slugsQuery, type PageData, type SiteData } from "@factory/sanity-client";
import factory from "../../factory.config";
import { demoPage, demoSite, demoSlugs } from "./demo";
import { client, env, sanityFetch } from "./live";

/**
 * Three modes, one API:
 *  - demo:       no project ID yet, read the seed file
 *  - preview:    visual editing on, live drafts via sanityFetch
 *  - production: published content, fetched once at build time
 */
const PAGE_QUERY = pageQuery(factory.blocks);

// Production builds cache fetches; in dev always fetch fresh so content
// edits (and a first seed) show up on reload.
const cache: RequestCache = process.env.NODE_ENV === "development" ? "no-store" : "force-cache";

export async function isDraftMode(): Promise<boolean> {
  if (!env.visualEditing) return false;
  return (await draftMode()).isEnabled;
}

export async function getSiteData(): Promise<SiteData> {
  if (!env.configured) return demoSite();
  if (env.visualEditing) {
    const { data } = await sanityFetch({ query: siteQuery });
    return (data as SiteData) ?? { settings: null, theme: null };
  }
  return client.fetch<SiteData>(siteQuery, {}, { cache });
}

export async function getPage(slug: string): Promise<PageData | null> {
  if (!env.configured) return demoPage(slug);
  if (env.visualEditing) {
    const { data } = await sanityFetch({ query: PAGE_QUERY, params: { slug } });
    return data as PageData | null;
  }
  return client.fetch<PageData | null>(PAGE_QUERY, { slug }, { cache });
}

export async function getAllSlugs(): Promise<string[]> {
  if (!env.configured) return demoSlugs();
  const slugs = await client.fetch<string[]>(slugsQuery, {}, { cache });
  return slugs.map((slug) => stegaClean(slug));
}
