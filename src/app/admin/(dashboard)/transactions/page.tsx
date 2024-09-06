"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Paper,
  Select,
  Stack,
  TableTd,
  TableTr,
  TabsPanel,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconCircleArrowDown,
  IconListTree,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import styles from "./styles.module.scss";

import { useParams, useSearchParams } from "next/navigation";

import InfoCards from "@/ui/components/Cards/InfoCards";
import Filter from "@/ui/components/Filter";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import {
  approvedBadgeColor,
  formatNumber,
  frontendPagination,
} from "@/lib/utils";
import Transaction from "@/lib/store/transaction";
import { useSingleAccount } from "@/lib/hooks/accounts";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import {
  TransactionType,
  useDefaultAccountTransactions,
  usePayoutTransactions,
  useTransactions,
} from "@/lib/hooks/transactions";
import dayjs from "dayjs";
import { Suspense, useRef, useState } from "react";
import { filteredSearch } from "@/lib/search";
import PaginationComponent from "@/ui/components/Pagination";
import { AmountGroup } from "@/ui/components/AmountGroup";
import { closeButtonProps } from "../businesses/[id]/(tabs)/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  ReceiptDetails,
  TransactionReceipt,
} from "@/ui/components/TransactionReceipt";
import { handlePdfDownload } from "@/lib/actions/auth";
import { SearchInput } from "@/ui/components/Inputs";
import { IssuedAccountTableHeaders } from "@/lib/static";
import Link from "next/link";
import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import TabsComponent from "@/ui/components/Tabs";

