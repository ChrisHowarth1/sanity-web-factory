import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons/Rocket";
import { variantField } from "../shared/schema";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: RocketIcon,
  fields: [
    variantField(
      [
        { title: "Centred", value: "centered" },
        { title: "Split with image", value: "split" },
      ],
      "centered",
    ),
    defineField({ name: "eyebrow", type: "string", description: "Short label above the heading" }),
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", type: "text", rows: 3 }),
    defineField({ name: "primaryCta", title: "Primary button", type: "link" }),
    defineField({ name: "secondaryCta", title: "Secondary button", type: "link" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
      hidden: ({ parent }) => parent?.variant !== "split",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "variant" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `Hero · ${subtitle ?? "centered"}` }),
  },
});
