import React from "react";
import { AccountCustomCard, ThisMonth } from "./util";
import { Flex, Group, Stack, Text } from "@mantine/core";
import { formatNumber } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  total: number;
  percentage: number;
  gain?: boolean;
}

export default function StatusCard({
  title,
  total,
  percentage,
  gain,
}: StatusCardProps) {
  return (
    <AccountCustomCard>
      <Stack gap={16}>
        <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
          {title}
        </Text>

        <Flex align="center" justify="space-between">
          <Text fz={24} fw={600} c="var(--prune-text-gray-700)">
            {total}
          </Text>

          <ThisMonth percentage={percentage} gain={gain} />
        </Flex>
      </Stack>
    </AccountCustomCard>
  );
}
