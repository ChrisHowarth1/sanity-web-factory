import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";
import type { BlockName } from "@factory/blocks";

/** Thumbnails for the "Add block" grid, served by each app from public/block-previews. */
export const blockPreviewUrl = (blockName: string) => `/block-previews/${blockName}.webp`;

export function pageType(enabledBlocks: readonly BlockName[]) {
  return defineType({
    name: "page",
    title: "Page",
    type: "document",
    icon: DocumentIcon,
    groups: [
      { name: "content", title: "Content", default: true },
      { name: "seo", title: "SEO" },
    ],
    fields: [
      defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required() }),
      defineField({
        name: "slug",
        type: "slug",
        group: "content",
        description: 'Use "home" for the homepage.',
        options: { source: "title", maxLength: 96 },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "pageBuilder",
        title: "Page builder",
        type: "array",
        group: "content",
        of: enabledBlocks.map((name) => defineArrayMember({ type: name })),
        options: {
          insertMenu: {
            filter: true,
            views: [{ name: "grid", previewImageUrl: blockPreviewUrl }, { name: "list" }],
          },
        },
      }),
      defineField({
        name: "seo",
        title: "SEO",
        type: "object",
        group: "seo",
        fields: [
          defineField({ name: "title", type: "string", description: "Defaults to the page title" }),
          defineField({ name: "description", type: "text", rows: 3, validation: (rule) => rule.max(160) }),
        ],
      }),
    ],
    preview: {
      select: { title: "title", slug: "slug.current" },
      prepare: ({ title, slug }) => ({ title, subtitle: slug === "home" ? "/" : `/${slug ?? ""}` }),
    },
  });
}
