import { linkProjection } from "../shared/types";

export const ctaQuery = `{
  variant, heading, body,
  link${linkProjection}
}`;
