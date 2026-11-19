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
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconListTree,
  IconPlus,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import {
  AdminRole,
  countPrivileges,
  isRoleActive,
} from "@/lib/hooks/adminRoles";
import { useAdminAccess } from "@/lib/hooks/privileges";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";
import { TableComponent } from "@/ui/components/Table";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";

type RoleFilters = { status: string | null };
const emptyFilters: RoleFilters = { status: null };

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "DEACTIVATED", label: "Deactivated" },
];

interface Props {
  roles: AdminRole[];
  loading: boolean;
  onView: (role: AdminRole) => void;
  onToggleStatus: (role: AdminRole) => void;
}

export default function RolesTable({
  roles,
  loading,
  onView,
  onToggleStatus,
}: Props) {
  const { push } = useRouter();
  const { can } = useAdminAccess();
  const [search, setSearch] = useState("");
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);
  const [applied, setApplied] = useState<RoleFilters>(emptyFilters);
  const filterForm = useForm<RoleFilters>({ initialValues: emptyFilters });

  const activeFilterCount = Object.values(applied).filter(Boolean).length;

  // GET /admin/roles returns active and deactivated roles together,
  // so search and status are applied here
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const status = applied.status?.toUpperCase();

    return roles.filter((r) => {
      if (status === "ACTIVE" && !isRoleActive(r)) return false;
      if (status === "DEACTIVATED" && isRoleActive(r)) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        !!r.description?.toLowerCase().includes(q)
      );
    });
  }, [roles, search, applied]);

  const rows = filtered.map((role) => {
    const active = isRoleActive(role);

    return (
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
        <TableTd>
          {countPrivileges(role)}
          <Text span fz={11} c="#98A2B3">
            {" "}
            in {role.permissions?.length ?? 0} permission
            {role.permissions?.length === 1 ? "" : "s"}
          </Text>
        </TableTd>
        <TableTd>{dayjs(role.createdAt).format("ddd DD MMM YYYY")}</TableTd>
        <TableTd>
          <BadgeComponent
            active
            status={active ? "ACTIVE" : "DEACTIVATED"}
            w="auto"
          />
        </TableTd>
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
              {can("roles.edit") && active && (
                <MenuItem
                  leftSection={<IconEdit size={14} />}
                  onClick={() => push(`/admin/roles/${role.id}/edit`)}
                >
                  <Text fz={12}>Edit Role</Text>
                </MenuItem>
              )}
              {can("roles.toggle-status") && (
                <MenuItem
                  leftSection={
                    active ? (
                      <IconUserX size={14} />
                    ) : (
                      <IconUserCheck size={14} />
                    )
                  }
                  onClick={() => onToggleStatus(role)}
                >
                  <Text fz={12}>{active ? "Deactivate" : "Activate"}</Text>
                </MenuItem>
              )}
            </MenuDropdown>
          </Menu>
        </TableTd>
      </TableTr>
    );
  });

  return (
    <Box>
      <Group justify="space-between" mt={28}>
        <SearchInput search={search} setSearch={setSearch} />

        <Group gap={12}>
          <SecondaryBtn
            text="Filter"
            action={toggleFilters}
            icon={IconListTree}
            indicator={activeFilterCount}
          />
          {can("roles.create") && (
            <PrimaryBtn
              text="New Role"
              link="/admin/roles/new"
              icon={IconPlus}
            />
          )}
        </Group>
      </Group>

      <Filter<RoleFilters>
        opened={filtersOpened}
        toggle={toggleFilters}
        form={filterForm}
        noDate
        customStatusOption={statusOptions}
        onApply={(values) => setApplied(values)}
        onClear={() => setApplied(emptyFilters)}
      />

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
            search || activeFilterCount
              ? "No role matches your search or filter"
              : "There is no role"
          }
          text={
            search || activeFilterCount
              ? "Try another search or filter."
              : "When a role is created, it will appear here."
          }
        />
      </Box>
    </Box>
  );
}

const tableHeaders = [
  "Role Name",
  "Description",
  "Privileges",
  "Date Created",
  "Status",
  "Action",
];
