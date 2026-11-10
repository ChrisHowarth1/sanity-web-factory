import type { Template } from "sanity";
import type { BlockName } from "@factory/blocks";

/**
 * Page templates: "New page" options that start with a ready-made stack of
 * blocks and placeholder copy. Blocks a variant hasn't enabled are dropped.
 */

const key = () => Math.random().toString(36).slice(2, 10);
const link = (label: string, href: string) => ({ _type: "link", label, href });

type BlockSeed = { _type: BlockName } & Record<string, unknown>;

const blocks = {
  hero: (variant: "centered" | "split"): BlockSeed => ({
    _type: "hero",
    variant,
    eyebrow: "Eyebrow",
    heading: "A clear headline that says what this page offers",
    body: "One or two sentences that expand on the headline and give people a reason to keep reading.",
    primaryCta: link("Primary action", "/"),
    ...(variant === "centered" ? { secondaryCta: link("Secondary action", "/") } : {}),
  }),
  featureGrid: (): BlockSeed => ({
    _type: "featureGrid",
    variant: "cards",
    heading: "Why it matters",
    intro: "A short introduction to the benefits below.",
    items: [
      { _key: key(), _type: "feature", icon: "zap", title: "First benefit", body: "Describe the outcome, not the feature." },
      { _key: key(), _type: "feature", icon: "shield", title: "Second benefit", body: "Keep each one to a sentence or two." },
      { _key: key(), _type: "feature", icon: "heart", title: "Third benefit", body: "Three or six items lay out best." },
    ],
  }),
  richText: (): BlockSeed => ({
    _type: "richText",
    content: [
      { _key: key(), _type: "block", style: "h2", markDefs: [], children: [{ _key: key(), _type: "span", marks: [], text: "Section heading" }] },
      { _key: key(), _type: "block", style: "normal", markDefs: [], children: [{ _key: key(), _type: "span", marks: [], text: "Replace this paragraph with the page's main content." }] },
    ],
  }),
  faq: (): BlockSeed => ({
    _type: "faq",
    heading: "Frequently asked questions",
    items: [
      { _key: key(), _type: "question", question: "A question people often ask?", answer: "A short, direct answer." },
      { _key: key(), _type: "question", question: "Another common question?", answer: "Another short answer." },
    ],
  }),
  cta: (variant: "panel" | "subtle"): BlockSeed => ({
    _type: "cta",
    variant,
    heading: "Ready to take the next step?",
    body: "One line that gives people a reason to act now.",
    link: link("Get in touch", "/"),
  }),
};

interface PageTemplate {
  id: string;
  title: string;
  description: string;
  build: () => BlockSeed[];
}

const pageTemplateDefs: PageTemplate[] = [
  {
    id: "page-landing",
    title: "Landing page",
    description: "Hero, features, call to action and FAQ",
    build: () => [blocks.hero("centered"), blocks.featureGrid(), blocks.cta("panel"), blocks.faq()],
  },
  {
    id: "page-content",
    title: "Content page",
    description: "Split hero, rich text and a subtle call to action",
    build: () => [blocks.hero("split"), blocks.richText(), blocks.cta("subtle")],
  },
];

export function pageTemplates(enabledBlocks: readonly BlockName[]): Template[] {
  const enabled = new Set<string>(enabledBlocks);
  return pageTemplateDefs.map((def) => ({
    id: def.id,
    title: def.title,
    description: def.description,
    schemaType: "page",
    // A function, so every new page gets fresh _keys.
    value: () => ({
      pageBuilder: def
        .build()
        .filter((block) => enabled.has(block._type))
        .map((block) => ({ ...block, _key: key() })),
    }),
  }));
}
