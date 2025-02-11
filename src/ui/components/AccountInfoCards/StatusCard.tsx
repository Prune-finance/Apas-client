import { AccountCustomCard, ThisMonth } from "./util";
import { Flex, Stack, Text } from "@mantine/core";
import { PrimaryBtn } from "../Buttons";
import { IconChevronRight } from "@tabler/icons-react";

interface StatusCardProps {
  title: string;
  total: number;
  percentage: number;
  gain?: boolean;
  viewAction?: () => void;
}

export default function StatusCard({
  title,
  total,
  percentage,
  gain,
  viewAction,
}: StatusCardProps) {
  return (
    <AccountCustomCard>
      <Stack gap={16}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
            {title}
          </Text>

          <PrimaryBtn
            text="View"
            variant="transparent"
            td="underline"
            h="100%"
            p={0}
            c="var(--prune-primary-800)"
            rightSection={<IconChevronRight size={14} />}
            action={viewAction}
            fw={600}
          />
        </Flex>

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
