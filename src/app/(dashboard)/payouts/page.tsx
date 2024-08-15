"use client";
import dayjs from "dayjs";

import { Group, Paper } from "@mantine/core";

import { Text } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";
import { Flex } from "@mantine/core";

import styles from "./styles.module.scss";
import {
  IconArrowUpRight,
  IconSearch,
  IconListTree,
} from "@tabler/icons-react";

import { formatNumber, frontendPagination } from "@/lib/utils";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  TrxData,
  useUserDefaultTransactions,
  useUserTransactions,
} from "@/lib/hooks/transactions";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import Filter from "@/ui/components/Filter";
import { Suspense, useState } from "react";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { filteredSearch } from "@/lib/search";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { TableComponent } from "@/ui/components/Table";
import { SearchInput } from "@/ui/components/Inputs";
import InfoCards from "@/ui/components/Cards/InfoCards";
import { PayoutDrawer } from "./drawer";

function PayoutTrx() {
  const searchParams = useSearchParams();
  const [selectedRequest, setSelectedRequest] = useState<TrxData | null>(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { status, createdAt, sort } = Object.fromEntries(
    searchParams.entries()
  );

  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { loading, transactions } = useUserDefaultTransactions({
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { date: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    page: active,
  });

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const [opened, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const searchProps = ["recipientIban", "recipientBankAddress", "reference"];

  const rows = frontendPagination(
    filteredSearch(transactions, searchProps, debouncedSearch),
    active,
    parseInt(limit ?? "10", 10)
  ).map((element: TrxData) => (
    <TableTr
      key={element.id}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.reference}</TableTd>
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        <Flex align="center" gap={5}>
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            className={styles.table__td__icon}
            // style={{ marginTop: "-20px" }}
          />
          {formatNumber(element.amount, true, "EUR")}
        </Flex>
        {/* <Text fz={12}></Text> */}
      </TableTd>
      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("DD MMM, YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

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
      value: 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value: transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
    },
  ];

  return (
    <main className={styles.main}>
      <Paper className={styles.table__container}>
        <div className={styles.container__header}>
          <Flex gap={10} align="center">
            <Text fz={18} fw={600}>
              Payouts
            </Text>
          </Flex>
        </div>

        <InfoCards details={infoDetails} title="Overview" />
        <Group justify="space-between" mt={30}>
          <SearchInput search={search} setSearch={setSearch} />

          <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
        </Group>
        <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

        <TableComponent rows={rows} loading={loading} head={tableHeaders} />

        <EmptyTable
          rows={rows}
          loading={loading}
          title="There are no payouts"
          text="When a payout is recorded, it will appear here"
        />
        <PaginationComponent
          total={Math.ceil(transactions.length / parseInt(limit ?? "10", 10))}
          active={active}
          setActive={setActive}
          limit={limit}
          setLimit={setLimit}
        />
      </Paper>

      <PayoutDrawer
        opened={drawerOpened}
        close={closeDrawer}
        payout={selectedRequest}
      />
    </main>
  );
}

export default function AccountTrxSuspense() {
  return (
    <Suspense>
      <PayoutTrx />
    </Suspense>
  );
}

const tableHeaders = [
  "Beneficiary Name",
  "Destination Account",
  "Bank",
  "Amount",
  "Date Created",
  "Status",
];