function TransactionForAccount() {
  const params = useParams<{ id: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const searchParams = useSearchParams();

  const status = searchParams.get("status")?.toUpperCase();
  const createdAt = searchParams.get("createdAt");

  const { loading, transactions, meta } = useTransactions(undefined, {
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(status && { status }),
  });

  const { transactions: payoutTransactions, loading: loadingPayout } =
    usePayoutTransactions();
  const { transactions: defaultTransactions, loading: loadingDefault } =
    useDefaultAccountTransactions();

  const [opened, { toggle }] = useDisclosure(false);
  const { data, close, opened: openedDrawer } = Transaction();

  const infoDetails = [
    {
      title: "Total Balance",
      value: meta?.total || 0,
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
      value: transactions.length,
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
      value: payoutTransactions.length,
    },
  ];

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  return (
    <main>
      {/* <Breadcrumbs
        items={[
          {
            title: "Transactions",
            href: `/admin/transactions`,
          },
        ]}
      /> */}

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

            <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

            <TableComponent
              head={IssuedAccountTableHeaders}
              rows={
                <RowComponent
                  data={defaultTransactions}
                  id={params.id}
                  search={debouncedSearch}
                  active={active}
                  limit={limit}
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

            <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

            <TableComponent
              head={IssuedAccountTableHeaders}
              rows={
                <RowComponent
                  data={transactions}
                  id={params.id}
                  search={debouncedSearch}
                  active={active}
                  limit={limit}
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

              <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
            </Flex>

            <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

            <TableComponent
              head={IssuedAccountTableHeaders}
              rows={
                <RowComponent
                  data={payoutTransactions}
                  id={params.id}
                  search={debouncedSearch}
                  active={active}
                  limit={limit}
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
        {/* {data && <TRXDrawer opened={openedDrawer} close={close} data={data} />} */}
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

const tableHeaders = [
  "Name",
  "Bank",
  "Account Number",
  "Amount",
  "Date",
  "Status",
];

const trxTableHeaders = [
  "Sender",
  "Business",
  "Beneficiary",
  "Amount",
  "Date",
  "Status",
];

const RowComponent = ({
  data,
  id,
  search,
  active,
  limit,
}: {
  data: TransactionType[];
  id: string;
  search: string;
  active: number;
  limit: string | null;
}) => {
  const { open, setData } = Transaction();
  return frontendPagination(
    filteredSearch(data.reverse(), searchProps, search),
    active,
    parseInt(limit ?? "10", 10)
  ).map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd
        className={styles.table__td}
        td="underline"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link href={`/admin/transactions/${element.senderIban}`}>
          {element.senderIban}
        </Link>
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
  ));
};

export default function TransactionForAccountSuspense() {
  return (
    <Suspense>
      <TransactionForAccount />
    </Suspense>
  );
}

type TRXDrawerProps = {
  opened: boolean;
  close: () => void;
  data: TransactionType;
};

const TRXDrawer = ({ opened, close, data }: TRXDrawerProps) => {
  const { clearData } = Transaction();
  const pdfRef = useRef<HTMLDivElement>(null);

  const senderDetails = [
    { title: "Account Name", value: "N/A" },
    { title: "Bank", value: data.recipientBankAddress },
    { title: "Account Number", value: data.senderIban },
  ];

  const otherDetails = [
    { title: "Alert Type", value: <AmountGroup type={data.type} /> },
    {
      title: "Date & Time",
      value: dayjs(data.createdAt).format("DD MMM, YYYY-hh:mmA"),
    },
    { title: "Transaction ID", value: data.id },
    { title: "Status", value: <BadgeComponent status={data.status} /> },
  ];

  const beneficiaryDetails = {
    "Account Name": data.recipientName || "N/A",
    IBAN: data.recipientIban,
    BIC: data.recipientBic,
    "Bank Name": "N/A",
    "Bank Address": data.recipientBankAddress,
    Country: data.recipientBankCountry,
  };

  const BeneficiaryDetails = {
    "Amount Received": formatNumber(data?.amount ?? 0, true, "EUR"),
    // "First Name": selectedRequest?.destinationFirstName ?? "N/A",
    // "Last Name": selectedRequest?.destinationLastName ?? "N/A",
    Name: data?.recipientName || "N/A",
    IBAN: data?.recipientIban ?? "",
    "Bank Name": data?.recipientBankAddress ?? "",
    Country: data?.recipientBankCountry ?? "",
    "Bank Address": "N/A",
  };

  const SenderDetails = {
    "Account Name": "N/A",
    "Account Number": data?.senderIban ?? "",
    "Bank Name": "Prune Payments LTD",
    BIC: "ARPYGB21XXX",
  };

  const OtherDetails = {
    Type: data.type === "DEBIT" ? "Debit" : "Credit",
    "Payment Date": dayjs(data?.createdAt).format("hh:mm A Do MMM YYYY"),
    Reference: data?.reference ?? "N/A",
    "Transaction ID": data?.id ?? "",
  };
  const details: ReceiptDetails[] = [
    {
      title: "Sender Details",
      value: SenderDetails,
    },
    { title: "Beneficiary Details", value: BeneficiaryDetails },
    { title: "Other Details", value: OtherDetails },
  ];

  return (
    <Drawer
      opened={opened}
      position="right"
      onClose={() => {
        close();
        clearData();
      }}
      // withCloseButton={false}
      closeButtonProps={{ ...closeButtonProps, mr: 24 }}
      padding={0}
      title={
        <Text fz={20} fw={600} ml={24}>
          Transactions Details
        </Text>
      }
    >
      <Divider />
      <Box px={24} py={16}>
        <Stack gap={2}>
          <Text fz={12} c="var(--prune-text-gray-500)" fw={500}>
            {data.type === "DEBIT" ? "Amount Sent" : "Amount Received"}
          </Text>
          <Text c="var(--prune-primary-700)" fw={600} fz={32}>
            {formatNumber(data.amount, true, "EUR")}
          </Text>
        </Stack>

        <Divider my={24} />

        <Text fz={14} fw={600} c="var(--prune-text-gray-800)" tt="uppercase">
          Sender Details
        </Text>
        <Stack gap={12} mt={24}>
          {senderDetails.map((detail) => (
            <Group key={detail.title} justify="space-between">
              <Text c="var(--prune-text-gray-500)" fz={12} fw={400}>
                {detail.title}:
              </Text>
              <Text c="var(--prune-text-gray-700)" fz={12} fw={600}>
                {detail.value}
              </Text>
            </Group>
          ))}
        </Stack>

        <Divider my={24} />

        <Text fz={14} fw={600} c="var(--prune-text-gray-800)" tt="uppercase">
          Beneficiary Details
        </Text>

        <Stack gap={12} mt={24}>
          {Object.entries(beneficiaryDetails).map(([title, value]) => (
            <Group key={title} justify="space-between">
              <Text c="var(--prune-text-gray-500)" fz={12} fw={400}>
                {title}:
              </Text>

              <Text c={"var(--prune-text-gray-700)"} fz={12} fw={600}>
                {value}
              </Text>
            </Group>
          ))}
        </Stack>

        <Divider my={24} />

        <Text fz={14} fw={600} c="var(--prune-text-gray-800)" tt="uppercase">
          Other Details
        </Text>

        <Stack gap={12} mt={24}>
          {otherDetails.map((detail) => (
            <Group key={detail.title} justify="space-between">
              <Text c="var(--prune-text-gray-500)" fz={12} fw={400}>
                {detail.title}:
              </Text>

              <Text c={"var(--prune-text-gray-700)"} fz={12} fw={600}>
                {detail.value}
              </Text>
            </Group>
          ))}
        </Stack>

        <Divider my={24} />

        <PrimaryBtn
          text="Download Receipt"
          icon={IconCircleArrowDown}
          fw={600}
          fullWidth
          action={() => handlePdfDownload(pdfRef)}
        />
      </Box>

      <Box pos="absolute" left={-9999} bottom={700} w="45vw" m={0} p={0}>
        <TransactionReceipt
          amount={data?.amount ?? 0}
          amountType={
            data?.type === "DEBIT" ? "Amount Sent" : "Amount Received"
          }
          details={details}
          receiptRef={pdfRef}
        />
      </Box>
    </Drawer>
  );
};
