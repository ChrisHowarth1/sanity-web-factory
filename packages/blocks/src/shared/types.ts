export interface LinkValue {
  label?: string;
  href?: string;
}

export interface ImageValue {
  url?: string;
  alt?: string;
  lqip?: string;
  width?: number;
  height?: number;
}

/** Every block arrives from GROQ with these, plus its own fields. */
export interface BlockBase {
  _key: string;
  _type: string;
}

export const linkProjection = `{label, href}`;

export const imageProjection = `{
  alt,
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

/** Sanity CDN image URL with width + auto format. */
export function imageUrl(image: ImageValue | undefined, width: number): string | undefined {
  if (!image?.url) return undefined;
  return `${image.url}?w=${width}&auto=format&fit=max`;
}
