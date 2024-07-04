"use client";

import { useParams } from "next/navigation";

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
import { useSingleUserAccount } from "@/lib/hooks/accounts";

export default function Account() {
  const params = useParams<{ id: string }>();
  const { account, loading } = useSingleUserAccount(params.id);
  const [chartFrequency, setChartFrequency] = useState("Monthly");

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

  const rows = tableData.map((element) => (
    <TableTr key={element.AccName}>
      <TableTd className={styles.table__td}>{element.AccName}</TableTd>
      <TableTd className={styles.table__td}>{element.Biz}</TableTd>
      <TableTd className={styles.table__td}>{element.Date}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        <IconArrowUpRight
          color="#D92D20"
          size={16}
          className={styles.table__td__icon}
        />
        {formatNumber(element.Amount)}
        {/* <Text fz={12}></Text> */}
      </TableTd>
      <TableTd className={styles.table__td}>{element.AccNum}</TableTd>
      <TableTd className={styles.table__td}>
        <div className={styles.table__td__status}>
          {/* <IconPointFilled size={14} color="#12B76A" /> */}
          <Text
            tt="capitalize"
            fz={12}
            c={element.Status === "failed" ? "#D92D20" : "#12B76A"}
          >
            {element.Status}
          </Text>
        </div>
      </TableTd>
    </TableTr>
  ));

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
    { name: "Completed", value: 16000, color: "#039855" },
    { name: "Canceled", value: 5000, color: "#F79009" },
    { name: "Failed", value: 9000, color: "#D92D20" },
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

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Dashboard", href: "/dashboard" },
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

      <div className={styles.grid__container}>
        <Grid>
          <GridCol span={3}>
            <Grid>
              <GridCol span={12}>
                <Paper withBorder className={styles.card__one__container}>
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
                  <Button
                    fz={11}
                    td="underline"
                    variant="transparent"
                    rightSection={<IconArrowRight size={14} />}
                    color="#97AD05"
                  >
                    View Documents
                  </Button>
                </Paper>
              </GridCol>

              <GridCol span={12} mih={170}>
                <CardOne
                  withBorder
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
            <Paper withBorder className={styles.payout__table}>
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
            </Paper>
          </GridCol>

          <GridCol span={8} mih={500}>
            <Paper withBorder py={20} h="100%" px={14}>
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
            <Paper withBorder py={20} h="100%" px={16}>
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
        </Grid>
      </div>
    </main>
  );
}
