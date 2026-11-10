/** Studio-only entry: the Sanity schema type for every block. */
import type { SchemaTypeDefinition } from "sanity";
import type { BlockName } from "./index";
import { hero } from "./hero/schema";
import { featureGrid } from "./feature-grid/schema";
import { faq } from "./faq/schema";
import { cta } from "./cta/schema";
import { richText } from "./rich-text/schema";
import { carousel } from "./carousel/schema";
import { link } from "./shared/schema";

export const blockSchemas: Record<BlockName, SchemaTypeDefinition> = {
  hero,
  featureGrid,
  faq,
  cta,
  richText,
  carousel,
};

/** Object types the blocks depend on. Always registered. */
export const sharedSchemas: SchemaTypeDefinition[] = [link];
