import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/ibm-plex-sans";
import "./globals.css";
import { ThemeStyle } from "@/components/theme-style";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DemoBanner } from "@/components/demo-banner";
import { getSiteData, isDraftMode } from "@/sanity/fetch";
import { env, SanityLive } from "@/sanity/live";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const name = settings?.siteName ?? "Untitled site";
  return {
    title: { default: name, template: `%s · ${name}` },
    description: settings?.description,
    // The preview site must never be indexed.
    robots: env.visualEditing ? { index: false, follow: false } : undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ settings, theme }, draft] = await Promise.all([getSiteData(), isDraftMode()]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeStyle theme={theme} />
      </head>
      <body className="flex min-h-dvh flex-col">
        {!env.configured && <DemoBanner />}
        <SiteHeader settings={settings} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
        {env.visualEditing && <SanityLive />}
        {draft && <VisualEditing />}
      </body>
    </html>
  );
}
