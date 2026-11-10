import { set, unset, useFormValue, type NumberInputProps } from "sanity";
import { Button, Flex, Text } from "@sanity/ui";
import { presets, type PresetName } from "@factory/ui/theme";

/** Slider from square (0) to very round (1.5rem). Empty means "use the preset's". */
export function RadiusInput({ value, onChange, elementProps }: NumberInputProps) {
  const preset = (useFormValue(["preset"]) as PresetName | undefined) ?? "neutral";
  const current = typeof value === "number" ? value : (presets[preset]?.radius ?? 0.625);

  return (
    <Flex gap={3} align="center">
      <input
        id={elementProps.id}
        ref={elementProps.ref as React.Ref<HTMLInputElement>}
        type="range"
        min={0}
        max={1.5}
        step={0.125}
        value={current}
        onChange={(event) => onChange(set(Number(event.currentTarget.value)))}
        style={{ flex: 1 }}
      />
      <div
        aria-hidden
        style={{ width: 32, height: 32, border: "2px solid currentColor", borderRadius: `${current}rem`, opacity: 0.6 }}
      />
      <Text size={1} muted style={{ width: 120 }}>
        {current}rem{typeof value === "number" ? "" : " (preset)"}
      </Text>
      {typeof value === "number" && <Button mode="ghost" text="Use preset" onClick={() => onChange(unset())} />}
    </Flex>
  );
}
