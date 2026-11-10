/**
 * Frontend-safe entry: block types, GROQ projections and the registry.
 * The Sanity schemas live in "@factory/blocks/schemas" so the website bundle
 * never imports the Studio.
 */
import { heroQuery } from "./hero/query";
import { featureGridQuery } from "./feature-grid/query";
import { faqQuery } from "./faq/query";
import { ctaQuery } from "./cta/query";
import { richTextQuery } from "./rich-text/query";
import { carouselQuery } from "./carousel/query";
import type { HeroBlock } from "./hero/component";
import type { FeatureGridBlock } from "./feature-grid/component";
import type { FaqBlock } from "./faq/component";
import type { CtaBlock } from "./cta/component";
import type { RichTextBlock } from "./rich-text/component";
import type { CarouselBlock } from "./carousel/component";

export const blockNames = ["hero", "featureGrid", "faq", "cta", "richText", "carousel"] as const;
export type BlockName = (typeof blockNames)[number];

export type Block = HeroBlock | FeatureGridBlock | FaqBlock | CtaBlock | RichTextBlock | CarouselBlock;
export type { HeroBlock, FeatureGridBlock, FaqBlock, CtaBlock, RichTextBlock, CarouselBlock };
export type { LinkValue, ImageValue } from "./shared/types";

export const blockQueries: Record<BlockName, string> = {
  hero: heroQuery,
  featureGrid: featureGridQuery,
  faq: faqQuery,
  cta: ctaQuery,
  richText: richTextQuery,
  carousel: carouselQuery,
};

/** GROQ projection for a page's pageBuilder array, limited to the enabled blocks. */
export function pageBuilderProjection(enabled: readonly BlockName[] = blockNames): string {
  const branches = enabled.map((name) => `_type == "${name}" => ${blockQueries[name]}`).join(",\n    ");
  return `pageBuilder[]{
    _key,
    _type,
    ${branches}
  }`;
}
