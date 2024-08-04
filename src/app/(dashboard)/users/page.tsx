"use client";

import {
  Badge,
  Button,
  Checkbox,
  Flex,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Pagination,
  Select,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  TextInput,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconDots,
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconListTree,
  IconPlus,
  IconPointFilled,
  IconSearch,
  IconTrash,
  IconUserEdit,
  IconUserX,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";

import EmptyImage from "@/assets/empty.png";
import { AllBusinessSkeleton } from "@/lib/static";
import { AdminData, useAdmins, useUsers } from "@/lib/hooks/admins";
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
import { activeBadgeColor } from "@/lib/utils";
import ModalComponent from "./modal";
import UserDrawer from "./drawer";
import User from "@/lib/store/user";
import PaginationComponent from "@/ui/components/Pagination";

function Users() {
  const searchParams = useSearchParams();
  const { push } = useRouter();

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
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    page: active,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { handleError } = useNotification();

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState<AdminData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  // const {} = Tr

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
        { withCredentials: true }
      );

      revalidate();
      close();
      router.push("/users");
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (data: typeof newAdmin) => {
    form.setValues(data);
    open();
    setIsEdit(true);
  };

  const menuItems = [
    // {
    //   text: "View",
    //   icon: <IconEye style={{ width: rem(14), height: rem(14) }} />,
    //   link: true,
    //   href: "/admin/businesses",
    // },
    {
      text: "Edit User",
      icon: <IconUserEdit style={{ width: rem(14), height: rem(14) }} />,
    },
    {
      text: "Deactivate",
      icon: <IconUserX style={{ width: rem(14), height: rem(14) }} />,
    },
  ];

  const handleRowClick = (user: AdminData) => {
    setUser(user);
    openDrawer();
  };

  const rows = filteredSearch(
    users,
    ["email", "firstName", "lastName", "role"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.email}</TableTd>
      <TableTd className={styles.table__td}>{`${element.firstName ?? ""} ${
        element.lastName ?? ""
      }`}</TableTd>
      <TableTd className={styles.table__td}>{element.role}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.updatedAt).format("ddd DD MMM YYYY")}
      </TableTd>
      {/* <TableTd className={styles.table__td}></TableTd> */}
      <TableTd className={styles.table__td}>
        <Badge
          tt="capitalize"
          variant="light"
          color={activeBadgeColor("ACTIVE")}
          w={82}
          h={24}
          fw={400}
          fz={12}
        >
          Active
        </Badge>
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
            {menuItems.map((items, index) => {
              // if (items.link)
              //   return (
              //     <Link key={index} href={`${items.href}/${element.id}`}>
              //       <MenuItem
              //         key={index}
              //         fz={10}
              //         c="#667085"
              //         leftSection={items.icon}
              //       >
              //         {items.text}
              //       </MenuItem>
              //     </Link>
              //   );
              {
              }

              return (
                <MenuItem
                  key={index}
                  fz={10}
                  c="#667085"
                  leftSection={items.icon}
                  onClick={() => {
                    if (items.text === "Edit User")
                      return handleEdit({
                        email: element.email,
                        firstName: element.firstName,
                        lastName: element.lastName,
                        role: element.role,
                        password: "",
                      });
                  }}
                >
                  {items.text}
                </MenuItem>
              );
            })}
          </MenuDropdown>
        </Menu>
      </TableTd>
    </TableTr>
  ));

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
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            // classNames={{ wrapper: styles.search, input: styles.input__search }}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={324}
            styles={{ input: { border: "1px solid #F5F5F5" } }}
          />

          <Group gap={12}>
            <Button
              // className={styles.filter__cta}
              variant="outline"
              color="var(--prune-text-gray-200)"
              c="var(--prune-text-gray-800)"
              leftSection={<IconListTree size={14} />}
              fz={12}
              fw={500}
              onClick={toggle}
            >
              Filter
            </Button>

            <Button
              onClick={open}
              leftSection={<IconPlus color="#344054" size={16} />}
              // className={styles.login__cta}
              variant="filled"
              color="var(--prune-primary-600)"
              c="var(--prune-text-gray-800)"
              fw={500}
              fz={12}
            >
              Invite New User
            </Button>
          </Group>
        </Group>

        <Filter<FilterType>
          opened={openedFilter}
          toggle={toggle}
          form={filterForm}
        />

        <TableComponent head={tableHeaders} rows={rows} loading={loading} />

        {!loading && !!!rows.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage} alt="no content" width={156} height={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no users.
            </Text>
            <Text fz={10} c="#667085">
              When a user is added, they will appear here
            </Text>
          </Flex>
        )}
      </div>

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
      />

      <ModalComponent
        action={addAdmin}
        processing={processing}
        opened={opened}
        close={close}
        form={form}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />

      <UserDrawer opened={openedDrawer} close={closeDrawer} user={user} />
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
  "Name",
  "Role",
  "Date Created",
  "Last Active",
  "Status",
  "Action",
];
