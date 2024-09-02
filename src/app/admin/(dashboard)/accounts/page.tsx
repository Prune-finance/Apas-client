"use client";
import dayjs from "dayjs";
import Cookies from "js-cookie";

import React, { Dispatch, SetStateAction, Suspense, useState } from "react";

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
import { Button, TextInput, Table } from "@mantine/core";
import { UnstyledButton, rem, Text } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/accounts.module.scss";
import {
  IconBrandLinktree,
  IconX,
  IconTrash,
  IconListTree,
  IconSearch,
  IconCheck,
  IconArrowUpRight,
  IconDotsVertical,
} from "@tabler/icons-react";

// import ModalComponent from "@/ui/components/Modal";
import { AccountData, useAccounts } from "@/lib/hooks/accounts";
import { activeBadgeColor } from "@/lib/utils";

import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import Filter from "@/ui/components/Filter";
import { useForm, zodResolver } from "@mantine/form";
import {
  accountFilterSchema,
  AccountFilterType,
  accountFilterValues,
} from "./schema";

import { useRouter, useSearchParams } from "next/navigation";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import PaginationComponent from "@/ui/components/Pagination";
import EmptyTable from "@/ui/components/EmptyTable";
import ModalComponent from "./modal";
import { validateRequest } from "@/lib/schema";
import { SearchInput } from "@/ui/components/Inputs";

function Accounts() {
  const searchParams = useSearchParams();

  const {
    rows = "10",
    status,
    createdAt,
    sort,
    type,
  } = Object.fromEntries(searchParams.entries());

  const [limit, setLimit] = useState<string | null>("10");
  const [activePage, setActivePage] = useState(1);

  const { loading, accounts, revalidate, meta } = useAccounts({
    ...(!limit || isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit, 10) }),
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    ...(type && { type: type.toUpperCase() }),
    page: activePage,
  });
  const [freezeOpened, { open: freezeOpen, close: freezeClose }] =
    useDisclosure(false);
  const [unfreezeOpened, { open: unfreezeOpen, close: unfreezeClose }] =
    useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [activateOpened, { open: activateOpen, close: activateClose }] =
    useDisclosure(false);
  const [filterOpened, { toggle }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const { handleError, handleSuccess } = useNotification();

  const [rowId, setRowId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const freezeAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/freeze`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      handleSuccess("Action Completed", "Account frozen");
      freezeClose();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const deactivateAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/deactivate`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
      revalidate();
      handleSuccess("Action Completed", "Account Deactivated");
      close();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const activateAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/activate`,
        {
          reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
      revalidate();
      handleSuccess("Action Completed", "Account Activated");
      activateClose();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const unfreezeAccount = async (id: string) => {
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}/unfreeze`,
        {
          reason,
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
          ...(supportingDocumentName && { supportingDocumentName }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      handleSuccess("Action Completed", "Account unfrozen");
      unfreezeClose();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const form = useForm<AccountFilterType>({
    initialValues: accountFilterValues,
    validate: zodResolver(accountFilterSchema),
  });

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(validateRequest),
  });

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Accounts", href: "/admin/accounts" },
        ]}
      /> */}

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Accounts
          </Text>
        </div>

        <Group
          justify="space-between"
          align="center"
          mt={24}
          // className={styles.container__search__filter}
        >
          <SearchInput search={search} setSearch={setSearch} />

          <Group gap={12}>
            <Button
              variant="outline"
              color="var(--prune-text-gray-200)"
              c="var(--prune-text-gray-800)"
              leftSection={<IconArrowUpRight size={14} />}
              fz={12}
              fw={500}
              // style={{ border: "1px solid #F5F5F5" }}
              // onClick={toggle}
            >
              Export CSV
            </Button>

            <Button
              variant="outline"
              color="var(--prune-text-gray-200)"
              c="var(--prune-text-gray-800)"
              leftSection={<IconListTree size={14} />}
              fz={12}
              fw={500}
              // style={{ border: "1px solid #F5F5F5" }}
              onClick={toggle}
            >
              Filter
            </Button>
          </Group>
        </Group>

        <Filter<AccountFilterType>
          opened={filterOpened}
          toggle={toggle}
          form={form}
        >
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
          rows={
            <RowComponent
              accounts={accounts}
              activateOpen={activateOpen}
              unfreezeOpen={unfreezeOpen}
              freezeOpen={freezeOpen}
              open={open}
              debouncedSearch={debouncedSearch}
              setRowId={setRowId}
            />
          }
          loading={loading}
        />

        <EmptyTable
          rows={accounts}
          loading={loading}
          title="There are no accounts"
          text="When an account is created, it will appear here."
        />

        <PaginationComponent
          active={activePage}
          setActive={setActivePage}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        />

        <ModalComponent
          processing={processing}
          action={() => freezeAccount(rowId || "")}
          form={requestForm}
          color="#F2F4F7"
          icon={<IconBrandLinktree color="#344054" />}
          opened={freezeOpened}
          close={freezeClose}
          title="Freeze this Account?"
          text="You are about to freeze this account. This means no activity can be carried out on this account anymore."
        />

        <ModalComponent
          processing={processing}
          action={() => unfreezeAccount(rowId || "")}
          form={requestForm}
          color="#F2F4F7"
          icon={<IconBrandLinktree color="#344054" />}
          opened={unfreezeOpened}
          close={unfreezeClose}
          title="Unfreeze this Account?"
          text="You are about to unfreeze this account. This means full activity can be carried out in the account again."
        />

        <ModalComponent
          processing={processing}
          action={() => deactivateAccount(rowId || "")}
          form={requestForm}
          color="#FEF3F2"
          icon={<IconX color="#D92D20" />}
          opened={opened}
          close={close}
          title="Deactivate This Account?"
          text="You are about to deactivate this account. This means the account will be inactive."
        />

        <ModalComponent
          processing={processing}
          action={() => activateAccount(rowId || "")}
          form={requestForm}
          color="#ECFDF3"
          icon={<IconCheck color="#12B76A" />}
          opened={activateOpened}
          close={activateClose}
          title="Activate This Account?"
          text="You are about to activate this account. This means the account will become active."
        />
      </div>
    </main>
  );
}

