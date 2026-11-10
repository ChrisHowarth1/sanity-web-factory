/** Icon names editors can choose. Kept separate so the Studio doesn't import lucide. */
export const featureIconNames = [
  "sparkles",
  "zap",
  "shield",
  "heart",
  "rocket",
  "layers",
  "globe",
  "clock",
  "star",
  "check",
] as const;

export type FeatureIconName = (typeof featureIconNames)[number];
