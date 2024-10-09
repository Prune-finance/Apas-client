"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { Flex, Paper, Stack, TabsPanel, Text, Title } from "@mantine/core";
import { IconCircleArrowDown, IconListTree } from "@tabler/icons-react";
import styles from "./styles.module.scss";

import { useParams, useSearchParams } from "next/navigation";

import InfoCards from "@/ui/components/Cards/InfoCards";
import Filter from "@/ui/components/Filter";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";

import Transaction from "@/lib/store/transaction";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import {
  TransactionType,
  useDefaultAccountTransactions,
  usePayoutTransactions,
  useTransactions,
} from "@/lib/hooks/transactions";
import dayjs from "dayjs";
import { Suspense, useMemo, useRef, useState } from "react";
import { filteredSearch } from "@/lib/search";
import PaginationComponent from "@/ui/components/Pagination";

import { SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import {
  BusinessAccountTableHeaders,
  IssuedAccountTableHeaders,
  PayoutTableHeaders,
} from "@/lib/static";

import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import TabsComponent from "@/ui/components/Tabs";
import {
  BusinessTransactionTableRows,
  IssuedTransactionTableRows,
  PayoutTransactionTableRows,
} from "@/ui/components/TableRows";

function TransactionForAccount() {
  const params = useParams<{ id: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const searchParams = useSearchParams();

  const {
    status,
    createdAt,
    type,
    senderName,
    date,
    endDate,
    recipientName,
    recipientIban,
  } = Object.fromEntries(searchParams.entries());

  const param = useMemo(() => {
    return {
      ...(status && { status }),
      ...(createdAt && { date: dayjs(date).format("YYYY-MM-DD") }),
      ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
      ...(type && { type }),
      ...(senderName && { senderName }),
      ...(recipientName && { recipientName }),
      ...(recipientIban && { recipientIban }),
      page: active,
      limit: parseInt(limit ?? "10", 10),
    };
  }, [status, createdAt, type, senderName, recipientName, recipientIban]);

  const { loading, transactions, meta } = useTransactions(undefined, param);

  const { transactions: payoutTransactions, loading: loadingPayout } =
    usePayoutTransactions(param);
  const { transactions: defaultTransactions, loading: loadingDefault } =
    useDefaultAccountTransactions(param);

  const [opened, { toggle }] = useDisclosure(false);
  const [openedIssued, { toggle: toggleIssuedFilter }] = useDisclosure(false);
  const [openedPayout, { toggle: togglePayoutFilter }] = useDisclosure(false);
  const { data, close, opened: openedDrawer } = Transaction();

  const infoDetails = [
    {
      title: "Total Balance",
      value: meta?.totalAmount || 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Money In",
      value: meta?.in || 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Money Out",
      value: meta?.out || 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Total Transactions",
      value: meta?.total || 0,
    },
  ];

  const defaultInfoDetails = [
    {
      title: "Total Balance",
      value: defaultTransactions.reduce((acc, cur) => acc + cur.amount, 0),
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Money In",
      value:
        defaultTransactions
          .filter((trx) => trx.type === "CREDIT")
          .reduce((acc, cur) => acc + cur.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Money Out",
      value:
        defaultTransactions
          .filter((trx) => trx.type === "DEBIT")
          .reduce((acc, cur) => acc + cur.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Total Transactions",
      value: defaultTransactions.length,
    },
  ];

  const customStatusOption = ["PENDING", "COMPLETED", "REJECTED", "CANCELLED"];

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <main>
      <Paper p={20}>
        <Stack gap={8}>
          <Title c="var(--prune-text-gray-700)" fz={24} fw={600}>
            Transactions
          </Title>

          <Text fz={14} c="var(--prune-text-gray-500)">
            Here’s an overview of all transactions{" "}
          </Text>
        </Stack>

        <TabsComponent
          tabs={tabs}
          mt={28}
          styles={{ list: { marginBottom: 28 } }}
          keepMounted={false}
        >
          <TabsPanel value={tabs[0].value}>
            <InfoCards
              title="Overview"
              details={defaultInfoDetails}
              loading={loading}
            >
              {/* <Select
            data={["Last Week", "Last Month"]}
            variant="filled"
            placeholder="Last Week"
            defaultValue={"Last Week"}
            w={150}
            // h={22}
            color="var(--prune-text-gray-500)"
            styles={{
              input: {
                outline: "none",
                border: "none",
              },
            }}
          /> */}
            </InfoCards>
            <Flex justify="space-between" align="center" mt={38}>
              <SearchInput search={search} setSearch={setSearch} />

              <Flex gap={12}>
                <SecondaryBtn
                  text="Filter"
                  action={toggle}
                  icon={IconListTree}
                />
                <SecondaryBtn
                  text="Download Statement"
                  // action={toggle}
                  icon={IconCircleArrowDown}
                />
              </Flex>
            </Flex>

            <Filter<FilterType>
              opened={opened}
              toggle={toggle}
              form={form}
              customStatusOption={customStatusOption}
            >
              <TextBox
                placeholder="Sender Name"
                {...form.getInputProps("senderName")}
              />
              <TextBox
                placeholder="Beneficiary Name"
                {...form.getInputProps("recipientName")}
              />
              <TextBox
                placeholder="Beneficiary IBAN"
                {...form.getInputProps("recipientIban")}
              />
              <SelectBox
                placeholder="Type"
                {...form.getInputProps("type")}
                data={["DEBIT", "CREDIT"]}
              />
            </Filter>
            <TableComponent
              head={BusinessAccountTableHeaders}
              rows={
                <BusinessTransactionTableRows
                  data={defaultTransactions}
                  search={debouncedSearch}
                  active={active}
                  limit={limit}
                  searchProps={searchProps}
                />
              }
              loading={loading}
            />
            <EmptyTable
              rows={defaultTransactions}
              loading={loading}
              text="Transactions will be shown here"
              title="There are no transactions"
            />
            <PaginationComponent
              active={active}
              setActive={setActive}
              setLimit={setLimit}
              limit={limit}
              total={Math.ceil(
                filteredSearch(defaultTransactions, searchProps, search)
                  .length / parseInt(limit ?? "10", 10)
              )}
            />
          </TabsPanel>

          <TabsPanel value={tabs[1].value}>
            <InfoCards title="Overview" details={infoDetails} loading={loading}>
              {/* <Select
            data={["Last Week", "Last Month"]}
            variant="filled"
            placeholder="Last Week"
            defaultValue={"Last Week"}
            w={150}
            // h={22}
            color="var(--prune-text-gray-500)"
            styles={{
              input: {
                outline: "none",
                border: "none",
              },
            }}
          /> */}
            </InfoCards>
            <Flex justify="space-between" align="center" mt={38}>
              <SearchInput search={search} setSearch={setSearch} />

              <Flex gap={12}>
                <SecondaryBtn
                  text="Filter"
                  action={toggleIssuedFilter}
                  icon={IconListTree}
                />
                <SecondaryBtn
                  text="Download Statement"
                  // action={toggle}
                  icon={IconCircleArrowDown}
                />
              </Flex>
            </Flex>

            <Filter<FilterType>
              opened={openedIssued}
              toggle={toggleIssuedFilter}
              form={form}
              customStatusOption={customStatusOption}
            >
              <TextBox
                placeholder="Sender Name"
                {...form.getInputProps("senderName")}
              />
              <TextBox
                placeholder="Beneficiary Name"
                {...form.getInputProps("recipientName")}
              />
              <TextBox
                placeholder="Beneficiary IBAN"
                {...form.getInputProps("recipientIban")}
              />
              <SelectBox
                placeholder="Type"
                {...form.getInputProps("type")}
                data={["DEBIT", "CREDIT"]}
              />
            </Filter>

            <TableComponent
              head={IssuedAccountTableHeaders}
              rows={
                <IssuedTransactionTableRows
                  data={transactions}
                  search={debouncedSearch}
                  active={active}
                  limit={limit}
                  searchProps={searchProps}
                />
              }
              loading={loading}
            />

            <EmptyTable
              rows={transactions}
              loading={loading}
              text="Transactions will be shown here"
              title="There are no transactions"
            />

            <PaginationComponent
              active={active}
              setActive={setActive}
              setLimit={setLimit}
              limit={limit}
              total={Math.ceil(
                filteredSearch(transactions, searchProps, search).length /
                  parseInt(limit ?? "10", 10)
              )}
            />
          </TabsPanel>

          <TabsPanel value={tabs[2].value}>
            <Flex justify="space-between" align="center" mt={38}>
              <SearchInput search={search} setSearch={setSearch} />

              <SecondaryBtn
                text="Filter"
                action={togglePayoutFilter}
                icon={IconListTree}
              />
            </Flex>

            <Filter<FilterType>
              opened={openedPayout}
              toggle={togglePayoutFilter}
              form={form}
              customStatusOption={customStatusOption}
            >
              <TextBox
                placeholder="Sender Name"
                {...form.getInputProps("senderName")}
              />
              <TextBox
                placeholder="Beneficiary Name"
                {...form.getInputProps("recipientName")}
              />
              <TextBox
                placeholder="Beneficiary IBAN"
                {...form.getInputProps("recipientIban")}
              />
              <SelectBox
                placeholder="Type"
                {...form.getInputProps("type")}
                data={["DEBIT", "CREDIT"]}
              />
            </Filter>

            <TableComponent
              head={PayoutTableHeaders}
              rows={
                <PayoutTransactionTableRows
                  data={payoutTransactions}
                  search={debouncedSearch}
                  active={active}
                  limit={limit}
                  searchProps={searchProps}
                />
              }
              loading={loadingPayout}
            />

            <EmptyTable
              rows={payoutTransactions}
              loading={loadingPayout}
              text="Transactions will be shown here"
              title="There are no transactions"
            />

            <PaginationComponent
              active={active}
              setActive={setActive}
              setLimit={setLimit}
              limit={limit}
              total={Math.ceil(
                filteredSearch(payoutTransactions, searchProps, search).length /
                  parseInt(limit ?? "10", 10)
              )}
            />
          </TabsPanel>
        </TabsComponent>

        {data && (
          <TransactionDrawer
            opened={openedDrawer}
            close={close}
            selectedRequest={data}
          />
        )}
      </Paper>
    </main>
  );
}

const tabs = [
  { value: "Businesses Accounts" },
  { value: "Issued Accounts" },
  { value: "Payout Accounts" },
];

const searchProps = ["senderIban", "recipientIban", "recipientBankAddress"];

export default function TransactionForAccountSuspense() {
  return (
    <Suspense>
      <TransactionForAccount />
    </Suspense>
  );
}
