import { useCallback, useEffect, useState } from "react";
import { set, unset, useFormValue, type StringInputProps } from "sanity";
import { Box, Button, Flex, TextInput } from "@sanity/ui";
import { presets, type PresetName } from "@factory/ui/theme";

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Native colour picker + hex field. Empty means "use the preset's colour". */
export function ColorInput(props: StringInputProps) {
  const { value, onChange, elementProps, path } = props;
  const preset = (useFormValue(["preset"]) as PresetName | undefined) ?? "neutral";
  const fieldName = path[path.length - 1] as "primary" | "accent";
  const fallback = presets[preset]?.[fieldName] ?? "#000000";
  const [draft, setDraft] = useState(value ?? "");

  useEffect(() => setDraft(value ?? ""), [value]);

  const commit = useCallback(
    (next: string) => {
      const trimmed = next.trim();
      if (!trimmed) onChange(unset());
      else if (HEX.test(trimmed)) onChange(set(trimmed.toLowerCase()));
    },
    [onChange],
  );

  return (
    <Flex gap={2} align="center">
      <Box
        as="label"
        style={{
          position: "relative",
          width: 36,
          height: 36,
          borderRadius: 6,
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)",
          background: HEX.test(draft) ? draft : fallback,
          cursor: "pointer",
        }}
      >
        <input
          type="color"
          aria-label="Pick a colour"
          value={HEX.test(draft) && draft.length === 7 ? draft : fallback}
          onChange={(event) => {
            setDraft(event.currentTarget.value);
            commit(event.currentTarget.value);
          }}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
        />
      </Box>
      <Box flex={1}>
        <TextInput
          {...elementProps}
          value={draft}
          placeholder={`${fallback} (preset)`}
          onChange={(event) => setDraft(event.currentTarget.value)}
          onBlur={(event) => {
            elementProps.onBlur(event);
            commit(draft);
          }}
          onKeyDown={(event) => event.key === "Enter" && commit(draft)}
        />
      </Box>
      {value && <Button mode="ghost" text="Use preset" onClick={() => onChange(unset())} />}
    </Flex>
  );
}
