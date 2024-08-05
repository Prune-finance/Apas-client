"use client";

import { useParams, useRouter } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Flex,
  Grid,
  GridCol,
  Group,
  NativeSelect,
  Paper,
  rem,
  Skeleton,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableThead,
  TableTr,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowLeft,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react";

import { useMemo, useState } from "react";
import { approvedBadgeColor, formatNumber } from "@/lib/utils";
import { useSingleAccount } from "@/lib/hooks/accounts";
import Link from "next/link";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { DonutChartComponent } from "@/ui/components/Charts";
import TransactionStatistics from "./TransactionStats";
import { TableComponent } from "@/ui/components/Table";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import { TransactionType, useTransactions } from "@/lib/hooks/transactions";

dayjs.extend(advancedFormat);

export default function Account() {
  const params = useParams<{ id: string }>();

  const {
    loading: loadingTrx,
    transactions,
    meta,
  } = useTransactions(params.id);
  console.log({ transactions, meta });

  const { loading, account } = useSingleAccount(params.id);
  const [chartFrequency, setChartFrequency] = useState("Monthly");

  const accountDetails = [
    {
      title: "Euro Account",
      value: 0,
      formatted: true,
      currency: "EUR",
      locale: "en-GB",
    },
    {
      title: "Dollar Account",
      value: 0,
      formatted: true,
      currency: "USD",
      locale: "en-US",
    },
    {
      title: "Pound Account",
      value: 0,
      formatted: true,
      currency: "GBP",
      locale: "en-GB",
    },
  ];

  const flexedGroupDetails = [
    // { title: "Bank", value: "Wema" },
    { title: "Account Name", value: account?.accountName },
    { title: "Account No", value: account?.accountNumber },
  ];

  const lineData = useMemo(() => {
    const arr: {
      month: string;
      Inflow: number;
      Outflow: number;
    }[] = [];

    transactions.map((trx) => {
      let successful = 0,
        pending = 0,
        failed = 0;

      const month = dayjs(trx.createdAt).format("MMM DD");
      trx.status === "PENDING"
        ? (pending += trx.amount)
        : (successful += trx.amount);

      // arr.push({ month, Inflow: 0, Outflow: pending + successful + failed });
      arr.push({ month, Inflow: 0, Outflow: trx.amount });
    });

    return arr;
  }, [transactions]);

  const donutData = useMemo(() => {
    let completed = 0,
      pending = 0,
      failed = 0;
    transactions.map((trx) => {
      trx.status === "PENDING"
        ? (pending += trx.amount)
        : trx.status === "REJECTED"
        ? (failed += trx.amount)
        : (completed += trx.amount);
    });

    return [
      { name: "Completed", value: completed, color: "#039855" },
      { name: "Pending", value: pending, color: "#F79009" },
      { name: "Failed", value: failed, color: "#D92D20" },
    ];
  }, [transactions]);

  const totalTrxVolume = donutData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Businesses", href: "/admin/businesses" },
          { title: "C80 Limited", href: `/admin/businesses/${params.id}` },
          { title: params.id, href: `/admin/businesses/accounts/${params.id}` },
        ]}
      />

      <Paper p={28} className={styles.grid__container}>
        <Button
          fz={14}
          c="var(--prune-text-gray-500)"
          fw={400}
          px={0}
          variant="transparent"
          component={Link}
          href={`/admin/businesses/${account?.companyId}?tab=accounts`}
          leftSection={
            <IconArrowLeft
              color="#1D2939"
              style={{ width: "70%", height: "70%" }}
            />
          }
          style={{ pointerEvents: !account ? "none" : "auto" }}
        >
          Accounts
        </Button>

        <Flex justify="space-between" align="flex-start" mt={20}>
          <Stack gap={0}>
            {account?.accountName ? (
              <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
                {account?.accountName}
              </Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}
            <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
              {`Last Seen: ${dayjs(account?.createdAt).format(
                "Do, MMMM YYYY"
              )}`}
            </Text>
          </Stack>

          <Flex gap={10}>
            <Button
              variant="outline"
              color="var(--prune-text-gray-300)"
              c="var(--prune-text-gray-800)"
              fz={12}
              fw={500}
              // onClick={() => setEditing(false)}
            >
              Freeze Account
            </Button>
            <Button
              // onClick={() => {
              //   updateDirector(index, form.values);
              //   setEditing(false);
              // }}
              // className={styles.edit}
              variant="filled"
              color="var(--prune-primary-600)"
              fz={12}
              fw={500}
              c="var(--prune-text-gray-800)"
            >
              Debit Account
            </Button>
          </Flex>
        </Flex>

        <Grid>
          <GridCol span={8}>
            <InfoCards
              title="Account Overview"
              details={accountDetails}
              loading={loading}
            />
          </GridCol>

          <GridCol span={4}>
            <InfoCards
              title="Bank Details"
              details={flexedGroupDetails}
              flexedGroup
              loading={loading}
              h="190px"
            >
              <CopyButton value={account?.accountNumber || ""} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                      h={10}
                    >
                      {copied ? (
                        <IconCheck style={{ width: rem(16) }} />
                      ) : (
                        <IconCopy style={{ width: rem(16) }} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </InfoCards>
          </GridCol>

          <GridCol span={8.3}>
            <TransactionStatistics setChartFrequency={setChartFrequency} />
          </GridCol>

          <GridCol span={3.7}>
            <Paper px="auto" withBorder w="100%" h="100%" pt={20}>
              <Flex px={10} justify="space-between" align="center">
                <Text fz={16} fw={600} tt="capitalize">
                  Transaction Volume
                </Text>

                <Flex>
                  <NativeSelect
                    classNames={{
                      wrapper: styles.select__wrapper,
                      input: styles.select__input,
                    }}
                    onChange={(event) =>
                      setChartFrequency(event.currentTarget.value)
                    }
                    data={["Monthly", "Weekly"]}
                  />
                </Flex>
              </Flex>

              <Flex justify="center" my={37} h={150}>
                <DonutChartComponent
                  data={
                    !totalTrxVolume
                      ? [
                          {
                            name: "No Data",
                            value: 100,
                            color: "var(--prune-text-gray-300)",
                          },
                        ]
                      : donutData
                  }
                  startAngle={180}
                  endAngle={0}
                  withLabels={formatNumber(totalTrxVolume, true, "EUR")}
                />
              </Flex>

              <Group justify="space-between" px={10} gap={15}>
                {donutData.map((item, index) => {
                  return (
                    <Stack
                      key={index}
                      gap={15}
                      pl={9}
                      style={{ borderLeft: `3px solid ${item.color}` }}
                    >
                      <Text fz={12} c="var(--prune-text-gray-800)" fw={400}>
                        {item.name}
                      </Text>

                      <Text fz={14} fw={700} c="var(--prune-text-gray-800)">
                        {formatNumber(item.value, true, "EUR")}
                      </Text>
                    </Stack>
                  );
                })}
              </Group>
            </Paper>
          </GridCol>

          <GridCol span={12}>
            <Paper withBorder>
              <div className={styles.payout__table}>
                <Group justify="space-between">
                  <Text
                    className={styles.table__text}
                    lts={0.5}
                    fz={16}
                    fw={600}
                  >
                    Transaction History
                  </Text>

                  <Button
                    // leftSection={<IconCircleChevronRight size={18} />}
                    variant="transparent"
                    fz={12}
                    c="var(--prune-primary-600)"
                    td="underline"
                    component={Link}
                    href={`/admin/businesses/accounts/${params.id}/transactions`}
                  >
                    See All Transactions
                  </Button>
                </Group>

                <TableComponent
                  head={tableHeaders}
                  rows={
                    <RowComponent
                      data={transactions.slice(0, 3)}
                      id={params.id}
                    />
                  }
                  loading={loading}
                />

                <EmptyTable
                  rows={transactions}
                  loading={loading}
                  title="There are no recent transactions"
                  text="When transactions are created, they will appear."
                />
              </div>
            </Paper>
          </GridCol>
        </Grid>
      </Paper>
    </main>
  );
}

const tableHeaders = [
  "Name",
  "Bank",
  "Account Number",
  "Amount",
  "Date",
  "Status",
];

const RowComponent = ({
  data,
  id,
}: {
  data: TransactionType[];
  id: string;
}) => {
  const { push } = useRouter();
  const handleRowClick = (id: string) => {
    push(`/admin/businesses/accounts/${id}/transactions`);
  };
  return data.map((element) => (
    <TableTr
      key={element.id}
      onClick={() => handleRowClick(id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.senderIban}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd>
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        <Group gap={3}>
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            className={styles.table__td__icon}
          />
          {formatNumber(element.amount, true, "EUR")}
          {/* <Text fz={12}></Text> */}
        </Group>
      </TableTd>
      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("DD MMM, YYYY - hh:mm A")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <Badge
          tt="capitalize"
          variant="light"
          color={approvedBadgeColor(element.status.toUpperCase())}
          w={90}
          h={24}
          fw={400}
          fz={12}
        >
          {element.status.toLowerCase()}
        </Badge>
      </TableTd>
    </TableTr>
  ));
};

{
  /* <Grid>
  <GridCol span={3}>
    <Grid>
      <GridCol span={12}>
        <div className={styles.card__one__container}>
          <Flex direction="column" className={styles.card__one}>
            <Flex className={styles.card__one__header} align="center">
              <Text fw={600} fz={10} tt="uppercase">
                Account Details
              </Text>
              <IconPointFilled />
            </Flex>

            <Flex className={styles.card__one__body} direction="column">
              <Text className={styles.body__title}>Account Name</Text>
              <Text className={styles.body__text}>Sandra Chijioke</Text>

              <Divider my="sm" />

              <Text className={styles.body__title}>Account Number</Text>
              <Text className={styles.body__text}>234567896786433</Text>
            </Flex>
          </Flex>
          <Button
            fz={11}
            td="underline"
            variant="transparent"
            rightSection={<IconArrowRight size={14} />}
            color="#97AD05"
          >
            View Documents
          </Button>
        </div>
      </GridCol>

      <GridCol span={12} mih={170}>
        <CardOne
          container
          title="Account Balance"
          stat={24000000}
          colored
          formatted
          text={
            <Text fz={10} c="#90A3BF">
              From Jan 01, 2022 to Jan 31, 2022
            </Text>
          }
        />
      </GridCol>
    </Grid>
  </GridCol>

  <GridCol span={9}>
    <div className={styles.payout__table}>
      <Text className={styles.table__text} lts={0.5} fz={10} fw={600}>
        Recent Transactions
      </Text>

      <TableScrollContainer minWidth={500}>
        <Table className={styles.table} verticalSpacing="md">
          <TableTbody>{rows}</TableTbody>
        </Table>
      </TableScrollContainer>

      <Button
        leftSection={<IconCircleChevronRight size={18} />}
        variant="transparent"
        color="#97AD05"
        fz={11}
      >
        See All Transactions
      </Button>
    </div>
  </GridCol>

  <GridCol span={8} mih={500}>
    <Paper py={20} h="100%" px={14}>
      <Flex px={10} justify="space-between" align="center">
        <Text fz={10} fw={600} tt="uppercase">
          Transaction Statistics
        </Text>

        <Flex gap={22}>
          <Flex
            align="center"
            gap={5}
            p={3}
            px={8}
            style={{ border: "1px solid #F2F4F7", borderRadius: "4px" }}
          >
            <IconSquareFilled color="#D92D20" size={14} />
            <Text fz={12}>Deposits</Text>
          </Flex>

          <Flex
            align="center"
            gap={5}
            p={5}
            px={8}
            style={{ border: "1px solid #F2F4F7", borderRadius: "4px" }}
          >
            <IconSquareFilled color="#039855" size={14} />
            <Text fz={12}>Payouts</Text>
          </Flex>

          <NativeSelect
            classNames={{
              wrapper: styles.select__wrapper,
              input: styles.select__input,
            }}
            onChange={(event) =>
              setChartFrequency(event.currentTarget.value)
            }
            data={["Monthly", "Weekly"]}
          />
        </Flex>
      </Flex>

      <BarChart
        pr={20}
        mt={31}
        h={300}
        data={chartFrequency === "Monthly" ? data : weekData}
        dataKey={chartFrequency === "Monthly" ? "month" : "day"}
        barProps={{ barSize: 10, radius: 3 }}
        series={[
          { name: "Deposits", color: "#039855" },
          { name: "Payouts", color: "#D92D20" },
        ]}
        tickLine="y"
      />
    </Paper>
  </GridCol>

  <GridCol span={4}>
    <Paper py={20} h="100%" px={16}>
      <Flex px={10} justify="space-between" align="center">
        <Text fz={10} fw={600} tt="uppercase">
          Transaction Volume
        </Text>

        <Flex>
          <NativeSelect
            classNames={{
              wrapper: styles.select__wrapper,
              input: styles.select__input,
            }}
            onChange={(event) =>
              setChartFrequency(event.currentTarget.value)
            }
            data={["Monthly", "Weekly"]}
          />
        </Flex>
      </Flex>

      <Flex justify="center" my={37}>
        <DonutChart
          paddingAngle={4}
          data={donutData}
          chartLabel="30000"
          size={203}
          thickness={25}
        />
      </Flex>

      <Stack px={10} gap={15}>
        {donutData.map((item, index) => {
          return (
            <Flex key={index} justify="space-between">
              <Flex align="center" gap={5}>
                <IconSquareFilled color={item.color} size={14} />
                <Text fz={12} c="#98A2B3">
                  {item.name}
                </Text>
              </Flex>

              <Text fz={12} fw={600}>
                {formatNumber(item.value)}
              </Text>
            </Flex>
          );
        })}
      </Stack>
    </Paper>
  </GridCol>
</Grid> */
}

const tableData = [
  {
    AccName: "Matthew Philips",
    Biz: "Wema",
    Amount: 200000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "successful",
  },
  {
    AccName: "Agatha Goldie",
    Biz: "UBA",
    Amount: 300000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "successful",
  },
  {
    AccName: "Omar Zeeda",
    Biz: "FCMB",
    Amount: 250000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "failed",
  },
  {
    AccName: "Sharon Akindele",
    Biz: "Zenith Bank",
    Amount: 400000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "successful",
  },
  {
    AccName: "Bethel Teddy",
    Biz: "FCMB",
    Amount: 150000,
    Date: "26 JUN,2024-10:00AM",
    AccNum: "1657654367",
    Status: "successful",
  },
];

type TableData = {
  AccName: string;
  Biz: string;
  Amount: number;
  Date: string;
  AccNum: string;
  Status: string;
};

const data = [
  { month: "Jan", Deposits: 1200, Payouts: 900 },
  { month: "Feb", Deposits: 1900, Payouts: 1200 },
  { month: "Mar", Deposits: 400, Payouts: 1000 },
  { month: "Apr", Deposits: 1000, Payouts: 200 },
  { month: "May", Deposits: 800, Payouts: 1400 },
  { month: "Jul", Deposits: 750, Payouts: 600 },
  { month: "Jul", Deposits: 893, Payouts: 727 },
  { month: "Aug", Deposits: 239, Payouts: 1629 },
  { month: "Sep", Deposits: 837, Payouts: 697 },
  { month: "Oct", Deposits: 1234, Payouts: 526 },
  { month: "Nov", Deposits: 524, Payouts: 892 },
  { month: "Dec", Deposits: 750, Payouts: 600 },
];

const donutData = [
  {
    name: "Completed",
    value: 0,
    color: "var(--prune-primary-600)",
  },
  { name: "Failed", value: 0, color: "#D92D20" },
  {
    name: "Cancelled",
    value: 0,
    color: "var(--prune-text-gray-800)",
  },
];

const weekData = [
  { day: "Mon", Deposits: 1200, Payouts: 900 },
  { day: "Tue", Deposits: 1900, Payouts: 1200 },
  { day: "Wed", Deposits: 400, Payouts: 1000 },
  { day: "Thu", Deposits: 1000, Payouts: 200 },
  { day: "Fri", Deposits: 800, Payouts: 1400 },
  { day: "Sat", Deposits: 239, Payouts: 1629 },
  { day: "Sun", Deposits: 1234, Payouts: 526 },
];
