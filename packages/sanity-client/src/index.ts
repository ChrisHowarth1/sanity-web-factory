import { createClient, type SanityClient } from "next-sanity";
import { blockNames, pageBuilderProjection, type Block, type BlockName, type LinkValue } from "@factory/blocks";
import type { ThemeInput } from "@factory/ui/theme";

/* -------------------------------------------------------------------------- */
/* Environment                                                                 */
/* -------------------------------------------------------------------------- */

export interface FactoryEnv {
  projectId?: string;
  dataset: string;
  apiVersion: string;
  /** Where the Studio lives, for click-to-edit links. */
  studioUrl: string;
  /** True on the preview site only: drafts, stega, live updates. */
  visualEditing: boolean;
  /** False until a Sanity project ID is set; the site then renders demo content. */
  configured: boolean;
}

export function readEnv(): FactoryEnv {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || undefined;
  return {
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-01",
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio",
    visualEditing: process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === "true",
    configured: Boolean(projectId),
  };
}

export function createFactoryClient(env: FactoryEnv = readEnv()): SanityClient {
  return createClient({
    projectId: env.projectId ?? "unconfigured",
    dataset: env.dataset,
    apiVersion: env.apiVersion,
    useCdn: true,
    perspective: "published",
    stega: { studioUrl: env.studioUrl },
  });
}

/* -------------------------------------------------------------------------- */
/* Queries                                                                     */
/* -------------------------------------------------------------------------- */

export const siteQuery = `{
  "settings": *[_id == "siteSettings"][0]{
    siteName, description, footerText,
    nav[]{_key, label, href},
    headerCta{label, href}
  },
  "theme": *[_id == "theme"][0]{preset, primary, accent, radius, fontPair, mode}
}`;

export function pageQuery(enabled: readonly BlockName[] = blockNames): string {
  return `*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  seo{title, description},
  ${pageBuilderProjection(enabled)}
}`;
}

export const slugsQuery = `*[_type == "page" && defined(slug.current)].slug.current`;

/* -------------------------------------------------------------------------- */
/* Result types                                                                */
/* -------------------------------------------------------------------------- */

export interface SiteSettings {
  siteName?: string;
  description?: string;
  footerText?: string;
  nav?: Array<LinkValue & { _key: string }>;
  headerCta?: LinkValue;
}

export interface SiteData {
  settings: SiteSettings | null;
  theme: ThemeInput | null;
}

export interface PageData {
  _id: string;
  _type: "page";
  title?: string;
  slug: string;
  seo?: { title?: string; description?: string };
  pageBuilder?: Block[];
}

/** The homepage is the page whose slug is "home". */
export const HOME_SLUG = "home";

export function slugToPath(slug: string): string {
  return slug === HOME_SLUG ? "/" : `/${slug}`;
}
