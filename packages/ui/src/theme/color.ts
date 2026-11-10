/**
 * Small, dependency-free colour maths: hex <-> OKLCH, gamut fitting and
 * WCAG contrast. Used by both the Studio theme picker and the frontend, so
 * they always compute the same palette.
 */

export type Oklch = { l: number; c: number; h: number };
type Rgb = [number, number, number];

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export function parseHex(input: string | undefined | null): Rgb | undefined {
  if (!input) return undefined;
  let hex = input.trim().replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((ch) => ch + ch).join("");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return undefined;
  const n = Number.parseInt(hex, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function linearRgbToOklch([r, g, b]: Rgb): Oklch {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.sqrt(A * A + B * B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

function oklchToLinearRgb({ l: L, c, h }: Oklch): Rgb {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export function hexToOklch(hex: string): Oklch | undefined {
  const rgb = parseHex(hex);
  if (!rgb) return undefined;
  return linearRgbToOklch(rgb.map(toLinear) as Rgb);
}

export function oklchToHex(color: Oklch): string {
  const rgb = oklchToLinearRgb(color).map((v) => Math.round(Math.min(1, Math.max(0, toGamma(v))) * 255));
  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const inGamut = (color: Oklch) => oklchToLinearRgb(color).every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** Reduce chroma (keeping lightness and hue) until the colour fits in sRGB. */
export function fitGamut(color: Oklch): Oklch {
  if (inGamut(color)) return color;
  let lo = 0;
  let hi = color.c;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut({ ...color, c: mid })) lo = mid;
    else hi = mid;
  }
  return { ...color, c: lo };
}

function relativeLuminance(color: Oklch): number {
  const [r, g, b] = oklchToLinearRgb(color).map((v) => Math.min(1, Math.max(0, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio, 1 to 21. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const round = (v: number, d: number) => Number(v.toFixed(d));

export function toCss({ l, c, h }: Oklch): string {
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`;
}
