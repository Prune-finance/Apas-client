"use client";
import Cookies from "js-cookie";

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
  filterSchema,
  FilterType,
  filterValues,
  newAdmin,
  validateNewAdmin,
} from "@/lib/schema";
import axios from "axios";
import { Suspense, useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";

import Filter from "@/ui/components/Filter";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import MainModalComponent from "./modal";
import UserDrawer from "./drawer";
import PaginationComponent from "@/ui/components/Pagination";
import { SearchInput } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { BadgeComponent } from "@/ui/components/Badge";
import ModalComponent from "@/ui/components/Modal";

function Users() {
  const searchParams = useSearchParams();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { status, createdAt, sort } = Object.fromEntries(
    searchParams.entries()
  );

  const router = useRouter();
  const { loading, users, revalidate, meta } = useUsers({
    ...(!limit || isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit, 10) }),
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    page: active,
  });
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
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const addAdmin = async () => {
    setProcessing(true);

    try {
      const { hasErrors, errors } = form.validate();
      if (hasErrors) {
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/users/add`,
        { email: form.values.email },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

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

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/users/${id}/${path}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

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

  const menuItems = [
    {
      text: "Update Details",
      icon: <IconUserEdit style={{ width: rem(14), height: rem(14) }} />,
    },
    // {
    //   text: "Deactivate",
    //   icon: <IconUserX style={{ width: rem(14), height: rem(14) }} />,
    // },
  ];

  const handleRowClick = (user: AdminData) => {
    setUser(user);
    openDrawer();
  };

  const handleStatusChange = (user: AdminData, status: string) => {
    setUser(user);
    if (status === "ACTIVE") return deactivateOpen();
    return activateOpen();
  };

  const rows = filteredSearch(users, ["email"], debouncedSearch).map(
    (element, index) => (
      <TableTr
        key={index}
        onClick={() => handleRowClick(element)}
        style={{ cursor: "pointer" }}
      >
        <TableTd className={styles.table__td}>{element.email}</TableTd>
        <TableTd className={`${styles.table__td}`}>
          {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
        </TableTd>
        <TableTd className={`${styles.table__td}`}>
          {dayjs(element.updatedAt).fromNow()}
          {/* {dayjs(element.updatedAt).format("ddd DD MMM YYYY")} */}
        </TableTd>

        <TableTd>
          <BadgeComponent status={element.status} active />
        </TableTd>

        <TableTd
          className={`${styles.table__td}`}
          onClick={(e) => e.stopPropagation()}
        >
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
                    text: "Update Details",
                    icon: (
                      <IconUserEdit
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    ),
                  },
                  {
                    text:
                      element.status === "INACTIVE" ? "Activate" : "Deactivate",
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
                ];

                return menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    fz={10}
                    c="#667085"
                    leftSection={item.icon}
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
            <SecondaryBtn text="Filter" icon={IconListTree} action={toggle} />

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
        />

        <TableComponent head={tableHeaders} rows={rows} loading={loading} />

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
  // "Role",
  "Date Created",
  "Last Active",
  "Status",
  "Action",
];
