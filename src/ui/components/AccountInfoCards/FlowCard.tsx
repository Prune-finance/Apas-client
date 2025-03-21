import React from "react";
import { AccountCustomCard, ThisMonth } from "./util";
import { Group, Stack, Text } from "@mantine/core";
import { formatNumber } from "@/lib/utils";
interface FlowCardProps {
  title: string;
  total: number;
  percentage: number;
  gain?: boolean;
}
export default function FlowCard({
  title,
  total,
  percentage,
  gain,
}: FlowCardProps) {
  return (
    <AccountCustomCard>
      <Stack gap={16}>
        <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
          {title}
        </Text>

        <Group justify="space-between">
          <Text fz={24} fw={600} c="var(--prune-text-gray-700)">
            {formatNumber(total, true, "EUR")}
          </Text>

          <ThisMonth percentage={percentage} gain={gain} />
        </Group>
      </Stack>
    </AccountCustomCard>
  );
}
