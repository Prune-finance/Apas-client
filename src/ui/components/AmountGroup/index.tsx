import { formatNumber } from "@/lib/utils";
import { Group, Text, TextProps } from "@mantine/core";
import { IconArrowDownLeft, IconArrowUpRight } from "@tabler/icons-react";

interface Props extends TextProps {
  amount?: number;
  type: "DEBIT" | "CREDIT";
  textFontSize?: number;
  colored?: boolean;
}

export const AmountGroup = ({
  amount,
  type,
  textFontSize = 14,
  colored,
  ...props
}: Props) => {
  return (
    <Group gap={3}>
      {type === "DEBIT" ? (
        <IconArrowUpRight color="#D92D20" size={16} />
      ) : (
        <IconArrowDownLeft color="#12B76A" size={16} />
      )}
      {amount ? (
        formatNumber(amount, true, "EUR")
      ) : (
        <Text
          tt="capitalize"
          fz={textFontSize}
          fw={600}
          {...(colored && {
            c:
              type === "DEBIT"
                ? "var(--prune-warning)"
                : "var(--prune-success-500)",
          })}
          {...props}
        >
          {type.toLowerCase()}
        </Text>
      )}
    </Group>
  );
};
