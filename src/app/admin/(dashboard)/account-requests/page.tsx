"use client";
import dayjs from "dayjs";

import Link from "next/link";
import Image from "next/image";

// Mantine Imports
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  Badge,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Select,
} from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { UnstyledButton, rem, Text, Pagination } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Flex, TableTh, TableThead } from "@mantine/core";

// Tabler Imports
import {
  IconDots,
  IconEye,
  IconDotsVertical,
  IconUserCheck,
  IconX,
} from "@tabler/icons-react";
import { IconTrash, IconListTree, IconSearch } from "@tabler/icons-react";

// Lib Imports
import { useRequests } from "@/lib/hooks/requests";
import { DynamicSkeleton, DynamicSkeleton2 } from "@/lib/static";

// UI Imports
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

// Asset Imports
import EmptyImage from "@/assets/empty.png";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Filter from "@/ui/components/Filter";
import { useForm, zodResolver } from "@mantine/form";
import {
  AccountFilterType,
  accountFilterValues,
  accountFilterSchema,
} from "./schema";
import { Suspense, useState } from "react";
import { filteredSearch } from "@/lib/search";
import { activeBadgeColor, approvedBadgeColor } from "@/lib/utils";
import { TableComponent } from "@/ui/components/Table";
import { approveRequest, rejectRequest } from "@/lib/actions/account-requests";
import useNotification from "@/lib/hooks/notification";
import { useBusiness } from "@/lib/hooks/businesses";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";

