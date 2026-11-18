"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Modal,
  MultiSelect,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { AdminData } from "@/lib/hooks/admins";
import { modalTitleStyle } from "../modalTitle";
import {
  adminRolesApi,
  isRoleActive,
  refreshAdminMe,
  useAdminAccessById,
  useAdminRoles,
} from "@/lib/hooks/adminRoles";

interface Props {
  admin: AdminData | null;
  opened: boolean;
  close: () => void;
  onAssigned?: () => void;
}

export default function AssignRoleModal({
  admin,
  opened,
  close,
  onAssigned,
}: Props) {
  const { roles, loading: loadingRoles } = useAdminRoles();
  const { access, loading: loadingAccess } = useAdminAccessById(
    opened ? admin?.id : undefined
  );
  const { handleSuccess, handleError } = useNotification();
  const [value, setValue] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  // start from the admin's current roles (GET /admin/roles/admins/:adminId)
  useEffect(() => {
    if (opened && access) setValue(access.roles.map((r) => r.id));
  }, [opened, access]);

  // only active ADMIN roles can be given
  const activeRoles = useMemo(
    () => (roles ?? []).filter(isRoleActive),
    [roles]
  );
  const options = activeRoles.map((r) => ({ value: r.id, label: r.title }));
  const selectedRoles = activeRoles.filter((r) => value.includes(r.id));

  const loading = loadingRoles || (opened && loadingAccess);

  const handleSubmit = async () => {
    if (!admin) return;

    setProcessing(true);
    try {
      // `roles` replaces the admin's whole list; [] removes them all
      await adminRolesApi.assignToAdmin(admin.id, value);
      handleSuccess(
        value.length ? "Roles updated" : "Roles removed",
        value.length
          ? `${admin.firstName} ${admin.lastName} now has ${value.length} role${
              value.length > 1 ? "s" : ""
            }`
          : `All roles removed from ${admin.firstName} ${admin.lastName}`
      );
      onAssigned?.();
      // the signed-in admin may have changed their own access
      refreshAdminMe();
      close();
    } catch (err) {
      handleError("An error occurred", parseError(err));
      refreshAdminMe();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      closeButtonProps={{
        icon: (
          <ActionIcon
            variant="light"
            color="var(--prune-text-gray-400)"
            radius="xl"
          >
            <IconX color="var(--prune-text-gray-600)" size={20} />
          </ActionIcon>
        ),
      }}
      size={480}
      padding={28}
      title={
        <Box>
          <Text {...modalTitleStyle}>Assign Roles</Text>
          <Text fz={12} c="#98A2B3">
            {admin
              ? `Set the roles for ${admin.firstName} ${admin.lastName} (${admin.email}).`
              : ""}
          </Text>
        </Box>
      }
    >
      {loading ? (
        <Skeleton height={42} mt={8} />
      ) : (
        <MultiSelect
          mt={8}
          label="Roles"
          placeholder="Select roles"
          data={options}
          value={value}
          onChange={setValue}
          searchable
          clearable
          nothingFoundMessage="No role found"
          size="md"
          comboboxProps={{ withinPortal: true }}
        />
      )}

      {!loading && !value.length && (
        <Text fz={12} c="#B54708" mt={10}>
          Saving with no roles removes all of this admin&apos;s access from
          roles.
        </Text>
      )}

      {!!selectedRoles.length && (
        <Stack gap={10} mt={20}>
          {selectedRoles.map((r) => (
            <Box
              key={r.id}
              p={12}
              style={{ border: "1px solid #EAECF0", borderRadius: 4 }}
            >
              <Text fz={12} fw={600} c="#344054" tt="capitalize">
                {r.title}
              </Text>
              {!!r.permissions.length && (
                <Flex gap={6} wrap="wrap" mt={6}>
                  {r.permissions.map((p) => (
                    <Badge
                      key={p.id}
                      variant="light"
                      color="gray"
                      tt="none"
                      fw={500}
                      size="sm"
                    >
                      {p.title}
                    </Badge>
                  ))}
                </Flex>
              )}
            </Box>
          ))}
        </Stack>
      )}

      <Flex mt={30} justify="flex-end" gap={12}>
        <SecondaryBtn text="Cancel" action={close} />
        <PrimaryBtn
          text="Save Roles"
          action={handleSubmit}
          loading={processing}
          disabled={loading}
        />
      </Flex>
    </Modal>
  );
}
