"use client";
import dayjs from "dayjs";

import React, { Dispatch, SetStateAction, useState } from "react";

import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  Group,
  Image,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
} from "@mantine/core";
import { UnstyledButton, rem } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";

import styles from "@/ui/styles/accounts.module.scss";
import {
  IconBrandLinktree,
  IconX,
  IconTrash,
  IconListTree,
  IconCheck,
  IconDotsVertical,
} from "@tabler/icons-react";

import { AccountData, AccountMeta } from "@/lib/hooks/accounts";
import { formatNumber, getUserType } from "@/lib/utils";

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
import useAxios from "@/lib/hooks/useAxios";
import Link from "next/link";
import { BadgeComponent } from "@/ui/components/Badge";
import EUIcon from "@/assets/EU-icon.png";
import GBPIcon from "@/assets/GB.png";
import USDIcon from "@/assets/USD.png";
import GHSIcon from "@/assets/GH.png";

type Currency = "EUR" | "GBP" | "USD" | "GHS";

const currencyTabs = [
  { title: "EUR", currency: "EUR" as Currency, icon: EUIcon.src },
  { title: "GBP", currency: "GBP" as Currency, icon: GBPIcon.src },
  { title: "USD", currency: "USD" as Currency, icon: USDIcon.src },
  { title: "GHS", currency: "GHS" as Currency, icon: GHSIcon.src },
];

export default function AllAccounts() {
  const searchParams = useSearchParams();

  const { status, date, endDate, accountName, accountNumber, type } =
    Object.fromEntries(searchParams.entries());

  const [limit, setLimit] = useState<string | null>("10");
  const [activePage, setActivePage] = useState(1);
  const [activeCurrency, setActiveCurrency] = useState<Currency>("EUR");
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
    currencyCode: activeCurrency,
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
    activeCurrency,
  ];

  const {
    loading,
    data: accounts,
    meta,
    queryFn: revalidate,
  } = useAxios<AccountData[], AccountMeta>({
    endpoint: "/admin/accounts/all",
    baseURL: "accounts",
    params,
    dependencies,
  });

  const [freezeOpened, { open: freezeOpen, close: freezeClose }] =
    useDisclosure(false);
  const [unfreezeOpened, { open: unfreezeOpen, close: unfreezeClose }] =
    useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [activateOpened, { open: activateOpen, close: activateClose }] =
    useDisclosure(false);
  const [filterOpened, { toggle }] = useDisclosure(false);
  const { handleError, handleSuccess } = useNotification();

  const [rowId, setRowId] = useState<string | null>(null);

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
    onSuccess() {
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
    onSuccess() {
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
    onSuccess() {
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
    onSuccess() {
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

  const handleCurrencyChange = (currency: Currency) => {
    setActiveCurrency(currency);
    setActivePage(1);
  };

  return (
    <div className={styles.table__container}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {currencyTabs.map((t) => {
          const isActive = activeCurrency === t.currency;
          return (
            <button
              key={t.currency}
              onClick={() => handleCurrencyChange(t.currency)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? "#c1dd06" : "#fbfee6",
                color: isActive ? "#344054" : "#596603",
                transition: "background-color 0.15s ease, color 0.15s ease",
              }}
            >
              <Image src={t.icon} alt="icon" h={20} w={20} />
              {t.title}
            </button>
          );
        })}
      </div>

      <Group justify="space-between" align="center" mt={24}>
        <SearchInput search={search} setSearch={setSearch} />
        <Group gap={12}>
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
            currency={activeCurrency}
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
  "Account Name",
  "Account Number",
  "Account Balance",
  "Date Created",
  "Account Type",
  "Total No. of Issued Acc",
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
  currency: string;
};

const RowComponent = ({
  accounts,
  setRowId,
  activateOpen,
  freezeOpen,
  unfreezeOpen,
  open,
  currency,
}: RowProps) => {
  const { push } = useRouter();

  const handleRowClick = (id: string, businessId: string) => {
    push(`/admin/accounts/${businessId}/default?accountId=${id}`);
  };

  return accounts.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => handleRowClick(element.id, element.Company.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd tt="capitalize" td="underline" c="var(--prune-primary-800)">
        <Link
          href={`/admin/accounts/${element.Company.id}/default?accountId=${element.id}`}
        >
          {element.accountName}
        </Link>
      </TableTd>
      <TableTd>{element.accountNumber}</TableTd>
      <TableTd>{formatNumber(element.accountBalance, true, currency)}</TableTd>
      <TableTd>{dayjs(element.createdAt).format("ddd DD MMM YYYY")}</TableTd>
      <TableTd tt="capitalize">{getUserType(element.type)}</TableTd>
      <TableTd>{element.Company?.issuedAccountCount}</TableTd>
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
