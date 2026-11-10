import type { ComponentProps } from "react";
import { Button } from "@factory/ui/components/button";
import type { LinkValue } from "./types";

type ButtonProps = ComponentProps<typeof Button>;

/** A CMS link rendered as a shadcn Button. Renders nothing if incomplete. */
export function LinkButton({
  link,
  ...props
}: { link?: LinkValue } & Pick<ButtonProps, "variant" | "size" | "className">) {
  if (!link?.label || !link?.href) return null;
  const external = /^https?:\/\//.test(link.href);
  return (
    <Button asChild {...props}>
      <a href={link.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {link.label}
      </a>
    </Button>
  );
}
