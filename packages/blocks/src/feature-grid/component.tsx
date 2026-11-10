import { stegaClean } from "next-sanity";
import {
  CheckIcon,
  ClockIcon,
  GlobeIcon,
  HeartIcon,
  LayersIcon,
  RocketIcon,
  ShieldIcon,
  SparklesIcon,
  StarIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@factory/ui/components/card";
import { cn } from "@factory/ui/utils";
import { Section } from "../shared/section";
import type { BlockBase } from "../shared/types";
import type { FeatureIconName } from "./icons";

const icons: Record<FeatureIconName, LucideIcon> = {
  sparkles: SparklesIcon,
  zap: ZapIcon,
  shield: ShieldIcon,
  heart: HeartIcon,
  rocket: RocketIcon,
  layers: LayersIcon,
  globe: GlobeIcon,
  clock: ClockIcon,
  star: StarIcon,
  check: CheckIcon,
};

export interface FeatureGridBlock extends BlockBase {
  _type: "featureGrid";
  variant?: "cards" | "plain";
  heading?: string;
  intro?: string;
  items?: Array<{ _key: string; icon?: FeatureIconName; title?: string; body?: string }>;
}

export function FeatureGrid({ variant, heading, intro, items = [] }: FeatureGridBlock) {
  const cards = stegaClean(variant) !== "plain";
  const columns = items.length % 3 === 0 || items.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <Section>
      {(heading || intro) && (
        <div className="mb-12 flex max-w-2xl flex-col gap-3">
          {heading && <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{heading}</h2>}
          {intro && <p className="text-lg text-muted-foreground">{intro}</p>}
        </div>
      )}
      <div className={cn("grid gap-6 sm:grid-cols-2", columns)}>
        {items.map((item) => {
          const Icon = icons[stegaClean(item.icon) as FeatureIconName];
          const content = (
            <>
              {Icon && (
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
              )}
              {item.title && <CardTitle className="font-heading text-lg leading-tight">{item.title}</CardTitle>}
              {item.body && <CardDescription className="text-base">{item.body}</CardDescription>}
            </>
          );
          return cards ? (
            <Card key={item._key}>
              <CardHeader className="gap-2">{content}</CardHeader>
            </Card>
          ) : (
            <div key={item._key} className="flex flex-col gap-2">
              {content}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
