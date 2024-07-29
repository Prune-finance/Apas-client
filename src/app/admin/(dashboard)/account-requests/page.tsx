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
import { DynamicSkeleton } from "@/lib/static";

// UI Imports
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import ModalComponent from "@/ui/components/Modal";
import styles from "@/ui/styles/accounts.module.scss";

// Asset Imports
import EmptyImage from "@/assets/empty.png";
import { useRouter, useSearchParams } from "next/navigation";
import Filter from "@/ui/components/Filter";
import { useForm, zodResolver } from "@mantine/form";
import {
  AccountFilterType,
  accountFilterValues,
  accountFilterSchema,
} from "./schema";
import { Suspense, useState } from "react";
import { filteredSearch } from "@/lib/search";
import { approvedBadgeColor } from "@/lib/utils";

function AccountRequests() {
  const searchParams = useSearchParams();

  const {
    rows: limit = "10",
    status,
    createdAt,
    sort,
    type,
  } = Object.fromEntries(searchParams.entries());

  const { loading, requests } = useRequests({
    ...(isNaN(Number(limit)) ? { limit: 10 } : { limit: parseInt(limit, 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    ...(type && { type: type.toLowerCase() }),
  });
  const [opened, { toggle }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const { push } = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const MenuComponent = ({ id }: { id: string }) => {
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
          >
            Approve
          </MenuItem>

          <MenuItem
            fz={10}
            c="#667085"
            leftSection={<IconX style={{ width: rem(14), height: rem(14) }} />}
          >
            Deny
          </MenuItem>
        </MenuDropdown>
      </Menu>
    );
  };

  const handleRowClick = (id: string) => {
    push(`/admin/account-requests/${id}`);
  };

  const rows = filteredSearch(
    requests,
    ["firstName", "lastName", "Company.name"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.Company.name}</TableTd>
      <TableTd className={styles.table__td}>{20}</TableTd>
      <TableTd
        className={styles.table__td}
      >{`${element.firstName} ${element.lastName}`}</TableTd>
      {/* <TableTd className={styles.table__td} tt="capitalize">
        {element.accountType.toLowerCase()}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd> */}
      <TableTd className={styles.table__td}>
        <Badge
          tt="capitalize"
          variant="light"
          color={approvedBadgeColor(element.status)}
          w={82}
          h={24}
          fw={400}
          fz={12}
        >
          {element.status.toLowerCase()}
        </Badge>
      </TableTd>

      <TableTd className={`${styles.table__td}`}>
        <MenuComponent id={element.id} />
      </TableTd>
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
          />

          <Group gap={12}>
            <Button
              variant="default"
              color="var(--prune-text-gray-500)"
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

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr tt="capitalize">
                {tableHeaders.map((header, index) => (
                  <TableTh
                    key={index}
                    className={styles.table__th}
                    tt="capitalize"
                  >
                    {header}
                  </TableTh>
                ))}
                {/* <TableTh className={styles.table__th}>Account Name</TableTh>
                <TableTh className={styles.table__th}>Type</TableTh>
                <TableTh className={styles.table__th}>Business</TableTh>
                <TableTh className={styles.table__th}>Date Created</TableTh>
                <TableTh className={styles.table__th}>Status</TableTh>
                <TableTh className={styles.table__th}>Action</TableTh> */}
              </TableTr>
            </TableThead>
            <TableTbody>{loading ? DynamicSkeleton(1) : rows}</TableTbody>
          </Table>
        </TableScrollContainer>

        {!loading && !!!rows.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage} alt="no content" width={156} height={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no account requests.
            </Text>
            <Text fz={10} c="#667085">
              When a request is created, it will appear here
            </Text>
          </Flex>
        )}

        <div className={styles.pagination__container}>
          <Group gap={9}>
            <Text fz={14}>Showing:</Text>

            <Select
              data={["10", "20", "50", "100"]}
              defaultValue={"10"}
              w={60}
              // h={24}
              size="xs"
              withCheckIcon={false}
            />
          </Group>
          <Pagination
            autoContrast
            color="#fff"
            total={1}
            classNames={{ control: styles.control, root: styles.pagination }}
          />
        </div>
      </div>
    </main>
  );
}

const tableHeaders = [
  "Business Name",
  "Number of Requests",
  "Contact Email",
  "Status",
  "Action",
];

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
