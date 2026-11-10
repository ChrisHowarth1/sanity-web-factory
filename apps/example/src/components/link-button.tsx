import { Button, type ButtonProps } from "@factory/ui/components/button";
import type { LinkValue } from "@factory/blocks";

export function LinkButton({ link, ...props }: { link?: LinkValue } & Pick<ButtonProps, "variant" | "size">) {
  if (!link?.label || !link?.href) return null;
  return (
    <Button asChild {...props}>
      <a href={link.href}>{link.label}</a>
    </Button>
  );
}
