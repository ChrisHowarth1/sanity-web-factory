import { stegaClean } from "next-sanity";
import { Badge } from "@factory/ui/components/badge";
import { cn } from "@factory/ui/utils";
import { Section } from "../shared/section";
import { LinkButton } from "../shared/link-button";
import { imageUrl, type BlockBase, type ImageValue, type LinkValue } from "../shared/types";

export interface HeroBlock extends BlockBase {
  _type: "hero";
  variant?: "centered" | "split";
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryCta?: LinkValue;
  secondaryCta?: LinkValue;
  image?: ImageValue;
}

export function Hero({ variant, eyebrow, heading, body, primaryCta, secondaryCta, image }: HeroBlock) {
  // Stega characters would break this comparison in preview, so clean first.
  const split = stegaClean(variant) === "split";
  const src = imageUrl(image, 1400);

  const copy = (
    <div className={cn("flex flex-col gap-6", split ? "items-start" : "items-center text-center")}>
      {eyebrow && (
        <Badge variant="secondary" className="border-border px-3 py-1">
          {eyebrow}
        </Badge>
      )}
      {heading && (
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">{heading}</h1>
      )}
      {body && <p className="max-w-2xl text-lg text-pretty text-muted-foreground">{body}</p>}
      {(primaryCta?.label || secondaryCta?.label) && (
        <div className="flex flex-wrap gap-3">
          <LinkButton link={primaryCta} size="lg" />
          <LinkButton link={secondaryCta} size="lg" variant="outline" />
        </div>
      )}
    </div>
  );

  if (!split) return <Section className="md:py-32">{copy}</Section>;

  return (
    <Section inner="grid items-center gap-12 md:grid-cols-2">
      {copy}
      {src ? (
        <img
          src={src}
          alt={image?.alt ?? ""}
          width={image?.width}
          height={image?.height}
          className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
          style={image?.lqip ? { backgroundImage: `url(${image.lqip})`, backgroundSize: "cover" } : undefined}
        />
      ) : (
        <div className="aspect-[4/3] w-full rounded-xl border border-border bg-gradient-to-br from-primary/20 via-muted to-highlight/20" />
      )}
    </Section>
  );
}
