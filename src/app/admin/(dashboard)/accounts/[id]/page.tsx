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
  NativeSelect,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
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
import { BarChart, DonutChart } from "@mantine/charts";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { useSingleAccount } from "@/lib/hooks/accounts";
import { useTransactions } from "@/lib/hooks/transactions";
import dayjs from "dayjs";
import { DynamicSkeleton } from "@/lib/static";

import EmptyImage from "@/assets/empty.png";

export default function Account() {
  const params = useParams<{ id: string }>();
  const { account, loading } = useSingleAccount(params.id);
  const { loading: trxLoading, transactions } = useTransactions(params.id);

  const [chartFrequency, setChartFrequency] = useState("Monthly");

  const rows = transactions.map((element) => (
    <TableTr key={element.id}>
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd>
      <TableTd className={styles.table__td}>{dayjs().format()}</TableTd>
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

  const donutData = [
    { name: "Completed", value: 0, color: "#039855" },
    { name: "Canceled", value: 0, color: "#F79009" },
    { name: "Failed", value: 0, color: "#D92D20" },
    { name: "Other", value: 100, color: "#e4e4e4" },
  ];

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
    <main>
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Accounts", href: "/admin/accounts" },
          ...(!loading
            ? [
                {
                  title: `${account?.accountName}`,
                  href: `/admin/accounts/${params.id}`,
                },
              ]
            : []),
        ]}
      />

      <div className={styles.grid__container}>
        <Grid>
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
                      {loading ? (
                        <Skeleton h={10} w={100} />
                      ) : (
                        <Text className={styles.body__text}>
                          {account?.accountName || ""}
                        </Text>
                      )}

                      <Divider my="sm" />

                      <Text className={styles.body__title}>Account Number</Text>
                      {loading ? (
                        <Skeleton h={10} w={100} />
                      ) : (
                        <Text className={styles.body__text}>
                          {account?.accountNumber || ""}
                        </Text>
                      )}
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
                </div>
              </GridCol>

              <GridCol span={12} mih={170}>
                <CardOne
                  container
                  title="Account Balance"
                  stat={account?.accountBalance || 0}
                  colored
                  formatted
                  currency="EUR"
                  text={
                    <Text fz={10} c="#90A3BF">
                      From {dayjs(account?.createdAt).format("MMM DD, YYYY")} to{" "}
                      {dayjs().format("MMM DD, YYYY")}
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

              <TableScrollContainer
                className={styles.table__container}
                minWidth={500}
              >
                <Table className={styles.table} verticalSpacing="md">
                  {/* <TableTbody>{rows}</TableTbody> */}
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

              <Button
                component="a"
                href={`/admin/accounts/${account?.id}/transactions`}
                leftSection={<IconCircleChevronRight size={18} />}
                variant="transparent"
                color="#97AD05"
                fz={11}
                className={styles.table__cta}
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
                  chartLabel={donutData.reduce((prv, cur) => {
                    if (cur.name === "Other") return 0 + prv;
                    return cur.value + prv;
                  }, 0)}
                  size={203}
                  thickness={25}
                />
              </Flex>

              <Stack px={10} gap={15}>
                {donutData.map((item, index) => {
                  if (item.name === "Other") return;
                  return (
                    <Flex key={index} justify="space-between">
                      <Flex align="center" gap={5}>
                        <IconSquareFilled color={item.color} size={14} />
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
              </Stack>
            </Paper>
          </GridCol>
        </Grid>
      </div>
    </main>
  );
}
