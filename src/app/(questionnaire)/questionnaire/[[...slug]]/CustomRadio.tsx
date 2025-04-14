import { formatNumber } from "@/lib/utils";
import { Radio, RadioProps } from "@mantine/core";

interface Props extends RadioProps {
  selected?: boolean;
}

export default function CustomRadio({ label, value, selected = false }: Props) {
  return (
    <Radio
      value={value}
      label={label}
      color="var(--prune-primary-700)"
      labelPosition="left"
      style={{
        cursor: "pointer",
      }}
      styles={{
        root: {
          background: !selected ? "transparent" : "var(--prune-primary-50)",
          border: !selected
            ? "1px solid var(--prune-text-gray-200)"
            : "2px solid var(--prune-primary-700)",
          padding: "12px 16px",
          borderRadius: "8px",
          cursor: "pointer",
        },
        label: {
          cursor: "pointer",
          textAlign: "left",
        },
        labelWrapper: {
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          cursor: "pointer",
        },
        radio: {
          cursor: "pointer",
        },
      }}
    />
  );
}
