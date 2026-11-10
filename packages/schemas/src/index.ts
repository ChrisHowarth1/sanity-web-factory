import type { SchemaTypeDefinition } from "sanity";
import type { StructureResolver } from "sanity/structure";
import { blockNames, type BlockName } from "@factory/blocks";
import { blockSchemas, sharedSchemas } from "@factory/blocks/schemas";
import { pageType } from "./documents/page";
import { siteSettings } from "./documents/site-settings";
import { theme } from "./documents/theme";
import { pageTemplates } from "./templates";

export { pageTemplates };
export { blockPreviewUrl } from "./documents/page";

/** Documents that exist exactly once per variant, with fixed IDs. */
export const singletonTypes = ["siteSettings", "theme"] as const;

/** All schema types for a variant, with the page builder limited to its enabled blocks. */
export function buildSchemaTypes(enabledBlocks: readonly BlockName[] = blockNames): SchemaTypeDefinition[] {
  return [
    pageType(enabledBlocks),
    siteSettings,
    theme,
    ...sharedSchemas,
    ...enabledBlocks.map((name) => blockSchemas[name]),
  ];
}

/**
 * Studio "new document" templates: the page templates first, then a blank
 * page. Singletons are left out so they can't be created twice.
 */
export function buildTemplates<T extends { id: string; schemaType: string; title: string }>(
  defaults: T[],
  enabledBlocks: readonly BlockName[] = blockNames,
) {
  const singletons = new Set<string>(singletonTypes);
  const rest = defaults
    .filter(({ schemaType }) => !singletons.has(schemaType))
    .map((t) => (t.id === "page" ? { ...t, title: "Blank page" } : t));
  return [...pageTemplates(enabledBlocks), ...rest];
}

/** Desk structure: the two singletons on top, then pages. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .schemaType("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Theme")
        .id("theme")
        .schemaType("theme")
        .child(S.document().schemaType("theme").documentId("theme")),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
    ]);
