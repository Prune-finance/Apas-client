"use client";
import dayjs from "dayjs";

import React, { Dispatch, SetStateAction, useState } from "react";

// Mantine Imports
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Group, Menu, MenuDropdown, MenuItem, MenuTarget } from "@mantine/core";
import { UnstyledButton, rem, Text } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";

import styles from "@/ui/styles/accounts.module.scss";
import {
  IconBrandLinktree,
  IconX,
  IconTrash,
  IconListTree,
  IconCheck,
  IconArrowUpRight,
  IconDotsVertical,
} from "@tabler/icons-react";

// import ModalComponent from "@/ui/components/Modal";
import {
  AccountData,
  AccountMeta,
  useAccountCurrencyStatistics,
  useAccountStatistics,
} from "@/lib/hooks/accounts";
import { camelCaseToTitleCase, formatNumber, getUserType } from "@/lib/utils";

import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import Filter from "@/ui/components/Filter";
import { useForm, zodResolver } from "@mantine/form";

import { useRouter, useSearchParams } from "next/navigation";
import { TableComponent } from "@/ui/components/Table";
import PaginationComponent from "@/ui/components/Pagination";
import EmptyTable from "@/ui/components/EmptyTable";
import ModalComponent from "../modal";
import { validateRequest } from "@/lib/schema";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import { SecondaryBtn } from "@/ui/components/Buttons";
import * as XLSX from "xlsx";
import createAxiosInstance from "@/lib/axios";
import useAxios from "@/lib/hooks/useAxios";
import AccountInfoCards from "@/ui/components/AccountInfoCards";
import Link from "next/link";
import { BadgeComponent } from "@/ui/components/Badge";
import { AccountType, Currency } from "@/lib/interface/currency";

interface Props {
  currency?: string;
  locale?: string;
  accountType: AccountType;
}

