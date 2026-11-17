import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTd,
  TableTr,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPlus,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { AdminRole } from "@/lib/hooks/adminRoles";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";

interface Props {
  roles: AdminRole[];
  loading: boolean;
  variant: "active" | "deactivated";
  // only a Super Admin can create, edit, activate or deactivate roles
  canManage: boolean;
  onView: (role: AdminRole) => void;
  onToggleStatus: (role: AdminRole) => void;
}

export default function RolesTable({
  roles,
  loading,
  variant,
  canManage,
  onView,
  onToggleStatus,
}: Props) {
  const [search, setSearch] = useState("");
  const { push } = useRouter();
  const isActiveTab = variant === "active";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [roles, search]);

  const rows = filtered.map((role) => (
    <TableTr
      key={role.id}
      onClick={() => onView(role)}
      style={{ cursor: "pointer" }}
    >
      <TableTd>
        <Group gap={8} wrap="nowrap">
          <Text fz={12} fw={500} tt="capitalize">
            {role.title}
          </Text>
          {role.isApplicationRole && (
            <Badge variant="light" color="gray" size="xs" tt="none">
              System
            </Badge>
          )}
        </Group>
      </TableTd>
      <TableTd>
        <Text fz={12} c="#667085" lineClamp={1}>
          {role.description || "—"}
        </Text>
      </TableTd>
      <TableTd>{role.permissions?.length ?? 0}</TableTd>
      <TableTd>{dayjs(role.createdAt).format("ddd DD MMM YYYY")}</TableTd>
      <TableTd onClick={(e) => e.stopPropagation()}>
        <Menu shadow="md" width={160} position="bottom-end">
          <MenuTarget>
            <UnstyledButton aria-label="Role actions">
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>
          <MenuDropdown>
            <MenuItem
              leftSection={<IconEye size={14} />}
              onClick={() => onView(role)}
            >
              <Text fz={12}>View Details</Text>
            </MenuItem>
            {canManage && isActiveTab && (
              <MenuItem
                leftSection={<IconEdit size={14} />}
                onClick={() => push(`/admin/roles/${role.id}/edit`)}
              >
                <Text fz={12}>Edit Role</Text>
              </MenuItem>
            )}
            {canManage && (
              <MenuItem
                leftSection={
                  isActiveTab ? (
                    <IconUserX size={14} />
                  ) : (
                    <IconUserCheck size={14} />
                  )
                }
                onClick={() => onToggleStatus(role)}
              >
                <Text fz={12}>{isActiveTab ? "Deactivate" : "Activate"}</Text>
              </MenuItem>
            )}
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));

  return (
    <Box>
      <Group justify="space-between" mt={28}>
        <SearchInput search={search} setSearch={setSearch} />

        {canManage && isActiveTab && (
          <PrimaryBtn text="New Role" link="/admin/roles/new" icon={IconPlus} />
        )}
      </Group>

      <Box mih="60vh">
        <TableComponent
          head={tableHeaders}
          rows={rows}
          loading={loading}
          layout="auto"
          mt={24}
        />

        <EmptyTable
          rows={filtered}
          loading={loading}
          title={
            search
              ? "No role matches your search"
              : isActiveTab
              ? "There is no role"
              : "There is no deactivated role"
          }
          text={
            isActiveTab
              ? "When a role is created, it will appear here."
              : "When a role is deactivated, it will appear here."
          }
        />
      </Box>
    </Box>
  );
}

const tableHeaders = [
  "Role Name",
  "Description",
  "Permissions",
  "Date Created",
  "Action",
];
