import { defineField, defineType } from "sanity";
import { ColorWheelIcon } from "@sanity/icons/ColorWheel";
import { fontPairNames, fontPairs, presetNames, presets } from "@factory/ui/theme";
import { ColorInput } from "../components/color-input";
import { RadiusInput } from "../components/radius-input";
import { ThemeDocumentInput } from "../components/theme-document-input";

/**
 * One theme per variant. The custom document input adds a live preview with
 * the generated palette and contrast checks above the fields.
 */
export const theme = defineType({
  name: "theme",
  title: "Theme",
  type: "document",
  icon: ColorWheelIcon,
  components: { input: ThemeDocumentInput },
  fields: [
    defineField({
      name: "preset",
      type: "string",
      description: "Starting point for greys, radius and fonts. Brand colours below override it.",
      options: {
        list: presetNames.map((name) => ({ title: `${presets[name].title} — ${presets[name].description}`, value: name })),
        layout: "radio",
      },
      initialValue: "neutral",
    }),
    defineField({
      name: "primary",
      title: "Primary brand colour",
      type: "string",
      description: "Buttons, links, focus rings. Leave empty to use the preset's.",
      components: { input: ColorInput },
      validation: (rule) => rule.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { name: "hex colour" }),
    }),
    defineField({
      name: "accent",
      title: "Accent colour",
      type: "string",
      description: "Highlight panels and hover tints. Leave empty to use the preset's.",
      components: { input: ColorInput },
      validation: (rule) => rule.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { name: "hex colour" }),
    }),
    defineField({
      name: "radius",
      title: "Corner radius",
      type: "number",
      components: { input: RadiusInput },
      validation: (rule) => rule.min(0).max(1.5),
    }),
    defineField({
      name: "fontPair",
      title: "Fonts",
      type: "string",
      options: { list: fontPairNames.map((name) => ({ title: fontPairs[name].title, value: name })) },
    }),
    defineField({
      name: "mode",
      title: "Colour mode",
      type: "string",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
          { title: "Follow the visitor's system", value: "system" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "light",
    }),
  ],
  preview: {
    select: { preset: "preset", primary: "primary" },
    prepare: ({ preset, primary }) => ({ title: "Theme", subtitle: [preset, primary].filter(Boolean).join(" · ") }),
  },
});