export default function AccountsSus() {
  return (
    <Suspense>
      <Accounts />
    </Suspense>
  );
}

const tableHeaders = [
  "Account Name",
  "Account Number",
  "Type",
  "Business",
  "Date Created",
  "Status",
  "Action",
];

type RowProps = {
  accounts: AccountData[];
  debouncedSearch: string;
  setRowId: Dispatch<SetStateAction<string | null>>;
  activateOpen: () => void;
  freezeOpen: () => void;
  unfreezeOpen: () => void;
  open: () => void;
};

const RowComponent = ({
  accounts,
  debouncedSearch,
  setRowId,
  activateOpen,
  freezeOpen,
  unfreezeOpen,
  open,
}: RowProps) => {
  const { push } = useRouter();

  const handleRowClick = (id: string) => {
    push(`/admin/accounts/${id}`);
  };
  return filteredSearch(
    accounts,
    ["accountName", "accountNumber", "Company.name"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td} tt="capitalize">
        {element.accountName}
      </TableTd>
      <TableTd className={styles.table__td}>{element.accountNumber}</TableTd>
      {/* <TableTd className={styles.table__td}>
        {formatNumber(element.accountBalance, true, "EUR")}
      </TableTd> */}
      <TableTd className={styles.table__td} tt="capitalize">
        {element.type.toLowerCase()}
      </TableTd>
      <TableTd className={styles.table__td}>{element.Company.name}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <Badge
          tt="capitalize"
          variant="light"
          color={activeBadgeColor(element.status)}
          w={82}
          h={24}
          fw={400}
          fz={12}
        >
          {element.status.toLowerCase()}
        </Badge>
      </TableTd>

      <TableTd
        className={`${styles.table__td}`}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuComponent
          id={element.id}
          status={element.status}
          setRowId={setRowId}
          activateOpen={activateOpen}
          freezeOpen={freezeOpen}
          unfreezeOpen={unfreezeOpen}
          open={open}
        />
      </TableTd>
    </TableTr>
  ));
};

type MenuProps = {
  id: string;
  status: string;
  setRowId: Dispatch<SetStateAction<string | null>>;
  activateOpen: () => void;
  freezeOpen: () => void;
  unfreezeOpen: () => void;
  open: () => void;
};

const MenuComponent = ({
  id,
  status,
  setRowId,
  activateOpen,
  freezeOpen,
  unfreezeOpen,
  open,
}: MenuProps) => {
  return (
    <Menu shadow="md" width={150}>
      <MenuTarget>
        <UnstyledButton>
          <IconDotsVertical size={17} />
        </UnstyledButton>
      </MenuTarget>

      <MenuDropdown>
        {/* <Link href={`/admin/accounts/${id}`}>
          <MenuItem
            fz={10}
            c="#667085"
            leftSection={
              <IconEye style={{ width: rem(14), height: rem(14) }} />
            }
          >
            View
          </MenuItem>
        </Link> */}

        <MenuItem
          onClick={() => {
            setRowId(id);
            if (status === "FROZEN") return unfreezeOpen();
            freezeOpen();
          }}
          fz={10}
          c="#667085"
          leftSection={
            <IconBrandLinktree style={{ width: rem(14), height: rem(14) }} />
          }
        >
          {status === "FROZEN" ? "Unfreeze" : "Freeze"}
        </MenuItem>

        <MenuItem
          onClick={() => {
            setRowId(id);
            if (status === "INACTIVE") return activateOpen();
            open();
          }}
          fz={10}
          c="#667085"
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
        >
          {status === "INACTIVE" ? "Activate" : "Deactivate"}
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};
