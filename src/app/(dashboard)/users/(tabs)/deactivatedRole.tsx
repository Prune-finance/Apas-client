import { Role, useUserRoles } from "@/lib/hooks/roles";
import { calculateTotalPages } from "@/lib/utils";
import EmptyTable from "@/ui/components/EmptyTable";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Group, TableTd, TableTr, Box } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import dayjs from "dayjs";

import React, { Dispatch, SetStateAction, useState } from "react";

import DeactivatedRoleDrawer from "../(drawers)/deactivatedRole";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";

interface Props {
  tabValue: string;
}
export default function DeactivatedRoles() {
  const [search, setSearch] = useState("");
  const [debouncedValue] = useDebouncedValue(search, 1000);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [openedRole, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const queryParams = {
    limit: parseInt(limit ?? "10", 10),
    page: active,
    search: debouncedValue,
    status: "deactivate",
  };

  const { loading, roles, revalidate, meta } = useUserRoles(queryParams);
  usePaginationReset({ queryParams, setActive });

  return (
    <Box>
      <Group justify="space-between" mt={28}>
        <SearchInput search={search} setSearch={setSearch} />
      </Group>

      <Box mih="60vh">
        <TableComponent
          head={tableHeaderDeactivated}
          rows={
            <RowComponent
              roles={roles}
              open={openDrawer}
              setSelectedRole={setSelectedRole}
            />
          }
          loading={loading}
          layout="auto"
        />

        <EmptyTable
          rows={roles ?? []}
          loading={loading}
          title="There is no deactivated role"
          text="When a role is deactivated, they will appear here."
        />
      </Box>

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={calculateTotalPages(limit, meta?.total ?? 0)}
      />

      <DeactivatedRoleDrawer
        opened={openedRole}
        close={closeDrawer}
        role={selectedRole}
      />
    </Box>
  );
}

const tableHeaderDeactivated = [
  "Role Name",
  "Date Created",
  "Date Deleted",
  // "Action",
];

const RowComponent = ({
  roles,
  open,
  setSelectedRole,
}: {
  roles: Role[] | null;
  open: () => void;
  setSelectedRole: Dispatch<SetStateAction<Role | null>>;
}) => {
  const handleRowClick = (role: Role) => {
    setSelectedRole(role);
    open();
  };
  return roles?.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element)}
      style={{ cursor: "pointer" }}
    >
      <TableTd tt="capitalize">{element?.title}</TableTd>
      <TableTd>{dayjs(element?.createdAt).format("ddd DD MMM YYYY")}</TableTd>
      <TableTd>{dayjs(element?.deletedAt).format("ddd DD MMM YYYY")}</TableTd>

      {/**
      <TableTd onClick={(e) => e.stopPropagation()}>
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>
          <MenuDropdown>
            <MenuItem
              leftSection={<IconBriefcase size={14} />}
              //   onClick={open}
            >
              <Text fz={12}>Reactivate Role</Text>
            </MenuItem>
            <MenuItem
              leftSection={<IconTrash size={14} />}
              // onClick={openInvite}
            >
              <Text fz={12}>Delete Role</Text>
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </TableTd>
      */}
    </TableTr>
  ));
};
