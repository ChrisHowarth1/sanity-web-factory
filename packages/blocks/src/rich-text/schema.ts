import { defineArrayMember, defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons/BlockContent";

export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            annotations: [
              defineArrayMember({
                name: "link",
                type: "object",
                fields: [defineField({ name: "href", type: "string" })],
              }),
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { content: "content" },
    prepare: ({ content }) => {
      const first = content?.find((b: { _type: string }) => b._type === "block");
      const text = first?.children?.map((c: { text?: string }) => c.text).join("") ?? "";
      return { title: text || "Rich text", subtitle: "Rich text" };
    },
  },
});
