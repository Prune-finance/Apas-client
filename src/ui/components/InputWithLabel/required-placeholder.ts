type RequiredProps = { required?: boolean; withAsterisk?: boolean };

// Fields are treated as required unless they opt out with `withAsterisk={false}` /
// `required={false}`, or their label says "(Optional)".
export function showAsterisk(props: RequiredProps, label?: unknown): boolean {
  if (props.withAsterisk !== undefined) return props.withAsterisk;
  if (props.required !== undefined) return props.required;
  // Custom JSX labels may draw their own asterisk, so only plain-text labels default to required
  if (typeof label !== "string") return false;
  return !/optional/i.test(label);
}

// For fields without a visible label (placeholder only), carry the asterisk in the
// placeholder text instead — only when the field is explicitly marked required.
export function requiredPlaceholder(
  placeholder: string | undefined,
  props: RequiredProps
): string | undefined {
  if (!placeholder || !placeholder.trim()) return placeholder;
  if (!(props.withAsterisk ?? props.required)) return placeholder;
  if (placeholder.trimEnd().endsWith("*")) return placeholder;
  return `${placeholder} *`;
}
