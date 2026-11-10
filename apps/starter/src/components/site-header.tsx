import { LinkButton } from "@/components/link-button";
import type { SiteSettings } from "@factory/sanity-client";

export function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6">
        <a href="/" className="font-heading text-lg font-semibold tracking-tight">
          {settings?.siteName ?? "Untitled site"}
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          {settings?.nav?.map((item) =>
            item.href ? (
              <a
                key={item._key}
                href={item.href}
                className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                {item.label}
              </a>
            ) : null,
          )}
          <LinkButton link={settings?.headerCta} size="sm" />
        </nav>
      </div>
    </header>
  );
}