function AccountRequests() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    rows: _limit = "10",
    status,
    createdAt,
    sort,
    type,
  } = Object.fromEntries(searchParams.entries());

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const queryParams = {
    page: active,
    limit: parseInt(limit ?? "10", 10),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    ...(type && { type: type.toLowerCase() }),
  };

  const { loading, meta, businesses } = useBusiness(queryParams, true);

  const { requests, revalidate } = useRequests({
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    ...(type && { type: type.toLowerCase() }),
    // page: active,
  });
  const [opened, { toggle }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const { push } = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const MenuComponent = ({ id }: { id: string }) => {
    const { handleError, handleSuccess } = useNotification();

    const handleApproval = async () => {
      const { success, message } = await approveRequest(id);

      if (success) {
        revalidate();
        return handleSuccess("Successful! Request Approved", message);
      }
      return handleError("Error! Request Approval Failed", message);
    };

    const handleRejection = async () => {
      const { success, message } = await rejectRequest(id);

      if (success) {
        revalidate();
        return handleSuccess("Successful! Request Denied", message);
      }

      return handleError("Error! Request Denials Failed", message);
    };

    return (
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton onClick={(e) => e.stopPropagation()}>
            <IconDotsVertical size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          <MenuItem
            fz={10}
            c="#667085"
            leftSection={
              <IconUserCheck style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={handleApproval}
          >
            Approve
          </MenuItem>

          <MenuItem
            fz={10}
            c="#667085"
            leftSection={<IconX style={{ width: rem(14), height: rem(14) }} />}
            onClick={handleRejection}
          >
            Deny
          </MenuItem>
        </MenuDropdown>
      </Menu>
    );
  };

  // const handleRowClick = (id: string) => {
  //   push(`/admin/account-requests/${id}`);
  // };

  // const rows = filteredSearch(
  //   requests,
  //   ["firstName", "lastName", "Company.name"],
  //   debouncedSearch
  // ).map((element, index) => (
  //   <TableTr
  //     key={index}
  //     onClick={() => handleRowClick(element.id)}
  //     style={{ cursor: "pointer" }}
  //   >
  //     <TableTd className={styles.table__td}>{element.Company.name}</TableTd>
  //     <TableTd className={styles.table__td}>{20}</TableTd>
  //     <TableTd
  //       tt="lowercase"
  //       // className={styles.table__td}
  //     >{`${element.firstName}${element.lastName}.example.com`}</TableTd>
  //     {/* <TableTd className={styles.table__td} tt="capitalize">
  //       {element.accountType.toLowerCase()}
  //     </TableTd>
  //     <TableTd className={`${styles.table__td}`}>
  //       {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
  //     </TableTd> */}
  //     <TableTd className={styles.table__td}>
  //       <Badge
  //         tt="capitalize"
  //         variant="light"
  //         color={approvedBadgeColor(element.status)}
  //         w={82}
  //         h={24}
  //         fw={400}
  //         fz={12}
  //       >
  //         {element.status.toLowerCase()}
  //       </Badge>
  //     </TableTd>

  //     {/* <TableTd
  //       className={`${styles.table__td}`}
  //       onClick={(e) => e.stopPropagation()}
  //     >
  //       <MenuComponent id={element.id} />
  //     </TableTd> */}
  //   </TableTr>
  // ));

  const handleRowClick = (id: string) => {
    push(`/admin/account-requests/${id}`);
  };

  const rows = filteredSearch(
    businesses,
    ["name", "legalEntity"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{`${element.name}`}</TableTd>
      <TableTd className={styles.table__td} tt="capitalize">
        {element._count.AccountRequests}
      </TableTd>
      <TableTd className={styles.table__td} tt="capitalize">
        {(element.legalEntity ?? "").toLowerCase()}
      </TableTd>
      {/* <TableTd className={styles.table__td}>{element.Company.country}</TableTd> */}
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <Badge
          tt="capitalize"
          variant="light"
          color={activeBadgeColor(element.companyStatus)}
          w={82}
          h={24}
          fw={400}
          fz={12}
        >
          {element.companyStatus.toLowerCase()}
        </Badge>
      </TableTd>

      {/* <TableTd
        className={`${styles.table__td}`}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuComponent id={element.id} />
      </TableTd> */}
    </TableTr>
  ));

  const form = useForm<AccountFilterType>({
    initialValues: accountFilterValues,
    validate: zodResolver(accountFilterSchema),
  });

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Account Requests", href: "/admin/accounts" },
        ]}
      />

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Account Requests
          </Text>
        </div>

        <Group
          justify="space-between"
          align="center"
          mt={24}
          // className={styles.container__search__filter}
        >
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
          </Group>
        </Group>

        <Filter<AccountFilterType> opened={opened} form={form} toggle={toggle}>
          <Select
            placeholder="Type"
            data={["Corporate", "User"]}
            {...form.getInputProps("type")}
            size="xs"
            w={120}
            h={36}
          />
        </Filter>

        <TableComponent
          head={tableHeaders}
          rows={rows}
          loading={loading}
          // mt={30}
        />

        <EmptyTable
          rows={rows}
          loading={loading}
          title="There are no account requests"
          text="When a request is created, it will appear here."
        />

        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((meta?.total ?? 1) / parseInt(limit ?? "10", 10))}
        />
      </div>
    </main>
  );
}

const tableHeaders = [
  "Business Name",
  "Number of Requests",
  "Type",
  "Contact Email",
  "Status",
  // "Action",
];

// const tableHeaders = [
//   "Account Name",
//   "Type",
//   // "Country",
//   "Date Created",
//   "Status",
//   "Action",
// ];

const MenuComponent = ({ id }: { id: string }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Menu shadow="md" width={150}>
        <MenuTarget>
          <UnstyledButton>
            <IconDots size={17} />
          </UnstyledButton>
        </MenuTarget>

        <MenuDropdown>
          <Link href={`/admin/account-requests/${id}`}>
            <MenuItem
              fz={10}
              c="#667085"
              leftSection={
                <IconEye style={{ width: rem(14), height: rem(14) }} />
              }
            >
              View
            </MenuItem>
          </Link>

          <MenuItem
            onClick={open}
            fz={10}
            c="#667085"
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Delete
          </MenuItem>
        </MenuDropdown>
      </Menu>

      <ModalComponent
        color="#FEF3F2"
        icon={<IconTrash color="#D92D20" />}
        opened={opened}
        close={close}
        title="Delete Account Request?"
        text="You are about to delete this account request"
      />
    </>
  );
};

export default function AccountRequestsSus() {
  return (
    <Suspense>
      <AccountRequests />
    </Suspense>
  );
}
