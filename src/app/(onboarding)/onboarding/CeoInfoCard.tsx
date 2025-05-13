import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import { DocumentPreview } from "./DocumentPreview";
import { camelCaseToTitleCase } from "@/lib/utils";

interface CEOInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  data: Record<string, string | null | undefined>;
}

function CEOInfoCard({ setActive, data }: CEOInfoCard) {
  return (
    <Box p={24} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          CEO
        </Text>

        <PrimaryBtn
          variant="outline"
          c="#758604"
          text="Edit"
          rightSection={<IconEdit size={18} color="#758604" />}
          fw={600}
          action={() => setActive(1)}
        />
      </Flex>
      <Stack gap={10} mt={20}>
        {Object.entries(data).map(([key, value]) => (
          <Group key={key} justify="space-between" align="start">
            <Text c="#667085" fz={12}>
              {key}:
            </Text>
            <Text
              c="#344054"
              ta="right"
              w={244}
              fz={12}
              // miw="100%"
              tt="none"
            >
              {value}
            </Text>
          </Group>
        ))}
      </Stack>

      <Box mt={24}>
        <Text c="var(--prune-text-gray-700)" fz={14} fw={600}>
          Uploaded Documents
        </Text>

        <Flex gap={24} w="100%" mt={16}>
          <DocumentPreview label="Identity Document" title={camelCaseToTitleCase(String(data.ceoIdType)))} />
          <DocumentPreview label="Proof of Address" title="File.pdf....." />
        </Flex>
      </Box>
    </Box>
  );
}

export default CEOInfoCard;
