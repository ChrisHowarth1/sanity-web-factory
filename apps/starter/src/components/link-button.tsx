import type { ComponentProps } from "react";
import { Button } from "@factory/ui/components/button";
import type { LinkValue } from "@factory/blocks";

type ButtonProps = ComponentProps<typeof Button>;

export function LinkButton({ link, ...props }: { link?: LinkValue } & Pick<ButtonProps, "variant" | "size">) {
  if (!link?.label || !link?.href) return null;
  return (
    <Button asChild {...props}>
      <a href={link.href}>{link.label}</a>
    </Button>
  );
}
