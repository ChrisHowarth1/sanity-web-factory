import type { SiteSettings } from "@factory/sanity-client";

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="border-t border-border px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span>{settings?.siteName}</span>
        {settings?.footerText && <span>{settings.footerText}</span>}
      </div>
    </footer>
  );
}
