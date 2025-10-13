import { formatNumber } from "@/lib/utils";
import { ChartTooltipProps } from "@mantine/charts";
import { Paper, Stack, Group, Text } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";

interface IChartTooltipProps extends ChartTooltipProps {
  locale?: string;
  currency?: string;
}

export default function ChartTooltip({
  label,
  payload,
  locale,
  currency,
}: IChartTooltipProps) {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5}>
        {label}
      </Text>

      <Stack gap={5}>
        {payload.map((item: any) => (
          <Group key={item.name} wrap="nowrap" justify="space-between">
            <Group gap={10}>
              <IconCircleFilled size={15} color={item.color} />
              <Text fz={12}>{item.name}</Text>
            </Group>

            <Text key={item.name} fz={12} fw={500}>
              {formatNumber(item.value, true, currency, locale)}
            </Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
