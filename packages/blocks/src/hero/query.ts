import { imageProjection, linkProjection } from "../shared/types";

export const heroQuery = `{
  variant, eyebrow, heading, body,
  primaryCta${linkProjection},
  secondaryCta${linkProjection},
  image${imageProjection}
}`;
