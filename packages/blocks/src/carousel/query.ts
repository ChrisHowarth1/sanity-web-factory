import { imageProjection, linkProjection } from "../shared/types";

export const carouselQuery = `{
  variant, heading, intro, loop,
  slides[]{
    _key, title, body,
    link${linkProjection},
    image${imageProjection}
  }
}`;
