import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import { Section } from "../shared/section";
import type { BlockBase } from "../shared/types";

export interface RichTextBlock extends BlockBase {
  _type: "richText";
  content?: PortableTextBlock[];
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-7 text-pretty [&:not(:first-child)]:mt-5">{children}</p>,
    h2: ({ children }) => <h2 className="mt-12 mb-4 text-3xl font-semibold tracking-tight first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-primary pl-6 text-lg text-muted-foreground italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-5 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
    number: ({ children }) => <ol className="my-5 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="font-medium text-primary underline underline-offset-4">
        {children}
      </a>
    ),
  },
};

export function RichText({ content }: RichTextBlock) {
  if (!content?.length) return null;
  return (
    <Section inner="max-w-3xl text-lg">
      <PortableText value={content} components={components} />
    </Section>
  );
}
