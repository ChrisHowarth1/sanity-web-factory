import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { defineDocuments, defineLocations, presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { buildSchemaTypes, singletonTypes, structure } from "@factory/schemas";
import { slugToPath } from "@factory/sanity-client";
import factory from "./factory.config";

// Next inlines NEXT_PUBLIC_* for the embedded Studio; the Sanity CLI
// (`sanity deploy`) reads SANITY_STUDIO_* instead.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";
// The preview site (SSR + draft mode). Empty = same origin as this Studio.
const previewOrigin = process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL || process.env.SANITY_STUDIO_PREVIEW_URL || undefined;

const singletons = new Set<string>(singletonTypes);
const homeLocation = { title: "Home", href: "/" };

export default defineConfig({
  name: factory.name,
  title: factory.title,
  projectId,
  dataset,
  basePath: "/studio",
  schema: {
    types: buildSchemaTypes(factory.blocks),
    // Singletons can't be created from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted.
    actions: (actions, { schemaType }) =>
      singletons.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: { enable: "/api/draft-mode/enable", disable: "/api/draft-mode/disable" },
      },
      resolve: {
        mainDocuments: defineDocuments([
          { route: "/", filter: `_type == "page" && slug.current == "home"` },
          { route: "/:slug", filter: `_type == "page" && slug.current == $slug` },
        ]),
        locations: {
          page: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug ? [{ title: doc.title || "Untitled", href: slugToPath(doc.slug) }] : [],
            }),
          }),
          siteSettings: defineLocations({ locations: [homeLocation], message: "Used on every page" }),
          theme: defineLocations({ locations: [homeLocation], message: "Used on every page" }),
        },
      },
    }),
    visionTool(),
  ],
});
