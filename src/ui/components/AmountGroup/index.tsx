import { formatNumber } from "@/lib/utils";
import { Group, Text } from "@mantine/core";
import { IconArrowDownLeft, IconArrowUpRight } from "@tabler/icons-react";

interface Props {
  amount?: number;
  type: "DEBIT" | "CREDIT";
  textFontSize?: number;
}

export const AmountGroup = ({ amount, type, textFontSize = 14 }: Props) => {
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
        <Text tt="capitalize" fz={textFontSize} fw={600}>
          {type.toLowerCase()}
        </Text>
      )}
    </Group>
  );
};
