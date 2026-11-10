import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "Frequently asked questions" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          name: "question",
          type: "object",
          fields: [
            defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "answer", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({ title: title ?? "FAQ", subtitle: `FAQ · ${items?.length ?? 0} questions` }),
  },
});
