"use client";
import dayjs from "dayjs";

import {
  Box,
  Divider,
  Drawer,
  Group,
  Paper,
  Stack,
  TabsPanel,
} from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { Text } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Flex, TableTh, TableThead } from "@mantine/core";

import styles from "./styles.module.scss";
import {
  IconArrowUpRight,
  IconSearch,
  IconListTree,
  IconX,
  IconPointFilled,
} from "@tabler/icons-react";

import { DynamicSkeleton2 } from "@/lib/static";
import { formatNumber, frontendPagination } from "@/lib/utils";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  TrxData,
  useTransactions,
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
import TabsComponent from "@/ui/components/Tabs";
import { AccountsTab } from "./(tabs)/Accounts";
import { IssuedAccountsTab } from "./(tabs)/IssuedAccounts";

function AccountTrx() {
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

  const { loading, transactions } = useUserTransactions(undefined, {
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { date: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    page: active,
  });

  return (
    <main
    // className={styles.main}
    >
      {/* <Breadcrumbs
        items={[
          {
            title: "Transactions",
            href: `/accounts/transactions`,
          },
        ]}
      /> */}

      <Paper
      // className={styles.table__container}
      >
        <div className={styles.container__header}>
          <Stack gap={8}>
            <Text fz={18} fw={600}>
              Transactions
            </Text>
            <Text fz={14} fw={400}>
              Here’s an overview of all your transactions
            </Text>
          </Stack>
        </div>

        <TabsComponent tabs={tabs} mt={32}>
          <AccountsTab />
          <IssuedAccountsTab />
        </TabsComponent>

        {/* <InfoCards details={infoDetails} title="Overview" />
        <Group justify="space-between" mt={30}>
          <SearchInput search={search} setSearch={setSearch} />

          <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
        </Group>
        <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

        <TableComponent rows={rows} loading={loading} head={tableHeaders} />

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
        /> */}
      </Paper>
    </main>
  );
}

export default function AccountTrxSuspense() {
  return (
    <Suspense>
      <AccountTrx />
    </Suspense>
  );
}

const tabs = [{ value: "Account" }, { value: "Issued Accounts" }];
