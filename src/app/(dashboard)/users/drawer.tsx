import { AdminData } from "@/lib/hooks/admins";
import User from "@/lib/store/user";
import { activeBadgeColor } from "@/lib/utils";
import {
  Badge,
  Box,
  Checkbox,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

type UserDrawerProps = {
  user: AdminData | null;
  opened: boolean;
  close: () => void;
};
export default function UserDrawer({ user, opened, close }: UserDrawerProps) {
  const details = [
    { label: "Email", placeholder: user?.email },
    { label: "Name", placeholder: `${user?.firstName} ${user?.lastName}` },
    { label: "Role", placeholder: user?.role },
    {
      label: "Date Added",
      placeholder: dayjs(user?.createdAt).format("Do, MMMM YYYY"),
    },
    {
      label: "Last Active",
      placeholder: dayjs(user?.updatedAt).format("Do, MMMM YYYY"),
    },
    { label: "Status", placeholder: "ACTIVE" },
  ];

  const permissions = [
    { label: "Can view all accounts", value: true },
    { label: "Can edit all accounts", value: true },
    { label: "Can delete all accounts", value: true },
    { label: "Can create new accounts", value: true },
  ];
  return (
    <Drawer
      opened={opened}
      onClose={close}
      title={
        <Text fz={20} fw={500} pl={28}>
          User Details
        </Text>
      }
      closeButtonProps={{ mr: 20 }}
      padding={0}
      position="right"
    >
      <Box>
        <Divider mb={24} />

        <Box px={28}>
          <Stack gap={28}>
            {details.map((detail, index) => (
              <Group justify="space-between" key={index}>
                <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
                  {detail.label}:
                </Text>
                {detail.label !== "Status" ? (
                  <Text fz={14} fw={500} c="var(--prune-text-gray-800)">
                    {detail.placeholder}
                  </Text>
                ) : (
                  <Badge
                    tt="capitalize"
                    variant="light"
                    color={activeBadgeColor(detail.placeholder || "")}
                    w={82}
                    h={24}
                    fw={400}
                    fz={12}
                  >
                    {(detail.placeholder || "").toLowerCase()}
                  </Badge>
                )}
              </Group>
            ))}
          </Stack>

          <Divider my={24} />

          <Text fz={16} fw={500} c="var(--prune-text-gray-800)" mb={24}>
            Permissions
          </Text>

          <Stack gap={20}>
            {permissions.map((permission, index) => (
              <>
                <Group key={index} justify="space-between">
                  <Text fz={14} fw={400} c="var(--prune-text-gray-400)">
                    {permission.label}:
                  </Text>

                  <Checkbox
                    readOnly
                    radius="xl"
                    checked={permission.value}
                    color="var(--prune-primary-700)"
                  />
                </Group>
                <Divider />
              </>
            ))}
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
