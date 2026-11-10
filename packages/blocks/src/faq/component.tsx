import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@factory/ui/components/accordion";
import { Section } from "../shared/section";
import type { BlockBase } from "../shared/types";

export interface FaqBlock extends BlockBase {
  _type: "faq";
  heading?: string;
  intro?: string;
  items?: Array<{ _key: string; question?: string; answer?: string }>;
}

/** Server component; only the shadcn Accordion inside it ships JS. */
export function Faq({ heading, intro, items = [] }: FaqBlock) {
  return (
    <Section inner="grid gap-10 md:grid-cols-[1fr_2fr]">
      <div className="flex flex-col gap-3">
        {heading && <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>}
        {intro && <p className="text-muted-foreground">{intro}</p>}
      </div>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem key={item._key} value={item._key}>
            <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
            <AccordionContent className="text-base whitespace-pre-line">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
