import type { BlockName } from "@factory/blocks";

/**
 * Per-variant settings. `pnpm factory:new <name>` copies this app and
 * rewrites this file; everything else is shared code.
 */
const factory = {
  /** Machine name: used for the Studio workspace and the package name. */
  name: "starter",
  /** Human name shown in the Studio. */
  title: "Starter site",
  /** Blocks editors can add to pages, in insert-menu order. */
  blocks: ["hero", "featureGrid", "faq", "cta", "richText", "carousel"] satisfies BlockName[] as BlockName[],
};

export default factory;
