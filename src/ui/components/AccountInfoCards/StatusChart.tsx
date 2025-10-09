import React, { Dispatch, SetStateAction } from "react";

import { AccountCustomCard, ChartHeader, LegendBadge, ThisMonth } from "./util";
import { Box, Center, Group, Skeleton, Stack, Text } from "@mantine/core";
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
  accountType: "Issued" | "Payout" | "Business";
  loading?: boolean;
}

export default function StatusChart({
  frequency,
  setFrequency,
  total,
  chartData: data,
  title,
  accountType,
  loading = false,
}: StatusChartProps) {
  return (
    <AccountCustomCard>
      <Stack gap={16}>
        <ChartHeader
          title={title}
          value={frequency}
          setValue={setFrequency}
          accountType={accountType}
        />

        <Group justify="space-between">
          {loading ? (
            <Skeleton w={100} h={24} />
          ) : (
            <Text fz={24} fw={600} c="var(--prune-text-gray-700)">
              {total}
            </Text>
          )}

          <ThisMonth percentage={23} gain frequency={frequency} />
        </Group>

        <Center w="100%">
          {loading ? (
            <Skeleton h={240} w={240} circle />
          ) : (
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
          )}
        </Center>
      </Stack>
    </AccountCustomCard>
  );
}

const legend = {
  active: "var(--prune-primary-600)",
  inactive: "var(--prune-text-gray-200)",
};
