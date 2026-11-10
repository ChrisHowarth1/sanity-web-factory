import { defineField, defineType } from "sanity";

/** Reusable link object: used by hero, CTA and nav. */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "A path like /about, or a full URL like https://example.com",
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^(\/|https?:\/\/|mailto:|tel:|#)/.test(value)
            ? true
            : "Start with /, https://, mailto:, tel: or #",
        ),
    }),
  ],
  options: { columns: 2 },
});

/** A small "Layout" field every block can use, kept to a short list on purpose. */
export function variantField(options: Array<{ title: string; value: string }>, initial?: string) {
  return defineField({
    name: "variant",
    title: "Layout",
    type: "string",
    options: { list: options, layout: "radio", direction: "horizontal" },
    initialValue: initial ?? options[0]?.value,
  });
}
