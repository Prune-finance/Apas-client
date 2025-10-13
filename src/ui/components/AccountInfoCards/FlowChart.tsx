import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { AccountCustomCard, ChartHeader, LegendBadge, ThisMonth } from "./util";
import { Dispatch, SetStateAction } from "react";
import { formatNumber } from "@/lib/utils";
import { BarChart, ChartTooltipProps } from "@mantine/charts";
import React from "react";
import { IconCircleFilled } from "@tabler/icons-react";
import ChartTooltip from "../ChartTooltip";

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
  loading?: boolean;
}
export default function FlowChart({
  balance,
  frequency,
  setFrequency,
  chartData,
  accountType,
  currency = "EUR",
  locale = "en-US",
  loading = false,
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
            {loading ? (
              <Skeleton w={100} h={24} />
            ) : (
              <Text fz={24} c="var(--prune-text-gray-700)" fw={600}>
                {formatNumber(balance, true, currency, locale)}
              </Text>
            )}

            <ThisMonth percentage={2.3} gain frequency={frequency} />
          </Stack>

          <Group gap={12}>
            {Object.entries(legend).map(([title, color]) => (
              <LegendBadge key={title} title={title} color={color} />
            ))}
          </Group>
        </Group>

        {loading ? (
          <Skeleton h={232} />
        ) : (
          <BarChart
            h={232}
            w="100%"
            mt={10}
            data={chartData}
            dataKey="month"
            maxBarWidth={20}
            minBarSize={1}
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
              content: ({ label, payload }) => (
                <ChartTooltip
                  label={label}
                  payload={payload}
                  locale={locale}
                  currency={currency}
                />
              ),
            }}
          />
        )}
      </Stack>
    </AccountCustomCard>
  );
}

const legend = {
  inflow: "#D5E855",
  outflow: "#D92D20",
};
