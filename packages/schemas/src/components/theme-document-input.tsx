import { useMemo, useState } from "react";
import type { ObjectInputProps } from "sanity";
import { Badge, Box, Card, Flex, Grid, Stack, Tab, TabList, Text } from "@sanity/ui";
import {
  checkContrast,
  generateTheme,
  toCss,
  type ResolvedTheme,
  type ThemeInput,
  type TokenName,
} from "@factory/ui/theme";

const swatches: Array<{ label: string; bg: TokenName; fg: TokenName }> = [
  { label: "Primary", bg: "primary", fg: "primary-foreground" },
  { label: "Highlight", bg: "highlight", fg: "highlight-foreground" },
  { label: "Background", bg: "background", fg: "foreground" },
  { label: "Muted", bg: "muted", fg: "muted-foreground" },
  { label: "Secondary", bg: "secondary", fg: "secondary-foreground" },
  { label: "Accent", bg: "accent", fg: "accent-foreground" },
];

/**
 * Wraps the theme document form with a live preview: the generated palette in
 * light and dark, a sample of real UI, and WCAG AA contrast warnings.
 */
export function ThemeDocumentInput(props: ObjectInputProps) {
  const value = (props.value ?? {}) as ThemeInput;
  const theme = useMemo(() => generateTheme(value), [value]);
  const issues = useMemo(() => checkContrast(theme), [theme]);
  const [mode, setMode] = useState<"light" | "dark">("light");

  return (
    <Stack gap={5}>
      <Card padding={4} radius={3} border>
        <Stack gap={4}>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Text weight="semibold">Preview</Text>
            <TabList gap={1}>
              <Tab id="light" aria-controls="theme-preview" label="Light" selected={mode === "light"} onClick={() => setMode("light")} />
              <Tab id="dark" aria-controls="theme-preview" label="Dark" selected={mode === "dark"} onClick={() => setMode("dark")} />
            </TabList>
          </Flex>
          <div id="theme-preview">
            <Sample theme={theme} mode={mode} />
          </div>
          <Grid gridTemplateColumns={[2, 3, 6]} gap={2}>
            {swatches.map(({ label, bg, fg }) => (
              <Swatch key={label} label={label} bg={toCss(theme[mode][bg])} fg={toCss(theme[mode][fg])} />
            ))}
          </Grid>
          {issues.length === 0 ? (
            <Flex gap={2} align="center">
              <Badge tone="positive">AA</Badge>
              <Text size={1} muted>
                All text and background pairs meet WCAG AA (4.5:1) in light and dark.
              </Text>
            </Flex>
          ) : (
            <Card tone="caution" padding={3} radius={2}>
              <Stack gap={2}>
                <Text size={1} weight="semibold">
                  {issues.length} contrast {issues.length === 1 ? "pair is" : "pairs are"} below AA
                </Text>
                {issues.map((issue) => (
                  <Text key={`${issue.mode}-${issue.background}-${issue.text}`} size={1}>
                    {issue.mode}: {issue.text} on {issue.background} is {issue.ratio}:1. Try a darker or lighter
                    brand colour.
                  </Text>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}

function Swatch({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <div
      style={{
        background: bg,
        color: fg,
        borderRadius: 6,
        padding: "10px 10px 8px",
        boxShadow: "inset 0 0 0 1px rgba(127,127,127,.25)",
        fontSize: 12,
        lineHeight: 1.3,
      }}
    >
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div style={{ opacity: 0.8 }}>Aa text</div>
    </div>
  );
}

function Sample({ theme, mode }: { theme: ResolvedTheme; mode: "light" | "dark" }) {
  const t = (name: TokenName) => toCss(theme[mode][name]);
  const radius = theme.radius;
  return (
    <Box
      style={{
        background: t("background"),
        color: t("foreground"),
        fontFamily: theme.fonts.sans,
        borderRadius: 8,
        padding: 24,
        boxShadow: `inset 0 0 0 1px ${t("border")}`,
      }}
    >
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)" }}>
        <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
          <span
            style={{
              justifySelf: "start",
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              background: t("secondary"),
              color: t("secondary-foreground"),
              boxShadow: `inset 0 0 0 1px ${t("border")}`,
            }}
          >
            New
          </span>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: 24, fontWeight: 600, lineHeight: 1.15 }}>
            Build pages from blocks
          </div>
          <div style={{ color: t("muted-foreground"), fontSize: 14 }}>
            This is how body copy and muted text look with this theme.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            <span style={{ background: t("primary"), color: t("primary-foreground"), padding: "8px 14px", borderRadius: `calc(${radius} - 2px)`, fontSize: 13, fontWeight: 500 }}>
              Get started
            </span>
            <span style={{ background: t("background"), color: t("foreground"), boxShadow: `inset 0 0 0 1px ${t("border")}`, padding: "8px 14px", borderRadius: `calc(${radius} - 2px)`, fontSize: 13, fontWeight: 500 }}>
              Learn more
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ background: t("card"), color: t("card-foreground"), boxShadow: `inset 0 0 0 1px ${t("border")}`, borderRadius: `calc(${radius} + 4px)`, padding: 14 }}>
            <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, fontSize: 14 }}>Card title</div>
            <div style={{ color: t("muted-foreground"), fontSize: 12, marginTop: 4 }}>Cards, borders and radius.</div>
          </div>
          <div style={{ background: t("highlight"), color: t("highlight-foreground"), borderRadius: `calc(${radius} + 4px)`, padding: 14, fontSize: 13, fontWeight: 600 }}>
            Highlight panel
          </div>
        </div>
      </div>
    </Box>
  );
}
