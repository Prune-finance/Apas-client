import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";

interface BasicInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  data: Record<string, string>;
}

function BasicInfoCard({ setActive, data }: BasicInfoCard) {
  return (
    <Box p={16} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          Basic Information
        </Text>

        <PrimaryBtn
          variant="outline"
          c="#758604"
          text="Edit"
          rightSection={<IconEdit size={18} color="#758604" />}
          fw={600}
          action={() => setActive(0)}
        />
      </Flex>
      <Stack gap={10} mt={20}>
        {Object.entries(data).map(([key, value]) => (
          <Group key={key} justify="space-between" align="start">
            <Text c="var(--prune-text-gray-700)" fz={12}>
              {key}:
            </Text>
            <Text
              c="var(--prune-text-gray-500)"
              ta="left"
              w={244}
              fz={12}
              // miw="100%"
            >
              {value}
            </Text>
          </Group>
        ))}
      </Stack>
    </Box>
  );
}

export default BasicInfoCard;
