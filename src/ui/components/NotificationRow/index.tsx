import { ActionIcon, Box, Divider, Group, Stack, Text } from "@mantine/core";
import { IconBell, IconCircleFilled } from "@tabler/icons-react";
import dayjs from "dayjs";

interface Props {
  title: string;
  text: string;
  createdAt: Date;
  status: "unread" | "read";
  lastRow?: boolean;
}

export const NotificationRow = ({
  title,
  text,
  createdAt,
  status,
  lastRow,
}: Props) => {
  return (
    <Box px={28}>
      <Group wrap="nowrap" justify="space-between" py={15}>
        <Group gap={12} wrap="nowrap" flex={5}>
          <ActionIcon
            radius={"50%"}
            size={48}
            variant="light"
            style={{
              border: `1px solid ${
                status === "unread" ? "#97AD05" : "var(--prune-text-gray-300)"
              }`,
            }}
            color={
              status === "unread" ? "#97AD05" : "var(--prune-text-gray-300)"
            }
          >
            <IconBell
              color={
                status === "read" ? "var(--prune-text-gray-500)" : "#97AD05"
              }
              stroke={1}
            />
          </ActionIcon>

          <Stack gap={5}>
            <Text fw={600} fz={14} c="var(--prune-text-gray-800)">
              {title}
            </Text>
            <Text fw={400} fz={12} c="var(--prune-text-gray-500)" lineClamp={1}>
              {text}
            </Text>
          </Stack>
        </Group>

        <Stack gap={5} flex={2} align="end">
          <ActionIcon
            size={12}
            color="var(--prune-primary-600)"
            variant="transparent"
          >
            <IconCircleFilled
              size={12}
              color={status === "unread" ? "var(--prune-primary-600)" : "#fff"}
            />
          </ActionIcon>

          <Text fw={400} fz={12} c="var(--prune-text-gray-500)">
            {dayjs(createdAt).format("Do MMMM,  YYYY")}
          </Text>
        </Stack>
      </Group>

      {!lastRow && <Divider color="var(--prune-text-gray-100)" />}
    </Box>
  );
};
