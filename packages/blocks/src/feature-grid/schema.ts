import { defineArrayMember, defineField, defineType } from "sanity";
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { variantField } from "../shared/schema";
import { featureIconNames } from "./icons";

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Feature grid",
  type: "object",
  icon: ThLargeIcon,
  fields: [
    variantField(
      [
        { title: "Cards", value: "cards" },
        { title: "Plain", value: "plain" },
      ],
      "cards",
    ),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          name: "feature",
          type: "object",
          fields: [
            defineField({
              name: "icon",
              type: "string",
              options: { list: featureIconNames.map((name) => ({ title: name, value: name })) },
            }),
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "body", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
      validation: (rule) => rule.max(12),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title ?? "Feature grid",
      subtitle: `Feature grid · ${items?.length ?? 0} items`,
    }),
  },
});
