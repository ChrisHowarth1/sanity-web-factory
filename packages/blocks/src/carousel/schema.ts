import { defineArrayMember, defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";
import { variantField } from "../shared/schema";

export const carousel = defineType({
  name: "carousel",
  title: "Carousel",
  type: "object",
  icon: ImagesIcon,
  fields: [
    variantField(
      [
        { title: "Cards (several visible)", value: "cards" },
        { title: "Large images (one at a time)", value: "images" },
      ],
      "cards",
    ),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "slides",
      type: "array",
      of: [
        defineArrayMember({
          name: "slide",
          type: "object",
          fields: [
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
            }),
            defineField({ name: "title", type: "string" }),
            defineField({ name: "body", type: "text", rows: 3 }),
            defineField({ name: "link", type: "link" }),
          ],
          preview: {
            select: { title: "title", subtitle: "body", media: "image" },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(20),
    }),
    defineField({
      name: "loop",
      title: "Loop back to the start",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "heading", slides: "slides", variant: "variant" },
    prepare: ({ title, slides, variant }) => ({
      title: title ?? "Carousel",
      subtitle: `Carousel · ${slides?.length ?? 0} slides · ${variant ?? "cards"}`,
    }),
  },
});
