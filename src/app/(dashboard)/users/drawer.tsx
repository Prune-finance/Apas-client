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
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { HeaderAndSubtitle } from "./HeaderAndSubtitle";
import { PrimaryBtn } from "@/ui/components/Buttons";

dayjs.extend(advancedFormat);

type UserDrawerProps = {
  user: AdminData | null;
  opened: boolean;
  close: () => void;
};
export default function UserDrawer({ user, opened, close }: UserDrawerProps) {
  const details = [
    { label: "Email", placeholder: user?.email },
    {
      label: "Name",
      placeholder:
        user?.firstName || user?.lastName
          ? `${user?.firstName} ${user?.lastName}`
          : "N/A",
    },
    { label: "Role", placeholder: user?.role },
    {
      label: "Date Added",
      placeholder: dayjs(user?.createdAt).format("Do, MMMM YYYY"),
    },
    {
      label: "Last Activity",
      placeholder: dayjs(user?.updatedAt).fromNow(),
    },
    {
      label: "Status",
      placeholder: (
        <BadgeComponent
          status={
            user?.status === "INVITE_PENDING" ? "PENDING" : user?.status || ""
          }
          active
        />
      ),
    },
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
        <Text fz={20} fw={600} pl={28}>
          User Details
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 20 }}
      padding={0}
      position="right"
      size={520}
    >
      <Box>
        <Divider mb={24} />

        <Box px={28}>
          <Stack gap={28}>
            {details.map((detail, index) => (
              <Group justify="space-between" key={index}>
                <Text fz={12} fw={400} c="var(--prune-text-gray-500)">
                  {detail.label}:
                </Text>

                <Text fz={12} fw={600} c="var(--prune-text-gray-800)">
                  {detail.placeholder}
                </Text>
              </Group>
            ))}
          </Stack>

          <Flex justify="space-between" my={24}>
            <HeaderAndSubtitle
              title="USER PERMISSIONS MANAGEMENT"
              subtitle="This user has the following permission and can be
customized uniquely for this specific user"
              customTitleSize={14}
              customSubtitleSize={12}
            />

            <PrimaryBtn text="Edit Permission" fw={600} fz={12} w="50%" />
          </Flex>

          {/* <Text fz={16} fw={500} c="var(--prune-text-gray-800)" mb={24}>
            Permissions
          </Text>

          <Stack gap={20}>
            {permissions.map((permission, index) => (
              <Box key={index}>
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
              </Box>
            ))}
          </Stack> */}
        </Box>
      </Box>
    </Drawer>
  );
}
