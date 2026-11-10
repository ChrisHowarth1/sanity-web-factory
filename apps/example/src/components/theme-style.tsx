import { stegaClean } from "next-sanity";
import { generateTheme, themeToCss, type ThemeInput } from "@factory/ui/theme";

/**
 * Writes the variant's theme as CSS variables. In preview, values arrive
 * stega-encoded, so they're cleaned before being turned into colours.
 */
export function ThemeStyle({ theme }: { theme: ThemeInput | null }) {
  const css = themeToCss(generateTheme(stegaClean(theme ?? {})));
  return <style id="factory-theme" dangerouslySetInnerHTML={{ __html: css }} />;
}
