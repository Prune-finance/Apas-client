import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import { DocumentPreview } from "./DocumentPreview";

interface DocumentInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  data: Record<string, string>;
}

function DocumentInfoCard({ setActive, data }: DocumentInfoCard) {
  return (
    <Box p={16} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          Business Document
        </Text>

        <PrimaryBtn
          variant="outline"
          c="#758604"
          text="Edit"
          rightSection={<IconEdit size={18} color="#758604" />}
          fw={600}
          action={() => setActive(2)}
        />
      </Flex>

      <Box mt={24}>
        <Flex gap={24} w="100%" mt={16}>
          <DocumentPreview label="Identity Document" title="File.pdf....." />
          <DocumentPreview label="Proof of Address" title="File.pdf....." />
        </Flex>
        <Flex gap={24} w="100%" mt={16}>
          <DocumentPreview label="Identity Document" title="File.pdf....." />
          <DocumentPreview label="Proof of Address" title="File.pdf....." />
        </Flex>
      </Box>
    </Box>
  );
}

export default DocumentInfoCard;
