"use client";

import {
  TransactionType,
  TrxData,
  useTransactions,
  useTransactionsByIBAN,
  useUserDefaultTransactions,
  useUserTransactions,
  useUserTransactionsByIBAN,
} from "@/lib/hooks/transactions";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import { frontendPagination, formatNumber } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import {
  Avatar,
  Flex,
  Group,
  Skeleton,
  Stack,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import {
  IconArrowUpRight,
  IconListTree,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";
import styles from "../styles.module.scss";

import { useParams } from "next/navigation";
import { useSingleAccountByIBAN } from "@/lib/hooks/accounts";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { IssuedAccountTableHeaders } from "@/lib/static";
import { AmountGroup } from "@/ui/components/AmountGroup";
import { useSingleBusiness, useUserBusiness } from "@/lib/hooks/businesses";
import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import Link from "next/link";
import { IssuedTransactionTableRows } from "@/ui/components/TableRows";

export default function AccountTransactions() {
  const { accountId } = useParams<{ accountId: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { transactions, loading, meta } = useTransactionsByIBAN(accountId);

  const { account, loading: loadingAcct } = useSingleAccountByIBAN(accountId);

  const { business } = useSingleBusiness(account?.companyId ?? "");

  const [opened, { toggle }] = useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [selectedRequest, setSelectedRequest] =
    useState<TransactionType | null>(null);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const infoDetails = [
    {
      title: "Total Balance",
      value: account?.accountBalance || 0,
      formatted: true,
      currency: "EUR",
      loading: loadingAcct,
    },
    {
      title: "Money In",
      value:
        transactions
          .filter((trx) => trx.type === "CREDIT")
          .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
      loading: loading,
    },
    {
      title: "Money Out",
      value:
        transactions
          .filter((trx) => trx.type === "DEBIT")
          .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
      loading: loading,
    },
    {
      title: "Total Transactions",
      value: transactions.length,
      loading: loading,
    },
  ];

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Transactions", href: "/admin/transactions" },
          ...(loadingAcct || account
            ? [
                {
                  title: account?.accountName || "",
                  href: `/admin/transactions/${accountId}`,
                  loading: loadingAcct,
                },
              ]
            : []),
        ]}
      />
      <Group gap={12} align="center" mt={32}>
        {!loading ? (
          <Avatar
            variant="filled"
            size="lg"
            color="var(--prune-primary-700)"
            // variant="light"
          >
            {account
              ? `${account?.firstName.charAt(0)}${account?.lastName.charAt(0)}`
              : null}
          </Avatar>
        ) : (
          <Skeleton circle h={50} w={50} />
        )}

        <Stack gap={2}>
          {!loading ? (
            <Text fz={24} className={styles.main__header__text} m={0} p={0}>
              {account?.accountName}
            </Text>
          ) : (
            <Skeleton h={10} w={100} />
          )}

          <Group gap={8}>
            {business?.kycTrusted && (
              <IconRosetteDiscountCheckFilled
                size={17}
                color="var(--prune-primary-700)"
              />
            )}
            {business ? (
              <Text
                fz={12}
                fw={500}
                c="var(--prune-text-gray-600)"
                td="underline"
                component={Link}
                href={`/admin/businesses/${business.id}`}
              >
                {business.name}
              </Text>
            ) : (
              <Skeleton h={10} w={70} />
            )}
          </Group>
        </Stack>
      </Group>

      <InfoCards details={infoDetails} title="Overview" loading={loading} />

      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>
      <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

      <TableComponent
        rows={<IssuedTransactionTableRows data={transactions} noLink />}
        loading={loading}
        head={IssuedAccountTableHeaders}
      />

      <EmptyTable
        rows={transactions}
        loading={loading}
        title="There are no transactions"
        text="When a transaction is recorded, it will appear here"
      />
      <PaginationComponent
        total={Math.ceil(transactions.length / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />

      <TransactionDrawer
        opened={openedDrawer}
        close={closeDrawer}
        selectedRequest={selectedRequest}
      />
    </main>
  );
}
