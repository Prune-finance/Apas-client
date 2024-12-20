"use client";
import {
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  TableTd,
  TableTr,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconCheck,
  IconDotsVertical,
  IconListTree,
  IconPlus,
  IconSearch,
  IconUserCheck,
  IconUserEdit,
  IconUserX,
  IconX,
} from "@tabler/icons-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./styles.module.scss";

import { AdminData, useUsers } from "@/lib/hooks/admins";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import { useForm, zodResolver } from "@mantine/form";
import {
  FilterSchema,
  FilterType,
  FilterValues,
  newAdmin,
  validateNewAdmin,
} from "@/lib/schema";
import { Suspense, useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

import Filter from "@/ui/components/Filter";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import MainModalComponent from "./modal";
import UserDrawer from "./drawer";
import PaginationComponent from "@/ui/components/Pagination";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { BadgeComponent } from "@/ui/components/Badge";
import ModalComponent from "@/ui/components/Modal";

import createAxiosInstance from "@/lib/axios";

const axios = createAxiosInstance("auth");

function Users() {
  const searchParams = useSearchParams();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { status, date, endDate, email } = Object.fromEntries(
    searchParams.entries()
  );

  const router = useRouter();

  const queryParams = {
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && {
      status:
        status.toLowerCase() === "pending"
          ? "INVITE_PENDING"
          : status.toUpperCase(),
    }),
    ...(email && { email }),
    page: active,
    limit: parseInt(limit ?? "10", 10),
  };
  const { loading, users, revalidate, meta } = useUsers(queryParams);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { handleError, handleSuccess } = useNotification();

  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState<AdminData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [activateOpened, { open: activateOpen, close: activateClose }] =
    useDisclosure(false);
  const [deactivateOpened, { open: deactivateOpen, close: deactivateClose }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: newAdmin,
    validate: zodResolver(validateNewAdmin),
  });

  const filterForm = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const addAdmin = async () => {
    setProcessing(true);

    try {
      const { hasErrors, errors } = form.validate();
      if (hasErrors) {
        return;
      }
      const method = isEdit ? "patch" : "post";
      await axios[method](`/auth/users/add`, { email: form.values.email });

      revalidate();
      close();
      form.reset();
      handleSuccess("Successful! User Invite", "User invite sent successfully");
      router.push("/users");
    } catch (error) {
      handleError("Failed! User Invite", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (data: typeof newAdmin) => {
    form.setValues(data);
    open();
    setIsEdit(true);
  };

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

  const rows = filteredSearch(users, ["email", "role"], debouncedSearch).map(
    (element, index) => (
      <TableTr
        key={index}
        onClick={() => handleRowClick(element)}
        style={{ cursor: "pointer" }}
      >
        <TableTd tt="lowercase" style={{ wordBreak: "break-word" }} w="20%">
          {element.email}
        </TableTd>
        <TableTd tt="capitalize">{element.role.toLowerCase()}</TableTd>
        <TableTd>{dayjs(element.createdAt).format("ddd DD MMM YYYY")}</TableTd>
        <TableTd>
          {element.lastLogin ? dayjs(element.lastLogin).fromNow() : "Nil"}
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
          <Menu shadow="md" width={150}>
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
                        <IconUserX
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      ),
                  },
                  // ...(element.status === "INVITE_PENDING"
                  //   ? [
                  //       {
                  //         text: "Update Details",
                  //         icon: (
                  //           <IconUserEdit
                  //             style={{ width: rem(14), height: rem(14) }}
                  //           />
                  //         ),
                  //       },
                  //     ]
                  //   : []),
                  // ...(element.status !== "INVITE_PENDING"
                  //   ? [
                  //       {
                  //         text:
                  //           element.status === "INACTIVE"
                  //             ? "Activate"
                  //             : "Deactivate",
                  //         icon:
                  //           element.status === "INACTIVE" ? (
                  //             <IconUserCheck
                  //               style={{ width: rem(14), height: rem(14) }}
                  //             />
                  //           ) : (
                  //             <IconUserX
                  //               style={{ width: rem(14), height: rem(14) }}
                  //             />
                  //           ),
                  //       },
                  //     ]
                  //   : []),
                ];

                return menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    fz={10}
                    c="#667085"
                    leftSection={item.icon}
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.text === "Update Details")
                        return handleEdit({
                          email: element.email,
                          firstName: element.firstName,
                          lastName: element.lastName,
                          role: element.role,
                          password: "",
                        });

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
    )
  );

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs items={[{ title: "Users", href: "/admin/users" }]} /> */}

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Users
          </Text>
        </div>

        <Group justify="space-between" mt={28}>
          <SearchInput search={search} setSearch={setSearch} />

          <Group gap={12}>
            <SecondaryBtn
              text="Filter"
              icon={IconListTree}
              action={toggle}
              fw={600}
            />

            <PrimaryBtn
              text="Invite New User"
              action={() => {
                setIsEdit(false);
                open();
              }}
              icon={IconPlus}
            />
          </Group>
        </Group>

        <Filter<FilterType>
          opened={openedFilter}
          toggle={toggle}
          form={filterForm}
          customStatusOption={["Active", "Inactive", "Pending"]}
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
      </div>

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
      />

      <MainModalComponent
        action={addAdmin}
        processing={processing}
        opened={opened}
        close={close}
        form={form}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />

      <UserDrawer opened={openedDrawer} close={closeDrawer} user={user} />

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
    </main>
  );
}

export default function UsersSuspense() {
  return (
    <Suspense>
      <Users />
    </Suspense>
  );
}

const tableHeaders = [
  "Email",
  // "Name",
  "Role",
  "Date Created",
  "Last Active",
  "Status",
  "Action",
];
