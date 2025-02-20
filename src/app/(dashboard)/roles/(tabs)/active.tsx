import { Role, useUserRoles } from "@/lib/hooks/roles";
import { calculateTotalPages } from "@/lib/utils";
import { PrimaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import {
  TabsPanel,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTd,
  TableTr,
  UnstyledButton,
  Text,
  Box,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconUser,
  IconUserX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import router from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import DeactivateRoleModal from "../DeactivateRoleModal";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";

interface Props {
  tabValue: string;
}
export default function ActiveRoles() {
  const [search, setSearch] = useState("");
  const [debouncedValue] = useDebouncedValue(search, 1000);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [id, setId] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const { handleSuccess } = useNotification();

  const { loading, roles, revalidate, meta } = useUserRoles({
    limit: parseInt(limit ?? "10", 10),
    page: active,
    search: debouncedValue,
    status: "activate",
  });

  const { queryFn: handleDeactivation, loading: processingDeactivation } =
    useAxios({
      baseURL: "auth",
      endpoint: `/roles/${id}/deactivate`,
      method: "PATCH",
      onSuccess: () => {
        revalidate();
        close();
        handleSuccess(
          "Role deactivation",
          "Role has been deactivated successfully"
        );
      },
    });

  return (
    <Box>
      <Group justify="space-between" mt={28}>
        <SearchInput search={search} setSearch={setSearch} />

        <Group gap={12}>
          <PrimaryBtn
            text="New Role"
            fw={600}
            link="/roles/new"
            icon={IconPlus}
          />
        </Group>
      </Group>

      <Box mih="60vh">
        <TableComponent
          head={tableHeaders}
          rows={<RowComponent roles={roles} open={open} setId={setId} />}
          loading={loading}
          layout="auto"
        />

        <EmptyTable
          rows={roles ?? []}
          loading={loading}
          title="There is no role"
          text="When a role is created, they will appear here."
        />
      </Box>

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={calculateTotalPages(limit, meta?.total ?? 0)}
      />

      <DeactivateRoleModal
        opened={opened}
        close={close}
        handleDeactivation={handleDeactivation}
        processing={processingDeactivation}
      />
    </Box>
  );
}

const tableHeaders = ["Role Name", "Date Created", "Action"];

const RowComponent = ({
  roles,
  open,
  setId,
}: {
  roles: Role[] | null;
  open: () => void;
  setId: Dispatch<SetStateAction<string>>;
}) => {
  return roles?.map((element, index) => (
    <TableTr
      key={index}
      // onClick={() => handleRowClick()}
      style={{ cursor: "pointer" }}
    >
      <TableTd tt="capitalize">{element?.title}</TableTd>
      <TableTd>{dayjs(element?.createdAt).format("ddd DD MMM YYYY")}</TableTd>

      <TableTd onClick={(e) => e.stopPropagation()}>
        <Menu shadow="md" width={150}>
          <MenuTarget>
            <UnstyledButton>
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>
          <MenuDropdown>
            {/* <MenuItem
              leftSection={<IconEdit size={14} />}
              onClick={() => router.push("/roles/edit")}
            >
              <Text fz={12}>Edit Role</Text>
            </MenuItem> */}
            <MenuItem
              leftSection={<IconUserX size={14} />}
              onClick={() => {
                setId(element.id);
                open();
              }}
            >
              <Text fz={12}>Deactivate</Text>
            </MenuItem>
            {/* <MenuItem
              leftSection={<IconUser size={14} />}
              // onClick={openInvite}
            >
              <Text fz={12}>Assign User</Text>
            </MenuItem> */}
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));
};
