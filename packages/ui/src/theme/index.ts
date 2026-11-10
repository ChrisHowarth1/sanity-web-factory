import { contrastRatio, fitGamut, hexToOklch, toCss, type Oklch } from "./color";

export * from "./color";

/* -------------------------------------------------------------------------- */
/* Inputs: what the Studio theme picker stores                                 */
/* -------------------------------------------------------------------------- */

export const presetNames = ["neutral", "warm", "bold", "mono"] as const;
export type PresetName = (typeof presetNames)[number];

export const fontPairNames = ["modern", "editorial", "technical", "display"] as const;
export type FontPairName = (typeof fontPairNames)[number];

export type ColorMode = "light" | "dark" | "system";

export interface ThemeInput {
  preset?: PresetName;
  /** Brand colour as hex, e.g. "#7c3aed". Falls back to the preset's. */
  primary?: string;
  /** Second brand colour as hex. Falls back to the preset's. */
  accent?: string;
  /** Corner radius in rem. */
  radius?: number;
  fontPair?: FontPairName;
  mode?: ColorMode;
}

interface Preset {
  title: string;
  description: string;
  primary: string;
  accent: string;
  radius: number;
  fontPair: FontPairName;
  /** Hue and chroma of the neutral greys. `fromPrimary` tints them with the brand hue. */
  base: { hue: number; chroma: number; fromPrimary?: boolean };
}

export const presets: Record<PresetName, Preset> = {
  neutral: {
    title: "Neutral",
    description: "Cool greys, near-black primary, blue accent",
    primary: "#18181b",
    accent: "#2563eb",
    radius: 0.625,
    fontPair: "modern",
    base: { hue: 265, chroma: 0.006 },
  },
  warm: {
    title: "Warm",
    description: "Paper-warm greys, serif headings",
    primary: "#c2410c",
    accent: "#a16207",
    radius: 0.75,
    fontPair: "editorial",
    base: { hue: 70, chroma: 0.012 },
  },
  bold: {
    title: "Bold",
    description: "Greys tinted by the brand colour, round corners",
    primary: "#7c3aed",
    accent: "#f59e0b",
    radius: 1,
    fontPair: "display",
    base: { hue: 0, chroma: 0.016, fromPrimary: true },
  },
  mono: {
    title: "Mono",
    description: "Pure greys, square corners, technical type",
    primary: "#0a0a0a",
    accent: "#525252",
    radius: 0,
    fontPair: "technical",
    base: { hue: 0, chroma: 0 },
  },
};

export const fontPairs: Record<FontPairName, { title: string; sans: string; heading: string }> = {
  modern: {
    title: "Modern (Inter)",
    sans: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
    heading: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
  },
  editorial: {
    title: "Editorial (Fraunces + Inter)",
    sans: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
    heading: "'Fraunces Variable', ui-serif, Georgia, serif",
  },
  technical: {
    title: "Technical (Space Grotesk + IBM Plex Sans)",
    sans: "'IBM Plex Sans Variable', ui-sans-serif, system-ui, sans-serif",
    heading: "'Space Grotesk Variable', ui-sans-serif, system-ui, sans-serif",
  },
  display: {
    title: "Display (Space Grotesk)",
    sans: "'Space Grotesk Variable', ui-sans-serif, system-ui, sans-serif",
    heading: "'Space Grotesk Variable', ui-sans-serif, system-ui, sans-serif",
  },
};

/* -------------------------------------------------------------------------- */
/* Output: shadcn-compatible tokens                                            */
/* -------------------------------------------------------------------------- */

export const tokenNames = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "highlight",
  "highlight-foreground",
  "destructive",
  "border",
  "input",
  "ring",
] as const;
export type TokenName = (typeof tokenNames)[number];
export type Tokens = Record<TokenName, Oklch>;

export interface ResolvedTheme {
  input: Required<ThemeInput>;
  light: Tokens;
  dark: Tokens;
  radius: string;
  fonts: { sans: string; heading: string };
}

