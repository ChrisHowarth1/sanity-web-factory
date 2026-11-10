import type { ComponentType } from "react";
import { createDataAttribute } from "next-sanity";
import type { Block, BlockName } from "./index";
import { Hero } from "./hero/component";
import { FeatureGrid } from "./feature-grid/component";
import { Faq } from "./faq/component";
import { Cta } from "./cta/component";
import { RichText } from "./rich-text/component";
import { Carousel } from "./carousel/component";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry: Record<BlockName, ComponentType<any>> = {
  hero: Hero,
  featureGrid: FeatureGrid,
  faq: Faq,
  cta: Cta,
  richText: RichText,
  carousel: Carousel,
};

export interface PageBuilderProps {
  blocks?: Block[] | null;
  /** The page document's _id and _type, used for click-to-edit and drag-and-drop. */
  documentId: string;
  documentType: string;
  /** Studio URL, project and dataset, so overlays can link back to the right document. */
  studio?: { baseUrl?: string; projectId?: string; dataset?: string };
}

/**
 * Maps each block's _type to its component. Every block is wrapped in an
 * element whose data-sanity attribute points at its array item, which is what
 * lets the Presentation tool show overlays and reorder blocks by drag-and-drop.
 */
export function PageBuilder({ blocks, documentId, documentType, studio }: PageBuilderProps) {
  if (!blocks?.length) return null;

  return (
    <div data-sanity={createDataAttribute({ ...studio, id: documentId, type: documentType, path: "pageBuilder" }).toString()}>
      {blocks.map((block) => {
        const Component = registry[block._type as BlockName];
        const attr = createDataAttribute({
          ...studio,
          id: documentId,
          type: documentType,
          path: `pageBuilder[_key=="${block._key}"]`,
        });
        return (
          <div key={block._key} data-sanity={attr.toString()}>
            {Component ? (
              <Component {...block} />
            ) : process.env.NODE_ENV !== "production" ? (
              <div className="mx-auto my-8 max-w-6xl rounded-lg border border-dashed border-destructive p-6 text-sm text-destructive">
                No component registered for block type “{block._type}”.
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
