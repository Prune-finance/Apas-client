import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Group, Text, ThemeIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import React from "react";

export default function ProfileHeader() {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify={{ base: "flex-start", md: "space-between" }}
      align={{ base: "start", md: "center" }}
      m="32px 0px 24px"
      gap={24}
    >
      <Group gap={10}>
        <Text c="var(--prune-text-gray-700)" fw={500} fz={18}>
          1905 Logistics
        </Text>
        <BadgeComponent status="PENDING" variant="dot" />
      </Group>

      <Group gap={10}>
        <ThemeIcon color="var(--prune-text-gray-700)" variant="light" size={36}>
          <IconDownload size={24} />
        </ThemeIcon>

        <PrimaryBtn
          text="Reject Company"
          color="var(--prune-warning)"
          c="#fff"
          fw={600}
        />
        <PrimaryBtn text="Send Onboarding Link" fw={600} />
      </Group>
    </Flex>
  );
}
