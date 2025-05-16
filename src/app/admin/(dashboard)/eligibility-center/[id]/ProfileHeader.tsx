import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Flex, Group, Text, ThemeIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import React from "react";
import Skeleton from "./Skeleton";
import { OnboardingBusiness } from "@/lib/interface";

interface ProfileHeaderProps {
  data: OnboardingBusiness | null;
  loading: boolean;
}
export default function ProfileHeader({ data, loading }: ProfileHeaderProps) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify={{ base: "flex-start", md: "space-between" }}
      align={{ base: "start", md: "center" }}
      m="32px 0px 24px"
      gap={24}
    >
      <Group gap={10}>
        <Skeleton loading={loading} w={150}>
          <Text c="var(--prune-text-gray-700)" fw={500} fz={18}>
            {data?.businessName}
          </Text>
        </Skeleton>

        <Skeleton loading={loading} w={150}>
          <BadgeComponent
            status={data?.status || "QUESTIONNAIRE"}
            stage
            // variant="dot"
            w={150}
          />
        </Skeleton>
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
