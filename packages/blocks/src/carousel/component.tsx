import { stegaClean } from "next-sanity";
import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@factory/ui/components/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@factory/ui/components/card";
import { cn } from "@factory/ui/utils";
import { Section } from "../shared/section";
import { LinkButton } from "../shared/link-button";
import { imageUrl, type BlockBase, type ImageValue, type LinkValue } from "../shared/types";

export interface CarouselBlock extends BlockBase {
  _type: "carousel";
  variant?: "cards" | "images";
  heading?: string;
  intro?: string;
  loop?: boolean;
  slides?: Array<{ _key: string; title?: string; body?: string; link?: LinkValue; image?: ImageValue }>;
}

function SlideImage({ image, className }: { image?: ImageValue; className?: string }) {
  const src = imageUrl(image, 1600);
  if (!src) {
    return <div className={cn("bg-gradient-to-br from-primary/20 via-muted to-highlight/20", className)} />;
  }
  return (
    <img
      src={src}
      alt={image?.alt ?? ""}
      loading="lazy"
      className={cn("object-cover", className)}
      style={image?.lqip ? { backgroundImage: `url(${image.lqip})`, backgroundSize: "cover" } : undefined}
    />
  );
}

/**
 * Server component around the shadcn Carousel (a client component), so only
 * the carousel itself ships JavaScript.
 */
export function Carousel({ variant, heading, intro, loop = true, slides = [] }: CarouselBlock) {
  if (!slides.length) return null;
  const images = stegaClean(variant) === "images";

  return (
    <Section>
      <CarouselRoot opts={{ loop: Boolean(stegaClean(loop)), align: "start" }}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          {(heading || intro) && (
            <div className="flex max-w-2xl flex-col gap-3">
              {heading && <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{heading}</h2>}
              {intro && <p className="text-lg text-muted-foreground">{intro}</p>}
            </div>
          )}
          {/* Controls sit beside the heading instead of overhanging the edges, so they work on phones. */}
          <div className="ml-auto flex gap-2">
            <CarouselPrevious className="static size-10 translate-y-0" />
            <CarouselNext className="static size-10 translate-y-0" />
          </div>
        </div>

        <CarouselContent>
          {slides.map((slide) =>
            images ? (
              <CarouselItem key={slide._key} className="basis-full lg:basis-4/5">
                <figure className="flex flex-col gap-4">
                  <SlideImage image={slide.image} className="aspect-[16/9] w-full rounded-xl border border-border" />
                  {(slide.title || slide.body || slide.link?.label) && (
                    <figcaption className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex max-w-2xl flex-col gap-1">
                        {slide.title && <span className="font-heading text-lg font-semibold">{slide.title}</span>}
                        {slide.body && <span className="text-muted-foreground">{slide.body}</span>}
                      </div>
                      <LinkButton link={slide.link} variant="outline" />
                    </figcaption>
                  )}
                </figure>
              </CarouselItem>
            ) : (
              <CarouselItem key={slide._key} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="h-full gap-4 overflow-hidden pt-0">
                  <SlideImage image={slide.image} className="aspect-[4/3] w-full" />
                  {(slide.title || slide.body) && (
                    <CardHeader className="gap-2">
                      {slide.title && (
                        <CardTitle className="font-heading text-lg leading-tight">{slide.title}</CardTitle>
                      )}
                      {slide.body && <CardDescription className="text-base">{slide.body}</CardDescription>}
                    </CardHeader>
                  )}
                  {slide.link?.label && (
                    <CardContent className="mt-auto">
                      <LinkButton link={slide.link} variant="outline" size="sm" />
                    </CardContent>
                  )}
                </Card>
              </CarouselItem>
            ),
          )}
        </CarouselContent>
      </CarouselRoot>
    </Section>
  );
}
