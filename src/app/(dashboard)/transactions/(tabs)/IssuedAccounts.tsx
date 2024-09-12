import form from "@/app/auth/login/form";
import {
  TransactionType,
  TrxData,
  useUserDefaultTransactions,
  useUserTransactions,
} from "@/lib/hooks/transactions";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
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
import { Flex, Group, TableTd, TableTr, TabsPanel } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import { IconArrowUpRight, IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";
import styles from "../styles.module.scss";
import { TransactionDrawer } from "../drawer";
import { useUserAccounts } from "@/lib/hooks/accounts";
import { useSearchParams } from "next/navigation";
import { AmountGroup } from "@/ui/components/AmountGroup";
import { IssuedAccountTableHeaders } from "@/lib/static";
import { IssuedTransactionTableRows } from "@/ui/components/TableRows";

export const IssuedAccountsTab = () => {
  const searchParams = useSearchParams();
  const { status, createdAt, sort, type } = Object.fromEntries(
    searchParams.entries()
  );

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  // const { loading, accounts, revalidate, meta } = useUserAccounts({
  //   ...(isNaN(Number(limit))
  //     ? { limit: 10 }
  //     : { limit: parseInt(limit ?? "10", 10) }),
  //   ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
  //   ...(status && { status: status.toUpperCase() }),
  //   ...(sort && { sort: sort.toLowerCase() }),
  //   ...(type && { type: type.toUpperCase() }),
  //   page: active,
  // });

  const { transactions, revalidate, loading } = useUserTransactions(undefined, {
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    page: active,
  });

  const [opened, { toggle }] = useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [selectedRequest, setSelectedRequest] =
    useState<TransactionType | null>(null);

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const infoDetails = [
    {
      title: "Total Balance",
      value: transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money In",
      value:
        transactions
          .filter((trx) => trx.type === "CREDIT")
          .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value:
        transactions
          .filter((trx) => trx.type === "DEBIT")
          .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
    },
  ];

  const searchProps = ["senderIban", "recipientIban", "amount"];

  const rows = filteredSearch(transactions, searchProps, debouncedSearch).map(
    (element) => (
      <TableTr
        key={element.id}
        onClick={() => {
          // window.location.href = `/transactions/${element.senderIban}`;
          setSelectedRequest(element);
          openDrawer();
        }}
        style={{ cursor: "pointer" }}
      >
        <TableTd
          className={styles.table__td}
          td="underline"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/transactions/${element.senderIban}`;
          }}
        >
          {element.senderIban}
        </TableTd>
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
    )
  );

  return (
    <TabsPanel value="Issued Accounts">
      <InfoCards details={infoDetails} title="Overview" />
      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>
      <Filter<FilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        approvalStatus
      />

      <TableComponent
        rows={
          <IssuedTransactionTableRows
            data={transactions}
            search={debouncedSearch}
            active={active}
            limit={limit}
            searchProps={searchProps}
          />
        }
        // rows={rows}
        loading={loading}
        head={IssuedAccountTableHeaders}
      />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no accounts"
        text="When an account is created, it will appear here"
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
    </TabsPanel>
  );
};

// const tableHeaders = [
//   "Sender Name",
//   "Beneficiary Name",
//   "Amount",
//   "Date Created",
//   "Status",
// ];

const tableHeaders = [
  "Sender",
  "Business",
  "Beneficiary",
  "Amount",
  "Date",
  "Status",
];
