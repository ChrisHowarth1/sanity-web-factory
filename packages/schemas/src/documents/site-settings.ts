import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({ name: "siteName", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text", rows: 2, description: "Default meta description" }),
    defineField({
      name: "nav",
      title: "Navigation",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
    defineField({ name: "headerCta", title: "Header button", type: "link" }),
    defineField({ name: "footerText", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
