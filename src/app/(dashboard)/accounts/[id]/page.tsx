"use client";

import { useParams } from "next/navigation";
import Image from "next/image";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridCol,
  Modal,
  NativeSelect,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from "@mantine/core";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconPointFilled,
  IconSquareFilled,
  IconCircleChevronRight,
} from "@tabler/icons-react";
import { CardOne } from "@/ui/components/Cards";
import { AreaChart, BarChart, DonutChart } from "@mantine/charts";
import { useMemo, useState } from "react";
import { formatNumber } from "@/lib/utils";
import { useSingleUserAccount } from "@/lib/hooks/accounts";
import { useUserTransactions } from "@/lib/hooks/transactions";
import dayjs from "dayjs";
import { DynamicSkeleton } from "@/lib/static";

import EmptyImage from "@/assets/empty.png";
import { useDisclosure } from "@mantine/hooks";
import DebitRequestModal from "../../debit-requests/new/modal";
import Link from "next/link";

export default function Account() {
  const params = useParams<{ id: string }>();
  const { account, loading } = useSingleUserAccount(params.id);
  const { loading: trxLoading, transactions } = useUserTransactions(params.id);
  const [chartFrequency, setChartFrequency] = useState("Monthly");

  const [opened, { open, close }] = useDisclosure(false);

  const rows = transactions.map((element) => (
    <TableTr key={element.id}>
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd>
      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("DD MMM, YYYY")}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        <IconArrowUpRight
          color="#D92D20"
          size={16}
          className={styles.table__td__icon}
        />
        {formatNumber(element.amount, true, "EUR")}
        {/* <Text fz={12}></Text> */}
      </TableTd>
      <TableTd className={styles.table__td}>{element.recipientBic}</TableTd>
      <TableTd className={styles.table__td}>
        <div className={styles.table__td__status}>
          {/* <IconPointFilled size={14} color="#12B76A" /> */}
          <Text
            tt="capitalize"
            fz={12}
            c={element.status === "PENDING" ? "#F79009" : "#12B76A"}
          >
            {element.status}
          </Text>
        </div>
      </TableTd>
    </TableTr>
  ));

  const data = [
    { month: "Jan", Deposits: 0, Payouts: 0 },
    { month: "Feb", Deposits: 0, Payouts: 0 },
    { month: "Mar", Deposits: 0, Payouts: 0 },
    { month: "Apr", Deposits: 0, Payouts: 0 },
    { month: "May", Deposits: 0, Payouts: 0 },
    { month: "Jul", Deposits: 0, Payouts: 0 },
    { month: "Jul", Deposits: 0, Payouts: 0 },
    { month: "Aug", Deposits: 0, Payouts: 0 },
    { month: "Sep", Deposits: 0, Payouts: 0 },
    { month: "Oct", Deposits: 0, Payouts: 0 },
    { month: "Nov", Deposits: 0, Payouts: 0 },
    { month: "Dec", Deposits: 0, Payouts: 0 },
  ];

  const lineData = useMemo(() => {
    const arr: {
      month: string;
      inflow: number;
      outflow: number;
    }[] = [];

    transactions.reverse().map((trx) => {
      let successful = 0,
        pending = 0,
        failed = 0;

      const month = dayjs(trx.createdAt).format("MMM");
      trx.status === "PENDING"
        ? (pending += trx.amount)
        : (successful += trx.amount);

      arr.push({ month, inflow: successful, outflow: pending });
    });

    return arr;
  }, [transactions]);

  const donutData = useMemo(() => {
    let completed = 0,
      pending = 0,
      failed = 0;
    transactions.map((trx) => {
      if (trx.status === "PENDING") {
        pending += trx.amount;
      }
    });

    return [
      { name: "Completed", value: completed, color: "#039855" },
      { name: "Pending", value: pending, color: "#F79009" },
      { name: "Failed", value: failed, color: "#D92D20" },
    ];
  }, [transactions]);

  const weekData = [
    { day: "Mon", Deposits: 0, Payouts: 0 },
    { day: "Tue", Deposits: 0, Payouts: 0 },
    { day: "Wed", Deposits: 0, Payouts: 0 },
    { day: "Thu", Deposits: 0, Payouts: 0 },
    { day: "Fri", Deposits: 0, Payouts: 0 },
    { day: "Sat", Deposits: 0, Payouts: 0 },
    { day: "Sun", Deposits: 0, Payouts: 0 },
  ];

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/accounts" },
          ...(!loading
            ? [
                {
                  title: `${account?.accountName}`,
                  href: `/accounts/${params.id}`,
                },
              ]
            : []),
        ]}
      />

      <Flex
        justify="space-between"
        align="center"
        className={styles.main__header}
      >
        <Flex direction="column">
          <Text fz={24} className={styles.main__header__text}>
            {account?.accountName}
          </Text>
        </Flex>

        <Flex gap={10}>
          {/* <Button
            fz={12}
            className={styles.main__cta}
            variant="filled"
            color="#C1DD06"
          >
            Freeze Account
          </Button> */}

          <Button
            // component="a"
            // href="/debit-requests/new"
            onClick={open}
            fz={12}
            className={styles.main__cta}
            variant="filled"
            color="#C1DD06"
          >
            Debit Account
          </Button>
        </Flex>
      </Flex>

      <div className={styles.grid__container}>
        <Grid>
          <GridCol span={9}>
            <Flex className={styles.overview__container} direction="column">
              <Flex className={styles.container__header}>
                <Text fz={16} c="#1A1B20">
                  Account Overview
                </Text>
              </Flex>

              <Flex className={styles.container__body} gap={30}>
                <Flex flex={1} direction="column" gap={10}>
                  <Flex gap={10} align="center">
                    <Text className={styles.body__text__header}>
                      Euro Account
                    </Text>
                  </Flex>

                  <Text className={styles.body__text} fz={24} fw={600}>
                    {formatNumber(account?.accountBalance || 0, true, "EUR")}
                  </Text>
                </Flex>

                <Flex flex={1} direction="column" gap={10}>
                  <Flex gap={10} align="center">
                    <Text className={styles.body__text__header}>
                      Dollar Accounts
                    </Text>
                  </Flex>

                  <Text className={styles.body__text} fz={24} fw={600}>
                    {formatNumber(0, true, "EUR")}
                  </Text>
                </Flex>

                <Flex flex={1} direction="column" gap={10}>
                  <Flex gap={10} align="center">
                    <Text className={styles.body__text__header}>
                      Pound Accounts
                    </Text>
                  </Flex>

                  <Text className={styles.body__text} fz={24} fw={600}>
                    {formatNumber(0, true, "EUR")}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </GridCol>

          <GridCol span={3}>
            <Grid>
              <GridCol span={12}>
                <Paper className={styles.card__one__container}>
                  <Flex direction="column" className={styles.card__one}>
                    <Flex className={styles.card__one__header} align="center">
                      <Text fw={600} fz={16}>
                        Bank Details
                      </Text>
                    </Flex>

                    <Flex
                      className={styles.card__one__body}
                      direction="column"
                      gap={20}
                    >
                      <Flex justify="space-between">
                        <Text className={styles.body__title}>Account Name</Text>
                        {loading ? (
                          <Skeleton h={10} w={100} />
                        ) : (
                          <Text className={styles.body__text}>
                            {account?.accountName || ""}
                          </Text>
                        )}
                      </Flex>

                      {/* <Divider my="sm" /> */}

                      <Flex justify="space-between">
                        <Text className={styles.body__title}>
                          Account Number
                        </Text>
                        {loading ? (
                          <Skeleton h={10} w={100} />
                        ) : (
                          <Text className={styles.body__text}>
                            {account?.accountNumber || ""}
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                  {/* <Button
                    fz={11}
                    td="underline"
                    variant="transparent"
                    rightSection={<IconArrowRight size={14} />}
                    color="#97AD05"
                  >
                    View Documents
                  </Button> */}
                </Paper>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={8} mih={300}>
            <Paper
              style={{ border: "1px solid #f5f5f5" }}
              py={20}
              h="100%"
              px={14}
            >
              <Flex px={10} justify="space-between" align="center">
                <Text fz={16} fw={600}>
                  Transaction Statistics
                </Text>

                <Flex gap={22}>
                  <Flex align="center" gap={5} p={5} px={8}>
                    <IconSquareFilled color="#D92D20" size={14} />
                    <Text fz={12}>Outflow</Text>
                  </Flex>

                  <Flex align="center" gap={5} p={5} px={8}>
                    <IconSquareFilled color="#D5E855" size={14} />
                    <Text fz={12}>Inflow</Text>
                  </Flex>

                  <NativeSelect
                    classNames={{
                      wrapper: styles.select__wrapper,
                      input: styles.select__input,
                    }}
                    onChange={(event) =>
                      setChartFrequency(event.currentTarget.value)
                    }
                    data={["Monthly"]}
                  />
                </Flex>
              </Flex>

              {lineData.length > 0 ? (
                // <BarChart
                //   pr={20}
                //   mt={31}
                //   h={300}
                //   data={chartFrequency === "Monthly" ? lineData : weekData}
                //   dataKey={chartFrequency === "Monthly" ? "month" : "day"}
                //   barProps={{ barSize: 10, radius: 3 }}
                //   series={[
                //     { name: "failed", color: "#039855" },
                //     { name: "successful", color: "#D92D20" },
                //     { name: "pending", color: "#F79009" },
                //   ]}
                //   tickLine="y"
                // />

                <AreaChart
                  h={250}
                  mt={30}
                  curveType="bump"
                  data={lineData}
                  dataKey="date"
                  series={[
                    { name: "inflow", color: "#D5E855" },
                    { name: "outflow", color: "#D92D20" },
                  ]}
                />
              ) : (
                <Flex direction="column" align="center" mt={70}>
                  <Image
                    src={EmptyImage}
                    alt="no content"
                    width={156}
                    height={126}
                  />
                  <Text mt={14} fz={14} c="#1D2939">
                    There are no transactions.
                  </Text>
                  <Text fz={10} c="#667085">
                    When a transaction is recorded, it will appear here
                  </Text>
                </Flex>
              )}
            </Paper>
          </GridCol>

          <GridCol span={4}>
            <Paper
              style={{ border: "1px solid #f5f5f5" }}
              py={20}
              h="100%"
              px={16}
            >
              <Flex px={10} justify="space-between" align="center">
                <Text fz={16} fw={600}>
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
                  startAngle={180}
                  endAngle={0}
                  // paddingAngle={4}
                  data={donutData}
                  chartLabel={donutData.reduce((prv, cur) => {
                    return cur.value + prv;
                  }, 0)}
                  size={200}
                  thickness={20}
                />
              </Flex>

              <Flex px={10} gap={15} mt={-50}>
                {donutData.map((item, index) => {
                  return (
                    <Flex
                      style={{ borderLeft: `3px solid ${item.color}` }}
                      flex={1}
                      key={index}
                      direction="column"
                      pl={10}
                    >
                      <Flex align="center" gap={5}>
                        {/* <IconSquareFilled color={item.color} size={14} /> */}
                        <Text fz={12} c="#98A2B3">
                          {item.name}
                        </Text>
                      </Flex>

                      <Text fz={12} fw={600}>
                        {formatNumber(item.value, true, "EUR")}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Paper>
          </GridCol>

          <GridCol span={12}>
            <Paper
              style={{ border: "1px solid #f5f5f5" }}
              className={styles.payout__table}
            >
              <Flex justify="space-between" align="center">
                <Text className={styles.table__text} fz={16} fw={600}>
                  Recent Transactions
                </Text>

                <Link href={`/accounts/${account?.id}/transactions`}>
                  <Text td="underline" c="#758604" fz={12} fw={600}>
                    See All Transactions
                  </Text>
                </Link>
              </Flex>

              <TableScrollContainer
                className={styles.table__container}
                minWidth={500}
              >
                <Table className={styles.table} verticalSpacing="md">
                  {/* <TableTbody>{rows}</TableTbody> */}
                  <TableThead>
                    <TableTr>
                      <TableTh className={styles.table__th}>
                        Recipient IBAN
                      </TableTh>
                      <TableTh className={styles.table__th}>Bank</TableTh>
                      <TableTh className={styles.table__th}>
                        Date Created
                      </TableTh>
                      <TableTh className={styles.table__th}>Amount</TableTh>
                      <TableTh className={styles.table__th}>Reference</TableTh>
                      <TableTh className={styles.table__th}>Status</TableTh>
                    </TableTr>
                  </TableThead>
                  <TableTbody>{loading ? DynamicSkeleton(1) : rows}</TableTbody>
                </Table>

                {!loading && !!!rows.length && (
                  <Flex direction="column" align="center" mt={50}>
                    <Image
                      src={EmptyImage}
                      alt="no content"
                      width={126}
                      height={96}
                    />
                    <Text mt={14} fz={14} c="#1D2939">
                      There are no transactions.
                    </Text>
                    <Text fz={10} c="#667085">
                      When a transaction is recorded, it will appear here
                    </Text>
                  </Flex>
                )}
              </TableScrollContainer>
            </Paper>
          </GridCol>
        </Grid>
      </div>

      <Modal
        size="xl"
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
      >
        <DebitRequestModal close={close} selectedId={account?.id || ""} />
      </Modal>
    </main>
  );
}
