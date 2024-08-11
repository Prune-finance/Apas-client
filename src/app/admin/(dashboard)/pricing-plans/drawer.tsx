import { Box, Divider, Group, List, Stack, Text } from "@mantine/core";
import React from "react";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { formatNumber } from "@/lib/utils";
import { PricingPlan } from "@/lib/hooks/pricing-plan";

dayjs.extend(advancedFormat);

export default function PlanDrawer({ data }: { data: PricingPlan | null }) {
  const senderDetails = [
    { title: "Plan Name", value: data?.name },
    { title: "Cycle", value: data?.cycle },
    // { title: "Description", value: data?.description },
    {
      title: "Date Created",
      value: dayjs(data?.createdAt).format("Do MMM YYYY"),
    },
  ];

  return (
    <Box>
      <Divider mb={18} />

      <Stack gap={8} px={20}>
        <Text fz={12} fw={500} c="(--prune-text-gray-500)">
          Amount
        </Text>
        <Text fz={32} fw={600} c="var(--prune-primary-700)">
          {formatNumber(data?.cost ?? 0)}
        </Text>
      </Stack>

      <Divider mt={28} mb={24} />

      <Box px={20}>
        <Text fz={16} fw={500} c="var(--prune-text-gray-800)" mb={24}>
          Sender Details
        </Text>

        <Stack gap={12}>
          {senderDetails.map((detail, idx) => (
            <Group justify="space-between" key={idx} gap={8}>
              <Text fz={12} c="var(--prune-text-gray-500)">
                {detail.title}
              </Text>
              <Text fz={14} fw={500} c="var(--prune-text-gray-600)">
                {detail.value}
              </Text>
            </Group>
          ))}
        </Stack>
      </Box>

      <Divider mt={28} mb={24} />

      <Box px={20}>
        <List type="ordered" spacing={24}>
          {features.map((feature, idx) => (
            <List.Item key={idx}>
              <Text fz={14} c="var(--prune-text-gray-600)">
                {feature}
              </Text>
            </List.Item>
          ))}
        </List>
      </Box>
    </Box>
  );
}

const features = [
  "Complete Documentation",
  "Working Materials in Figma",
  "100GB Cloud Storage",
  "Email Automation",
];
