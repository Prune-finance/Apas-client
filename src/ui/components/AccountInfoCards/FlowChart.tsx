import { Group, Stack, Text } from "@mantine/core";
import { AccountCustomCard, ChartHeader, LegendBadge, ThisMonth } from "./util";
import { Dispatch, SetStateAction } from "react";
import { formatNumber } from "@/lib/utils";
import { BarChart } from "@mantine/charts";

export type ChartData = {
  month: string;
  inflow: number;
  outflow: number;
};

interface FlowChartProps {
  balance: number;
  frequency: string | null;
  setFrequency: Dispatch<SetStateAction<string | null>>;
  chartData: ChartData[]; // Add chartData prop
  accountType: "Issued" | "Payout" | "Business";
  currency?: string;
  locale?: string;
}
export default function FlowChart({
  balance,
  frequency,
  setFrequency,
  chartData,
  accountType,
  currency = "EUR",
  locale = "en-US",
}: FlowChartProps) {
  return (
    <AccountCustomCard>
      <Stack gap={16}>
        <ChartHeader
          title="Total Business Account Balance"
          value={frequency}
          setValue={setFrequency}
          accountType={accountType}
          isFlowChart
        />

        <Group justify="space-between">
          <Stack gap={8}>
            <Text fz={24} c="var(--prune-text-gray-700)" fw={600}>
              {formatNumber(balance, true, currency, locale)}
            </Text>

            <ThisMonth percentage={2.3} gain frequency={frequency} />
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
          tooltipProps={{
            formatter: (value) => [`${formatNumber(value, true, "EUR")}`],
            payload: [{ name: "05-01", value: 12, unit: "kg" }],
          }}
          // valueFormatter={(value) => formatNumber(value, true, "EUR")}
        />
      </Stack>
    </AccountCustomCard>
  );
}

const legend = {
  inflow: "#D5E855",
  outflow: "#D92D20",
};
