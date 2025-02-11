import React, { Dispatch, SetStateAction } from "react";

import { AccountCustomCard, ChartHeader, LegendBadge, ThisMonth } from "./util";
import { Box, Center, Group, Stack, Text } from "@mantine/core";
import { DonutChart } from "@mantine/charts";

type ChartData = {
  name: string;
  value: number;
  color: string;
};

interface StatusChartProps {
  frequency: string | null;
  setFrequency: Dispatch<SetStateAction<string | null>>;
  total: number;
  chartData: ChartData[];
  title: string;
}

export default function StatusChart({
  frequency,
  setFrequency,
  total,
  chartData: data,
  title,
}: StatusChartProps) {
  return (
    <AccountCustomCard>
      <Stack gap={16}>
        <ChartHeader title={title} value={frequency} setValue={setFrequency} />

        <Group justify="space-between">
          <Text fz={24} fw={600} c="var(--prune-text-gray-700)">
            {total}
          </Text>

          <ThisMonth percentage={23} gain />
        </Group>

        <Center w="100%">
          <Box>
            <DonutChart
              size={240}
              thickness={35}
              data={data}
              tooltipDataSource="segment"
            />

            <Group justify="center" mt={10}>
              {Object.entries(legend).map(([title, color]) => (
                <LegendBadge key={title} title={title} color={color} />
              ))}
            </Group>
          </Box>
        </Center>
      </Stack>
    </AccountCustomCard>
  );
}

const legend = {
  active: "var(--prune-primary-600)",
  inactive: "var(--prune-text-gray-200)",
};
