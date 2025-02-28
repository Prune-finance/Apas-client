import { Role, transformPermissionsToCategory } from "@/lib/hooks/roles";
import { PrimaryBtn } from "@/ui/components/Buttons";
import DrawerProvider from "@/ui/components/Drawer/DrawerProvider";
import { Divider, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { PermissionAccordion } from "./PermissionAccordion";
import { useRouter } from "next/navigation";

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

interface Props {
  opened: boolean;
  close: () => void;
  role: Role | null;
}
export default function RoleDrawer({ opened, close, role }: Props) {
  const { push } = useRouter();
  const info = {
    "Role Name": role?.title,
    "Date Created": dayjs(role?.createdAt).format("Do MMMM, YYYY"),
  };

  return (
    <DrawerProvider
      opened={opened}
      onClose={close}
      title="Details"
      position="right"
    >
      <Stack gap={20}>
        {Object.entries(info).map(([title, value], index) => (
          <Group key={index} gap="md" justify="space-between">
            <Text c="var(--prune-text-gray-500)" fz={12} fw={400}>
              {title}:
            </Text>
            <Text c="var(--prune-text-gray-700)" fz={12} fw={500}>
              {value}
            </Text>
          </Group>
        ))}
      </Stack>

      <Divider color="var(--prune-text-gray-100)" mb={36} mt={24} />

      <Text
        c="prune-var(--prune-text-gray-800)"
        fz={14}
        fw={500}
        tt="uppercase"
      >
        Permissions
      </Text>
      <Text c="prune-var(--prune-text-gray-400)" fz={10} fw={400}>
        This role has the following permissions:
      </Text>

      <PermissionAccordion
        permissions={transformPermissionsToCategory(role?.permissions || [])}
      />

      <Group my={40} justify="flex-end" gap={15}>
        <PrimaryBtn
          text="Edit Permission"
          fw={600}
          action={() => push(`/users/${role?.id}/edit`)}
        />
      </Group>
    </DrawerProvider>
  );
}
