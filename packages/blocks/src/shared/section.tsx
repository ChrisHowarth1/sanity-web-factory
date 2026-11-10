import * as React from "react";
import { cn } from "@factory/ui/utils";

/** Consistent vertical rhythm and max width for every block. */
export function Section({
  className,
  inner,
  children,
  ...props
}: React.ComponentProps<"section"> & { inner?: string }) {
  return (
    <section className={cn("px-4 py-16 sm:px-6 md:py-24", className)} {...props}>
      <div className={cn("mx-auto max-w-6xl", inner)}>{children}</div>
    </section>
  );
}