/** Text/background pairs that must meet WCAG AA (4.5:1). */
export const contrastPairs: Array<[TokenName, TokenName]> = [
  ["background", "foreground"],
  ["background", "muted-foreground"],
  ["card", "card-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["accent", "accent-foreground"],
  ["highlight", "highlight-foreground"],
];

const WHITE: Oklch = { l: 0.985, c: 0, h: 0 };

function pickForeground(bg: Oklch, dark: Oklch): Oklch {
  return contrastRatio(bg, WHITE) >= contrastRatio(bg, dark) ? WHITE : dark;
}

/** In dark mode, brand colours need enough lightness to stand off the background. */
function forDark(brand: Oklch): Oklch {
  if (brand.c < 0.03) return { ...brand, l: 0.92 };
  return fitGamut({ ...brand, l: Math.min(0.82, Math.max(0.68, brand.l)) });
}

export function resolveInput(input: ThemeInput = {}): Required<ThemeInput> {
  const preset = presets[input.preset ?? "neutral"] ?? presets.neutral;
  return {
    preset: input.preset && presets[input.preset] ? input.preset : "neutral",
    primary: hexToOklch(input.primary ?? "") ? input.primary! : preset.primary,
    accent: hexToOklch(input.accent ?? "") ? input.accent! : preset.accent,
    radius: typeof input.radius === "number" ? input.radius : preset.radius,
    fontPair: input.fontPair && fontPairs[input.fontPair] ? input.fontPair : preset.fontPair,
    mode: input.mode ?? "light",
  };
}

export function generateTheme(raw: ThemeInput = {}): ResolvedTheme {
  const input = resolveInput(raw);
  const preset = presets[input.preset];
  const primary = fitGamut(hexToOklch(input.primary)!);
  const accent = fitGamut(hexToOklch(input.accent)!);

  const hue = preset.base.fromPrimary ? primary.h : preset.base.hue;
  const grey = (l: number, chromaScale = 1): Oklch => ({ l, c: preset.base.chroma * chromaScale, h: hue });

  const lightInk = grey(0.145, 2);
  const light: Tokens = {
    background: grey(0.99),
    foreground: lightInk,
    card: grey(0.997, 0.5),
    "card-foreground": lightInk,
    popover: grey(0.997, 0.5),
    "popover-foreground": lightInk,
    primary,
    "primary-foreground": pickForeground(primary, lightInk),
    secondary: grey(0.955, 1.5),
    "secondary-foreground": grey(0.21, 2),
    muted: grey(0.965),
    "muted-foreground": grey(0.5, 2),
    accent: fitGamut({ l: 0.955, c: Math.min(accent.c, 0.03), h: accent.h }),
    "accent-foreground": fitGamut({ l: 0.27, c: Math.min(accent.c, 0.08), h: accent.h }),
    highlight: accent,
    "highlight-foreground": pickForeground(accent, lightInk),
    destructive: { l: 0.577, c: 0.245, h: 27.3 },
    border: grey(0.905, 1.5),
    input: grey(0.905, 1.5),
    ring: primary,
  };

  const darkInk = grey(0.16, 2);
  const darkPrimary = forDark(primary);
  const darkAccent = forDark(accent);
  const dark: Tokens = {
    background: darkInk,
    foreground: grey(0.97, 0.5),
    card: grey(0.2, 2),
    "card-foreground": grey(0.97, 0.5),
    popover: grey(0.2, 2),
    "popover-foreground": grey(0.97, 0.5),
    primary: darkPrimary,
    "primary-foreground": pickForeground(darkPrimary, darkInk),
    secondary: grey(0.27, 2),
    "secondary-foreground": grey(0.97, 0.5),
    muted: grey(0.25, 2),
    "muted-foreground": grey(0.72, 1.5),
    accent: fitGamut({ l: 0.3, c: Math.min(accent.c, 0.04), h: accent.h }),
    "accent-foreground": fitGamut({ l: 0.95, c: Math.min(accent.c, 0.03), h: accent.h }),
    highlight: darkAccent,
    "highlight-foreground": pickForeground(darkAccent, darkInk),
    destructive: { l: 0.704, c: 0.191, h: 22.2 },
    border: grey(0.3, 2),
    input: grey(0.33, 2),
    ring: darkPrimary,
  };

  return {
    input,
    light,
    dark,
    radius: `${input.radius}rem`,
    fonts: { sans: fontPairs[input.fontPair].sans, heading: fontPairs[input.fontPair].heading },
  };
}

export interface ContrastIssue {
  mode: "light" | "dark";
  background: TokenName;
  text: TokenName;
  ratio: number;
}

export function checkContrast(theme: ResolvedTheme, minimum = 4.5): ContrastIssue[] {
  const issues: ContrastIssue[] = [];
  for (const mode of ["light", "dark"] as const) {
    for (const [background, text] of contrastPairs) {
      const ratio = contrastRatio(theme[mode][background], theme[mode][text]);
      if (ratio < minimum) issues.push({ mode, background, text, ratio: Number(ratio.toFixed(2)) });
    }
  }
  return issues;
}

const block = (tokens: Tokens) => tokenNames.map((name) => `--${name}:${toCss(tokens[name])};`).join("");

/** CSS custom properties for a resolved theme, ready for a <style> tag. */
export function themeToCss(theme: ResolvedTheme): string {
  const shared = `--radius:${theme.radius};--font-sans:${theme.fonts.sans};--font-heading:${theme.fonts.heading};`;
  const light = block(theme.light);
  const dark = block(theme.dark);
  switch (theme.input.mode) {
    case "dark":
      return `:root{${shared}${dark}color-scheme:dark}`;
    case "system":
      return `:root{${shared}${light}color-scheme:light}@media (prefers-color-scheme: dark){:root:not(.light){${dark}color-scheme:dark}}.dark{${dark}color-scheme:dark}`;
    default:
      return `:root{${shared}${light}color-scheme:light}.dark{${dark}color-scheme:dark}`;
  }
}
