import { Card, Group, keys, Stack, Text } from "@mantine/core";
import { ChartHeader, LegendBadge, ThisMonth } from "./util";
import { Dispatch, SetStateAction } from "react";
import { formatNumber } from "@/lib/utils";
import { BarChart } from "@mantine/charts";

type ChartData = {
  month: string;
  inflow: number;
  outflow: number;
};

interface FlowChartProps {
  balance: number;
  frequency: string | null;
  setFrequency: Dispatch<SetStateAction<string | null>>;
  chartData: ChartData[]; // Add chartData prop
}
export default function FlowChart({
  balance,
  frequency,
  setFrequency,
  chartData,
}: FlowChartProps) {
  return (
    <Card
      withBorder
      radius={4}
      p="16px 16px 23px 16px"
      style={{ border: "1px solid var(--prune-text-gray-100)" }}
    >
      <Stack gap={16}>
        <ChartHeader
          title="Total Business Account Balance"
          value={frequency}
          setValue={setFrequency}
        />

        <Group justify="space-between">
          <Stack gap={8}>
            <Text fz={24} c="var(--prune-text-gray-700)" fw={600}>
              {formatNumber(balance, true, "EUR")}
            </Text>

            <ThisMonth percentage={2.3} gain />
          </Stack>

          <Group gap={12}>
            {Object.entries(legend).map(([title, color]) => (
              <LegendBadge key={title} title={title} color={color} />
            ))}
          </Group>
        </Group>

        <BarChart
          h={232}
          w="100%"
          mt={10}
          data={chartData}
          dataKey="month"
          series={[
            {
              name: "inflow",
              color: "var(--prune-primary-600)",
              label: "Inflow",
            },
            { name: "outflow", color: "#DE1507", label: "Outflow" },
          ]}
          tickLine="none"
          tooltipProps={
            {
              // shared: false,
            }
          }
          // valueFormatter={(value) => formatNumber(value, true, "EUR")}
        />
      </Stack>
    </Card>
  );
}

const legend = {
  inflow: "#D5E855",
  outflow: "#D92D20",
};
