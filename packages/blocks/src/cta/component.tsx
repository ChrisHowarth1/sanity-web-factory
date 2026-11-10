import { stegaClean } from "next-sanity";
import { cn } from "@factory/ui/utils";
import { Section } from "../shared/section";
import { LinkButton } from "../shared/link-button";
import type { BlockBase, LinkValue } from "../shared/types";

export interface CtaBlock extends BlockBase {
  _type: "cta";
  variant?: "panel" | "highlight" | "subtle";
  heading?: string;
  body?: string;
  link?: LinkValue;
}

const styles = {
  panel: { panel: "bg-primary text-primary-foreground", body: "opacity-85", button: "secondary" },
  highlight: { panel: "bg-highlight text-highlight-foreground", body: "opacity-85", button: "secondary" },
  subtle: { panel: "border border-border bg-muted", body: "text-muted-foreground", button: "default" },
} as const;

export function Cta({ variant, heading, body, link }: CtaBlock) {
  const style = styles[stegaClean(variant) ?? "panel"] ?? styles.panel;
  return (
    <Section>
      <div
        className={cn(
          "flex flex-col items-start gap-6 rounded-2xl p-8 md:flex-row md:items-center md:justify-between md:p-12",
          style.panel,
        )}
      >
        <div className="flex max-w-2xl flex-col gap-2">
          {heading && <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{heading}</h2>}
          {body && <p className={cn("text-lg", style.body)}>{body}</p>}
        </div>
        <LinkButton link={link} size="lg" variant={style.button} />
      </div>
    </Section>
  );
}
