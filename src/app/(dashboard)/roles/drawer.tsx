import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { AdminData } from "@/lib/hooks/admins";
import User from "@/lib/store/user";
import { activeBadgeColor } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
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

type RolesDrawerProps = {
  user: null;
  opened: boolean;
  close: () => void;
};
export default function RolesDrawer({ user, opened, close }: RolesDrawerProps) {
  const details = [
    { label: "Role Name:", placeholder: "Owner" },

    {
      label: "Date Created:",
      placeholder: dayjs(22 - 22 - 2024).format("Do, MMMM YYYY"),
    },
  ];

  const permissions = [
    { label: "Can view all accounts", value: true },
    { label: "Can download statement", value: true },
    { label: "Add permission here if more is needed.", value: true },
    { label: "Add permission here if more is needed.", value: true },
  ];
  return (
    <Drawer
      opened={opened}
      onClose={close}
      title={
        <Text fz={20} fw={600} pl={28}>
          Details
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 20 }}
      padding={0}
      position="right"
      size={550}
    >
      <Box>
        <Divider mb={24} color="#F2F4F7" />

        <Box px={28}>
          <Stack gap={28} mb={10}>
            {details.map((detail, index) => (
              <Group justify="space-between" key={index}>
                <Text fz={12} fw={400} c="#667085">
                  {detail.label}:
                </Text>

                <Text fz={12} fw={600} c="#344054">
                  {detail.placeholder}
                </Text>
              </Group>
            ))}
          </Stack>

          <Divider my={24} color="#F2F4F7" />

          <Text fz={16} fw={500} c="var(--prune-text-gray-800)">
            Permissions
          </Text>

          <Text fz={10} fw={400} c="#98A2B3">
            This role has the following permissions:
          </Text>

          <Stack gap={20} mt={24}>
            {permissions.map((permission, index) => (
              <Box key={index}>
                <Group key={index} justify="space-between">
                  <Text fz={12} fw={400} c="#344054">
                    {permission.label}:
                  </Text>

                  <Checkbox
                    readOnly
                    radius="xl"
                    checked={permission.value}
                    color="var(--prune-primary-700)"
                  />
                </Group>
                <Divider my={14} color="#F2F4F7" />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
