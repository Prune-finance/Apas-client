import { Box, Flex, SimpleGrid, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import PaperContainer from "../PaperContainer";
import { ProfileTextInput } from "@/ui/components/InputWithLabel";

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

      <PaperContainer title="Basic information" mt={20}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <ProfileTextInput
            label="Business Name"
            placeholder="1905 Logistics"
            editing
          />
          <ProfileTextInput label="Trading Name" placeholder="1905 Logistics" />
          <ProfileTextInput label="Industry" placeholder="Logistics" />
          <ProfileTextInput label="Country" placeholder="1905 Logistics" />
          <ProfileTextInput
            label="Business Name"
            placeholder="1905 Logistics"
          />
          <ProfileTextInput
            label="Business Name"
            placeholder="1905 Logistics"
          />
          <ProfileTextInput
            label="Business Name"
            placeholder="1905 Logistics"
          />
        </SimpleGrid>
      </PaperContainer>
    </Box>
  );
}