export default function PayoutAccountsComponent({
  currency,
  locale,
  accountType,
}: Props) {
  const searchParams = useSearchParams();
  const axios = createAxiosInstance("accounts");

  const { status, date, endDate, accountName, accountNumber, type } =
    Object.fromEntries(searchParams.entries());

  const [limit, setLimit] = useState<string | null>("10");
  const [activePage, setActivePage] = useState(1);
  const [frequency, setFrequency] = useState<string | null>("Monthly");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const params = {
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(type && { type: type === "Individual" ? "USER" : "CORPORATE" }),
    ...(accountName && { accountName }),
    ...(accountNumber && { accountNumber }),
    page: activePage,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
    accountType,
    currency,
  };

  const dependencies = [
    limit,
    activePage,
    status,
    date,
    endDate,
    accountName,
    accountNumber,
    type,
    debouncedSearch,
    accountType,
    currency,
  ];

  const { loading: loadingCurrencyStats, data: currencyStats } =
    useAccountCurrencyStatistics({
      accountType,
      frequency: frequency?.toLowerCase() ?? "monthly",
    });

  const {
    loading,
    data: accounts,
    meta,
    queryFn: revalidate,
  } = useAxios<AccountData[], AccountMeta>({
    endpoint: "/currency-accounts/admin/admin-get-currency-account",
    baseURL: "accounts",
    params,
    dependencies,
  });

  const {
    loading: loadingStats,
    meta: statsMeta,
    data: statsData,
  } = useAccountStatistics({
    frequency: frequency?.toLowerCase() ?? "monthly",
    accountType: "Payout",
  });

  // TODO: Handle the resetting of activePage state when the filter is toggled

  const [freezeOpened, { open: freezeOpen, close: freezeClose }] =
    useDisclosure(false);
  const [unfreezeOpened, { open: unfreezeOpen, close: unfreezeClose }] =
    useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [activateOpened, { open: activateOpen, close: activateClose }] =
    useDisclosure(false);
  const [filterOpened, { toggle, open: openFilter, close: closeFilter }] =
    useDisclosure(false);
  const { handleError, handleSuccess } = useNotification();

  const [rowId, setRowId] = useState<string | null>(null);
  const [processingCSV, setProcessingCSV] = useState(false);

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(validateRequest),
  });

  const { reason, supportingDocumentName, supportingDocumentUrl } =
    requestForm.values;

  const body = {
    reason,
    ...(supportingDocumentName && { supportingDocumentName }),
    ...(supportingDocumentUrl && { supportingDocumentUrl }),
  };

  const { queryFn: freezeAccount, loading: loadingFreeze } = useAxios({
    endpoint: `/admin/accounts/${rowId}/freeze`,
    method: "PATCH",
    body,
    onSuccess(data, meta) {
      revalidate();
      handleSuccess("Action Completed", "Account frozen");
      freezeClose();

      requestForm.reset();
    },
  });

  const { queryFn: deactivateAccount, loading: loadingDeactivate } = useAxios({
    endpoint: `/admin/accounts/${rowId}/deactivate`,
    method: "PATCH",
    body,
    onSuccess(data, meta) {
      revalidate();
      handleSuccess("Action Completed", "Account Deactivated");
      close();

      requestForm.reset();
    },
  });

  const { queryFn: activateAccount, loading: processingActivation } = useAxios({
    endpoint: `/admin/accounts/${rowId}/activate`,
    method: "PATCH",
    body,
    onSuccess(data, meta) {
      revalidate();
      handleSuccess("Action Completed", "Account Activated");
      activateClose();

      requestForm.reset();
    },
  });

  const { queryFn: unfreezeAccount, loading: processingUnfreeze } = useAxios({
    endpoint: `/admin/accounts/${rowId}/unfreeze`,
    method: "PATCH",
    body,
    onSuccess(data, meta) {
      revalidate();
      handleSuccess("Action Completed", "Account unfrozen");
      unfreezeClose();

      requestForm.reset();
    },
  });

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const fetchAccounts = async (limit: number) => {
    try {
      const { data } = await axios.get(
        `/admin/accounts/default?limit=${limit}`
      );

      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleExportCsv = async () => {
    setProcessingCSV(true);
    // fetch data
    try {
      const response = await fetchAccounts(meta?.total ?? 0);

      [
        "Business Account Name",
        "Account Number",
        "Account Balance",
        "Date Created",
        "Status",
        "Action",
      ];

      const data = response.map((account: AccountData) => ({
        "Account Name": account.accountName,
        "Account Number": account.accountNumber,
        Type: getUserType(account.type),
        Business: account.Company.name,
        "Date Created": dayjs(account.createdAt).format("ddd DD MMM YYYY"),
        Status: camelCaseToTitleCase(account.status),
      }));

      //convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      //convert worksheet to CSV
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      //download CSV
      const downloadCSV = (csvData: string) => {
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Payout Accounts.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      downloadCSV(csv);
    } catch (err) {
      handleError("An error occurred", parseError(err));
    } finally {
      setProcessingCSV(false);
    }
  };

  return (
    <div className={styles.table__container}>
      <AccountInfoCards
        loading={loadingCurrencyStats || loadingStats}
        frequency={frequency}
        setFrequency={setFrequency}
        accountType="Payout"
        meta={currencyStats}
        // meta={statsMeta}
        form={form}
        open={openFilter}
        close={closeFilter}
        opened={filterOpened}
        currency={currency}
        locale={locale}
        stats={statsData}
      />
      <Group
        justify="space-between"
        align="center"
        mt={24}
        // className={styles.container__search__filter}
      >
        <SearchInput search={search} setSearch={setSearch} />

        <Group gap={12}>
          <SecondaryBtn
            text="Export CSV"
            icon={IconArrowUpRight}
            // style={{ cursor: "not-allowed" }}
            action={handleExportCsv}
            loading={processingCSV}
            fw={600}
          />
          <SecondaryBtn
            text="Filter"
            icon={IconListTree}
            action={toggle}
            fw={600}
          />
        </Group>
      </Group>

      <Filter<FilterType> opened={filterOpened} toggle={toggle} form={form}>
        <TextBox
          placeholder="Account Name"
          {...form.getInputProps("accountName")}
        />
        <TextBox
          placeholder="Account Number"
          {...form.getInputProps("accountNumber")}
        />
        <SelectBox
          placeholder="Type"
          {...form.getInputProps("type")}
          data={["Corporate", "Individual"]}
        />
      </Filter>

      <TableComponent
        head={tableHeaders}
        rows={
          <RowComponent
            accounts={accounts || []}
            activateOpen={activateOpen}
            unfreezeOpen={unfreezeOpen}
            freezeOpen={freezeOpen}
            open={open}
            setRowId={setRowId}
            currency={currency}
            locale={locale}
          />
        }
        loading={loading}
      />

      <EmptyTable
        rows={accounts || []}
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
        processing={loadingFreeze}
        action={() => freezeAccount()}
        form={requestForm}
        color="#F2F4F7"
        icon={<IconBrandLinktree color="#344054" />}
        opened={freezeOpened}
        close={freezeClose}
        title="Freeze this Account?"
        text="You are about to freeze this account. This means no activity can be carried out on this account anymore."
      />

      <ModalComponent
        processing={processingUnfreeze}
        action={() => unfreezeAccount()}
        form={requestForm}
        color="#F2F4F7"
        icon={<IconBrandLinktree color="#344054" />}
        opened={unfreezeOpened}
        close={unfreezeClose}
        title="Unfreeze this Account?"
        text="You are about to unfreeze this account. This means full activity can be carried out in the account again."
      />

      <ModalComponent
        processing={loadingDeactivate}
        action={() => deactivateAccount()}
        form={requestForm}
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={opened}
        close={close}
        title="Deactivate This Account?"
        text="You are about to deactivate this account. This means the account will be inactive."
      />

      <ModalComponent
        processing={processingActivation}
        action={() => activateAccount()}
        form={requestForm}
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={activateOpened}
        close={activateClose}
        title="Activate This Account?"
        text="You are about to activate this account. This means the account will become active."
      />
    </div>
  );
}

const tableHeaders = [
  "Business Account Name",
  "Account Number",
  "Account Balance",
  "Date Created",
  "Status",
  "Action",
];

type RowProps = {
  accounts: AccountData[];
  setRowId: Dispatch<SetStateAction<string | null>>;
  activateOpen: () => void;
  freezeOpen: () => void;
  unfreezeOpen: () => void;
  open: () => void;
  currency?: string;
  locale?: string;
};

const RowComponent = ({
  accounts,
  setRowId,
  activateOpen,
  freezeOpen,
  unfreezeOpen,
  open,
  currency,
  locale,
}: RowProps) => {
  const { push } = useRouter();

  const handleRowClick = (id: string, businessId: string) => {
    push(`/admin/accounts/${id}/payout?businessId=${businessId}`);
  };
  return accounts.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id, element.Company.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd tt="capitalize" td="underline" c="var(--prune-primary-800)">
        <Link
          href={`/admin/accounts/${element.id}/payout?businessId=${element.Company.id}`}
        >
          {element.accountName}
        </Link>
      </TableTd>
      <TableTd>{element.accountNumber}</TableTd>
      <TableTd>
        {formatNumber(element.accountBalance, true, currency, locale)}
      </TableTd>
      <TableTd>{dayjs(element.createdAt).format("ddd DD MMM YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.status} active />
      </TableTd>

      <TableTd onClick={(e) => e.stopPropagation()}>
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
