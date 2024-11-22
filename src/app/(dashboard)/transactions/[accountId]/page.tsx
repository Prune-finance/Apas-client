"use client";

import {
  TransactionType,
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
  Group,
  Skeleton,
  Stack,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";
import styles from "../styles.module.scss";
import { TransactionDrawer } from "../drawer";
import { useParams } from "next/navigation";
import { useSingleUserAccountByIBAN } from "@/lib/hooks/accounts";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { IssuedAccountTableHeaders } from "@/lib/static";
import { AmountGroup } from "@/ui/components/AmountGroup";

export default function AccountTransactions() {
  const { accountId } = useParams<{ accountId: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { transactions, loading, meta } = useUserTransactionsByIBAN(accountId);

  const { account, loading: loadingAcct } =
    useSingleUserAccountByIBAN(accountId);

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
      value: 0,
      formatted: true,
      currency: "EUR",
      loading: loading,
    },
    {
      title: "Money Out",
      value: transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
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

  const searchProps = ["recipientIban", "recipientBankAddress", "reference"];

  const rows = frontendPagination(
    filteredSearch(transactions, searchProps, debouncedSearch),
    active,
    parseInt(limit ?? "10", 10)
  ).map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.senderIban}</TableTd>
      <TableTd>{"N/A"}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientName || element.recipientIban}
      </TableTd>
      <TableTd className={styles.table__td}>
        <AmountGroup type={element.type} fz={12} fw={400} />
      </TableTd>
      <TableTd className={styles.table__td}>
        {formatNumber(element.amount, true, "EUR")}
      </TableTd>
      <TableTd className={styles.table__td}>{element.reference}</TableTd>

      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY - hh:mm a")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Transactions", href: "/transactions" },
          {
            title: account?.accountName || "",
            href: `/transactions/${accountId}`,
            loading: loadingAcct,
          },
        ]}
      />
      <Group gap={12} align="center" mt={32}>
        {!loading ? (
          <Avatar
            variant="filled"
            size="lg"
            color="var(--prune-primary-700)"
            // variant="light"
          >{`${account?.firstName.charAt(0)}${account?.lastName.charAt(
            0
          )}`}</Avatar>
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

          {!loading ? (
            <Text
              fz={10}
              fw={400}
              className={styles.main__header__text}
              m={0}
              p={0}
            >
              {account?.accountNumber ?? ""}
            </Text>
          ) : (
            <Skeleton h={10} w={50} />
          )}
        </Stack>
      </Group>

      <InfoCards details={infoDetails} title="Overview" loading={loading} />

      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>
      <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

      <TableComponent
        rows={rows}
        loading={loading}
        head={IssuedAccountTableHeaders}
      />

      <EmptyTable
        rows={rows}
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

const tableHeaders = [
  "Recipient IBAN",
  "Bank",
  "Reference",
  "Amount",
  "Date Created",
  "Status",
];

const tableHeader = ["Name", "Amount", "Date", "Status"];
