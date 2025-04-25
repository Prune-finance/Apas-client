import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import { DocumentPreview } from "./DocumentPreview";

interface ShareholderInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  data: Record<string, string>;
}

function ShareholderInfoCard({ setActive, data }: ShareholderInfoCard) {
  return (
    <Box p={24} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          Shareholder
        </Text>

        <PrimaryBtn
          variant="outline"
          c="#758604"
          text="Edit"
          rightSection={<IconEdit size={18} color="#758604" />}
          fw={600}
          action={() => setActive(4)}
        />
      </Flex>

      <Text
        c="var(--prune-text-gray-700)"
        fz={12}
        fw={600}
        mt={24}
        tt="uppercase"
      >
        SHAREHOLDER 1
      </Text>

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
            >
              {value}
            </Text>
          </Group>
        ))}
      </Stack>

      <Box mt={16}>
        <Text c="var(--prune-text-gray-700)" fz={14} fw={600}>
          Uploaded Documents
        </Text>

        <Flex gap={24} w="100%" mt={16}>
          <DocumentPreview label="Identity Document" title="File.pdf....." />
          <DocumentPreview label="Proof of Address" title="File.pdf....." />
        </Flex>
      </Box>
    </Box>
  );
}

export default ShareholderInfoCard;
