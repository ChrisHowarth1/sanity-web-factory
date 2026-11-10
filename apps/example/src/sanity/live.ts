import { defineLive } from "next-sanity/live";
import { createFactoryClient, readEnv } from "@factory/sanity-client";

export const env = readEnv();
export const client = createFactoryClient(env);

const token = process.env.SANITY_API_READ_TOKEN || false;

/**
 * Live content + draft mode. Only used on the preview site
 * (NEXT_PUBLIC_SANITY_VISUAL_EDITING=true); production fetches published
 * content once at build time instead.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: env.visualEditing ? token : false,
  browserToken: env.visualEditing ? token : false,
});
