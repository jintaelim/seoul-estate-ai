import { Field, Select, TextField } from "@seed-design/react";

function normalizeOptions(options) {
  return options.map((option) => typeof option === "string"
    ? { value: option, label: option }
    : option);
}

export function SeedTextInput({ label, className = "", suffix, ...inputProps }) {
  return (
    <Field.Root className={`seed-field ${className}`.trim()}>
      <Field.Header><Field.Label>{label}</Field.Label></Field.Header>
      <TextField.Root className="seed-input" size="responsive" variant="outline">
        <TextField.Input {...inputProps} />
        {suffix && <TextField.SuffixText>{suffix}</TextField.SuffixText>}
      </TextField.Root>
    </Field.Root>
  );
}

export function SeedSelect({ label, value, onChange, options, className = "", placeholder = "선택" }) {
  const normalized = normalizeOptions(options);
  return (
    <Field.Root className={`seed-field ${className}`.trim()}>
      <Field.Header><Field.Label>{label}</Field.Label></Field.Header>
      <Select.Root
        size="responsive"
        value={[String(value)]}
        onValueChange={(values) => values[0] != null && onChange(values[0])}
      >
        <Select.Trigger className="seed-select-trigger">
          <Select.Value />
          <Select.Placeholder>{placeholder}</Select.Placeholder>
          <span className="seed-select-chevron" aria-hidden="true">⌄</span>
        </Select.Trigger>
        <Select.Positioner className="seed-select-positioner">
          <Select.Content className="seed-select-content">
            <Select.ScrollArea>
              {normalized.map((option) => (
                <Select.Item value={String(option.value)} label={option.label} key={option.value}>
                  <Select.ItemBody><Select.ItemLabel /></Select.ItemBody>
                  <span className="seed-select-check" aria-hidden="true">✓</span>
                </Select.Item>
              ))}
            </Select.ScrollArea>
          </Select.Content>
        </Select.Positioner>
        <Select.HiddenSelect />
      </Select.Root>
    </Field.Root>
  );
}
