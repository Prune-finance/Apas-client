import {
  Badge,
  Box,
  Divider,
  Drawer,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconEdit, IconUserCheck, IconUserX } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { useAdminAccess } from "@/lib/hooks/privileges";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  AdminRole,
  countPrivileges,
  formatCategory,
  groupPermissionsByCategory,
  isRoleActive,
} from "@/lib/hooks/adminRoles";

dayjs.extend(advancedFormat);

interface Props {
  role: AdminRole | null;
  opened: boolean;
  close: () => void;
  onToggleStatus: (role: AdminRole) => void;
}

export default function RoleDrawer({
  role,
  opened,
  close,
  onToggleStatus,
}: Props) {
  const active = role ? isRoleActive(role) : true;
  const { can } = useAdminAccess();
  const canToggle = can("roles.toggle-status");
  const canEdit = active && can("roles.edit");
  const grouped = groupPermissionsByCategory(role?.permissions ?? []);
  const privilegeCount = countPrivileges(role);

  const details = [
    { label: "Role Name", value: role?.title },
    { label: "Description", value: role?.description || "—" },
    {
      label: "Date Created",
      value: role ? dayjs(role.createdAt).format("Do MMMM, YYYY") : "",
    },
    {
      label: "Last Updated",
      value: role ? dayjs(role.updatedAt).format("Do MMMM, YYYY") : "",
    },
  ];

  return (
    <Drawer
      opened={opened}
      onClose={close}
      title={
        <Text fz={20} fw={600} pl={28}>
          Role Details
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 20 }}
      padding={0}
      position="right"
      size={550}
    >
      <Divider mb={24} color="#F2F4F7" />

      {role && (
        <Box px={28} pb={24}>
          <Stack gap={20}>
            {details.map((d) => (
              <Group justify="space-between" key={d.label} wrap="nowrap">
                <Text fz={12} c="#667085">
                  {d.label}:
                </Text>
                <Text fz={12} fw={600} c="#344054" ta="right" tt="capitalize">
                  {d.value}
                </Text>
              </Group>
            ))}

            <Group justify="space-between">
              <Text fz={12} c="#667085">
                Status:
              </Text>
              <BadgeComponent
                active
                status={active ? "ACTIVE" : "DEACTIVATED"}
                w="auto"
              />
            </Group>

            {role.isApplicationRole && (
              <Group justify="space-between">
                <Text fz={12} c="#667085">
                  Type:
                </Text>
                <Badge variant="light" color="gray" tt="none" fw={500}>
                  System role
                </Badge>
              </Group>
            )}
          </Stack>

          <Divider my={24} color="#F2F4F7" />

          <Text fz={16} fw={500} c="var(--prune-text-gray-800)">
            Permissions
          </Text>
          <Text fz={10} c="#98A2B3">
            {/* role responses list only the privileges switched on */}
            This role has {privilegeCount} privilege
            {privilegeCount === 1 ? "" : "s"} across {role.permissions.length}{" "}
            permission{role.permissions.length === 1 ? "" : "s"}.
          </Text>

          {!role.permissions.length && (
            <Text fz={12} c="#667085" mt={20}>
              No permissions assigned to this role.
            </Text>
          )}

          <Stack gap={24} mt={20}>
            {Object.entries(grouped).map(([category, perms]) => (
              <Box key={category}>
                <Text fz={10} fw={600} c="#667085" tt="uppercase" mb={10}>
                  {formatCategory(category)}
                </Text>

                <Stack gap={10}>
                  {perms.map((p) => (
                    <Box
                      key={p.id}
                      p={12}
                      style={{ border: "1px solid #EAECF0", borderRadius: 4 }}
                    >
                      <Text fz={12} fw={600} c="#344054">
                        {p.title}
                      </Text>
                      {p.description && (
                        <Text fz={11} c="#98A2B3">
                          {p.description}
                        </Text>
                      )}
                      {!!p.privileges?.length && (
                        <Flex gap={6} wrap="wrap" mt={8}>
                          {p.privileges.map((pr) => (
                            <Badge
                              key={pr.id}
                              variant="light"
                              color="var(--prune-primary-700)"
                              tt="none"
                              fw={500}
                              size="sm"
                            >
                              {pr.title}
                            </Badge>
                          ))}
                        </Flex>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {role && (canToggle || canEdit) && (
        <Flex
          pos="sticky"
          bottom={0}
          p={20}
          px={28}
          gap={12}
          justify="flex-end"
          bg="#fff"
          style={{ borderTop: "1px solid #F2F4F7" }}
        >
          {canToggle && (
            <SecondaryBtn
              text={active ? "Deactivate" : "Activate"}
              icon={active ? IconUserX : IconUserCheck}
              action={() => onToggleStatus(role)}
            />
          )}
          {canEdit && (
            <PrimaryBtn
              text="Edit Role"
              icon={IconEdit}
              link={`/admin/roles/${role.id}/edit`}
            />
          )}
        </Flex>
      )}
    </Drawer>
  );
}
