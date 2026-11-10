import { defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { variantField } from "../shared/schema";

export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  icon: BulbOutlineIcon,
  fields: [
    variantField(
      [
        { title: "Brand panel", value: "panel" },
        { title: "Highlight panel", value: "highlight" },
        { title: "Subtle", value: "subtle" },
      ],
      "panel",
    ),
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", type: "text", rows: 2 }),
    defineField({ name: "link", title: "Button", type: "link" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "variant" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `Call to action · ${subtitle ?? "panel"}` }),
  },
});
