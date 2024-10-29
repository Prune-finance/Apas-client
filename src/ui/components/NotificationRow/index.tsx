import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import { ActionIcon, Box, Divider, Group, Stack, Text } from "@mantine/core";
import { IconBell, IconCircleFilled } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import Cookies from "js-cookie";

interface Props {
  title: string;
  id: string;
  description: string;
  createdAt: Date;
  readAt: Date | null;
  lastRow?: boolean;
  business?: boolean;
  revalidate?: () => void;
}

export const NotificationRow = ({
  title,
  id,
  description,
  createdAt,
  readAt,
  lastRow,
  business,
  revalidate,
}: Props) => {
  const { handleError } = useNotification();

  const handleNotificationClick = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/${id}/mark-as-read`,
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get("auth")}` },
        }
      );

      revalidate && revalidate();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  return (
    <>
      <Group
        wrap="nowrap"
        justify="space-between"
        py={15}
        onClick={() => handleNotificationClick()}
      >
        <Group gap={12} wrap="nowrap" flex={5}>
          <ActionIcon
            radius={"50%"}
            size={48}
            variant="light"
            style={{
              border: `1px solid ${
                !readAt ? "#97AD05" : "var(--prune-text-gray-300)"
              }`,
            }}
            color={!readAt ? "#97AD05" : "var(--prune-text-gray-300)"}
          >
            <IconBell
              color={readAt ? "var(--prune-text-gray-500)" : "#97AD05"}
              stroke={1}
            />
          </ActionIcon>

          <Stack gap={5}>
            <Text fw={600} fz={14} c="var(--prune-text-gray-800)" tt="none">
              {title}
            </Text>
            <Text
              fw={400}
              fz={12}
              c="var(--prune-text-gray-500)"
              lineClamp={1}
              tt="none"
            >
              {description}
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
              color={!readAt ? "var(--prune-primary-600)" : "#fff"}
            />
          </ActionIcon>

          <Text fw={400} fz={12} c="var(--prune-text-gray-500)">
            {dayjs(createdAt).format("Do MMMM,  YYYY")}
          </Text>
        </Stack>
      </Group>

      {!lastRow && <Divider color="var(--prune-text-gray-100)" />}
    </>
  );
};