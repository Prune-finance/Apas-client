import {
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTd,
  TableTr,
  UnstyledButton,
  rem,
  Box,
} from "@mantine/core";
import {
  IconCheck,
  IconDotsVertical,
  IconListTree,
  IconUserCheck,
  IconUserX,
  IconX,
} from "@tabler/icons-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import { useSearchParams } from "next/navigation";

import { AdminData, useUsers } from "@/lib/hooks/admins";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import { useForm, zodResolver } from "@mantine/form";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

import Filter from "@/ui/components/Filter";
import { TableComponent } from "@/ui/components/Table";
import UserDrawer from "../drawer";
import PaginationComponent from "@/ui/components/Pagination";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { BadgeComponent } from "@/ui/components/Badge";
import ModalComponent from "@/ui/components/Modal";

import createAxiosInstance from "@/lib/axios";

const axios = createAxiosInstance("auth");
import React from "react";
import { calculateTotalPages } from "@/lib/utils";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";

export default function DeactivatedUsers() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { status, date, endDate, email } = Object.fromEntries(
    searchParams.entries()
  );

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
    email,
    page: active,
    limit: parseInt(limit ?? "10", 10),
    status: "inactive",
    search: debouncedSearch,
  };

  const { loading, users, revalidate, meta } = useUsers(queryParams);
  usePaginationReset({ queryParams, setActive });

  const [opened, { open, close }] = useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { handleError, handleSuccess } = useNotification();

  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState<AdminData | null>(null);
  const [processingStatus, setProcessingStatus] = useState(false);

  const [activateOpened, { open: activateOpen, close: activateClose }] =
    useDisclosure(false);
  const [deactivateOpened, { open: deactivateOpen, close: deactivateClose }] =
    useDisclosure(false);

  const filterForm = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const handleUserDeactivation = async (
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    setProcessingStatus(true);
    try {
      const path = status === "ACTIVE" ? "deactivate" : "activate";

      await axios.post(`/auth/users/${id}/${path}`, {});

      revalidate();
      handleSuccess(
        `Successful! User ${
          status === "ACTIVE" ? "Deactivation" : "Activation"
        }`,
        `User ${status === "ACTIVE" ? "deactivated" : "activated"} successfully`
      );
      if (status === "ACTIVE") return deactivateClose();
      return activateClose();
    } catch (error) {
      handleError(
        `Failed! User ${status === "ACTIVE" ? "Deactivation" : "Activation"}`,
        parseError(error)
      );
    } finally {
      setProcessingStatus(false);
    }
  };

  const handleRowClick = (user: AdminData) => {
    setUser(user);
    openDrawer();
  };

  const handleStatusChange = (user: AdminData, status: string) => {
    setUser(user);
    if (status === "ACTIVE") return deactivateOpen();
    return activateOpen();
  };

  const rows = users.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element)}
      style={{ cursor: "pointer" }}
    >
      <TableTd>
        {!element.firstName || !element.lastName
          ? "N/A"
          : `${element.firstName} ${element.lastName}`}
      </TableTd>
      <TableTd tt="lowercase" style={{ wordBreak: "break-word" }} w="20%">
        {element.email}
      </TableTd>
      <TableTd tt="capitalize">{element.role.toLowerCase()}</TableTd>
      <TableTd>{dayjs(element.createdAt).format("ddd DD MMM YYYY")}</TableTd>
      <TableTd>
        {element.deletedAt
          ? dayjs(element.deletedAt).format("ddd DD MMM YYYY")
          : "Nil"}
      </TableTd>

      <TableTd>
        <BadgeComponent
          status={
            element.status === "INVITE_PENDING" ? "PENDING" : element.status
          }
          active
        />
      </TableTd>

      <TableTd onClick={(e) => e.stopPropagation()}>
        <Menu shadow="md" width={200}>
          <MenuTarget>
            <UnstyledButton>
              <IconDotsVertical size={17} />
            </UnstyledButton>
          </MenuTarget>
          <MenuDropdown>
            {(() => {
              const menuItems = [
                {
                  text:
                    element.status === "INACTIVE" ? "Activate" : "Deactivate",
                  disabled: element.status === "INVITE_PENDING",
                  icon:
                    element.status === "INACTIVE" ? (
                      <IconUserCheck
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    ) : (
                      <IconUserX style={{ width: rem(14), height: rem(14) }} />
                    ),
                },
              ];

              return menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  fz={10}
                  c="#667085"
                  leftSection={item.icon}
                  disabled={item.disabled}
                  onClick={() => {
                    return handleStatusChange(element, element.status);
                  }}
                >
                  {item.text}
                </MenuItem>
              ));
            })()}
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));
  return (
    <Box>
      <Group justify="space-between" mt={28}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn
          text="Filter"
          icon={IconListTree}
          action={toggle}
          fw={600}
        />
      </Group>

      <Filter<FilterType>
        opened={openedFilter}
        toggle={toggle}
        form={filterForm}
        isStatus
      >
        <TextBox placeholder="Email" {...filterForm.getInputProps("email")} />
      </Filter>

      <TableComponent
        head={tableHeaders}
        rows={rows}
        loading={loading}
        layout="auto"
      />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no users"
        text="When a user is added, they will appear here."
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={calculateTotalPages(limit, meta?.total)}
      />

      <UserDrawer
        opened={openedDrawer}
        close={closeDrawer}
        user={user}
        isDeactivated
      />

      <ModalComponent
        processing={processingStatus}
        action={() => handleUserDeactivation(String(user?.id), "ACTIVE")}
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={deactivateOpened}
        close={deactivateClose}
        // form={requestForm}
        title="Deactivate This Account?"
        text="You are about to deactivate this account. This means the account will be inactive."
      />

      <ModalComponent
        processing={processingStatus}
        action={() => handleUserDeactivation(String(user?.id), "INACTIVE")}
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={activateOpened}
        close={activateClose}
        // form={requestForm}
        title="Activate This Account?"
        text="You are about to activate this account. This means the account will become active."
      />
    </Box>
  );
}

const tableHeaders = [
  "Name",
  "Email",
  "Role",
  "Date Created",
  "Date Deactivated",
  "Status",
  "Action",
];
