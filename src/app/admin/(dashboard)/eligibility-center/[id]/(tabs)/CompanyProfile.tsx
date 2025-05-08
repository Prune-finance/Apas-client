import { Box, Flex, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";

export default function CompanyProfile() {
  const summaryData = {
    "Application submitted": dayjs().format("DD-MM-YYYY"),
    "Submitted by": "Sarah Samuel",
  };
  return (
    <Box>
      <Text tt="uppercase" fz={12} fw={600} c="var(--prune-text-gray-800)">
        Summary
      </Text>
      <Flex gap={16} align="center" mt={12}>
        {Object.entries(summaryData).map(([key, value]) => (
          <Stack key={key} gap={12}>
            <Text fz={12} fw={400} c="var(--prune-text-gray-600)" tt="none">
              {key}
            </Text>
            <Text fz={14} fw={600} c="var(--prune-text-gray-800)">
              {value}
            </Text>
          </Stack>
        ))}
      </Flex>
    </Box>
  );
}
