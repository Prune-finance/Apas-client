"use client";
import { useEffect, useMemo, useState } from "react";

import { Text, TableTd, Paper } from "@mantine/core";
import { TableTbody, TableTh, TableThead } from "@mantine/core";
import { Tooltip, rem, Button, Table } from "@mantine/core";
import { Stack, CopyButton, ActionIcon } from "@mantine/core";
import { Grid, GridCol, NativeSelect, TableTr } from "@mantine/core";
import { Flex, TableScrollContainer } from "@mantine/core";
import { DonutChart, LineChart } from "@mantine/charts";

import { IconCheck, IconCircleChevronRight } from "@tabler/icons-react";
import { IconArrowUpRight, IconCopy } from "@tabler/icons-react";
import { IconPointFilled, IconSquareFilled } from "@tabler/icons-react";

import { formatNumber } from "@/lib/utils";
import { DynamicSkeleton2, UserDashboardData } from "@/lib/static";
import { useUserAccounts } from "@/lib/hooks/accounts";

import { CardOne, CardOneBtn } from "@/ui/components/Cards";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/user/home.module.scss";
import { useUserDebitRequests } from "@/lib/hooks/requests";
import { useUserBalances } from "@/lib/hooks/balance";
import { useUserTransactions } from "@/lib/hooks/transactions";
import User from "@/lib/store/user";
import dayjs from "dayjs";
import axios from "axios";
import { Key } from "./settings/(tabs)/keys";

export default function Home() {
  const { loading, meta } = useUserAccounts();
  const { loading: debitLoading, requests } = useUserDebitRequests();
  const { loading: balanceLoading, balance } = useUserBalances();
  const { transactions } = useUserTransactions();

  const [keys, setKeys] = useState<Key[]>([]);
  const { user } = User();

  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const { live, test } = useMemo(() => {
    const live = keys.find((key) => key.staging === "LIVE");
    const test = keys.find((key) => key.staging === "TEST");

    return { live, test };
  }, [keys]);

  const fetchBusinessSecrets = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/key/secrets`,
        { withCredentials: true }
      );

      setKeys(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBusinessSecrets();
  }, []);

  const rows = requests.slice(0, 2).map((element) => (
    <TableTr key={element.id}>
      <TableTd className={styles.table__td}>
        {element.Account.accountName}
      </TableTd>
      <TableTd className={styles.table__td}>{element.amount}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        <IconArrowUpRight
          color="#D92D20"
          size={16}
          className={styles.table__td__icon}
        />
        {formatNumber(element.amount, true, "EUR")}
        {/* <Text fz={12}></Text> */}
      </TableTd>
      <TableTd className={styles.table__td}>
        <div
          className={styles.table__td__status}
          style={{
            background:
              element.status === "PENDING"
                ? "#FFFAEB"
                : element.status === "REJECTED"
                ? "#FCF1F2"
                : "#ECFDF3",
          }}
        >
          <IconPointFilled
            size={14}
            color={
              element.status === "PENDING"
                ? "#C6A700"
                : element.status === "REJECTED"
                ? "#D92D20"
                : "#12B76A"
            }
          />
          <Text
            tt="capitalize"
            fz={12}
            c={
              element.status === "PENDING"
                ? "#C6A700"
                : element.status === "REJECTED"
                ? "#D92D20"
                : "#12B76A"
            }
          >
            {element.status.toLowerCase()}
          </Text>
        </div>
      </TableTd>
    </TableTr>
  ));

  const lineData = useMemo(() => {
    const arr: {
      date: string;
      successful: number;
      failed: number;
      pending: number;
    }[] = [];

    transactions.reverse().map((trx) => {
      let successful = 0,
        pending = 0,
        failed = 0;

      const date = dayjs(trx.createdAt).format("MMM DD");
      trx.status === "PENDING"
        ? (pending += trx.amount)
        : (successful += trx.amount);

      arr.push({ date, successful, pending, failed });
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

  return (
    <main className={styles.main}>
      <Breadcrumbs items={[{ title: "Dashboard", href: "/" }]} />

      <div className={styles.grid__cards}>
        <Grid>
          <GridCol span={9}>
            <Grid>
              <GridCol span={{ lg: 4, md: 6 }}>
                <CardOne
                  withBorder
                  title="Total Accounts"
                  stat={meta?.total || 0}
                  link="/accounts"
                  colored
                  loading={loading}
                  text={
                    <>
                      There is a{" "}
                      <Text bg="#ECFDF3" c="#12B76A" fz={9} span>
                        +23%
                      </Text>{" "}
                      increase this month and a total of{" "}
                      <Text bg="#FBFEE6" c="#97AD05" fz={9} span>
                        17
                      </Text>{" "}
                      new businesses this week
                    </>
                  }
                />
              </GridCol>

              <GridCol span={{ lg: 4, md: 6 }}>
                <CardOne
                  withBorder
                  title="Active Accounts"
                  loading={loading}
                  stat={meta?.active || 0}
                  text={
                    <>This shows the total number of businesses in the system</>
                  }
                />
              </GridCol>

              <GridCol span={{ lg: 4, md: 6 }}>
                <CardOne
                  withBorder
                  title="Inactive Accounts"
                  stat={meta?.inactive || 0}
                  loading={loading}
                  text={
                    <>This shows the total number of businesses in the system</>
                  }
                />
              </GridCol>

              <GridCol span={12}>
                <Paper withBorder className={styles.chart__container}>
                  <div className={styles.container__text}>
                    <Text
                      tt="uppercase"
                      fz={10}
                      fw={600}
                      className={styles.text}
                    >
                      Transaction Statistics
                    </Text>

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
                  </div>

                  <LineChart
                    h={250}
                    curveType="bump"
                    data={lineData}
                    dataKey="date"
                    series={[
                      { name: "successful", color: "#22C55E" },
                      { name: "failed", color: "#D92D20" },
                      { name: "pending", color: "#F79009" },
                    ]}
                  />
                </Paper>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol span={3}>
            <CardOneBtn
              withBorder
              title="Account Balance"
              stat={balance}
              loading={balanceLoading}
              formatted
              colored
              btnLink="/debit-requests/new"
              text={
                <>
                  From {dayjs(user?.createdAt).format("MMM DD, YYYY")} to{" "}
                  {dayjs().format("MMM DD, YYYY")}
                </>
              }
            />

            <Paper withBorder p={10} mt={15}>
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
                    return cur.value + prv;
                  }, 0)}
                  size={103}
                  thickness={15}
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
                        {formatNumber(item.value, true, "EUR")}
                      </Text>
                    </Flex>
                  );
                })}
              </Stack>
            </Paper>
          </GridCol>
        </Grid>

        <Grid className={styles.grid__cards__two}>
          <GridCol span={4}>
            <Paper withBorder mt={10} className={styles.api__keys__container}>
              <Flex>
                <Text fz={10} fw={600}>
                  API KEYS
                </Text>
                {/* <Text>Test</Text> */}
              </Flex>

              <Stack mt={15} gap={0}>
                <Text fz={12} c="#98A2B3">
                  Test Key
                </Text>

                <Flex
                  mt={7}
                  className={styles.key__container}
                  justify="space-between"
                  align="center"
                  px={10}
                >
                  <Text className={styles.key__container__text}>
                    {`${test ? test?.key.slice(0, 15) : ""}****************`}
                  </Text>

                  <Copy value="" />
                </Flex>
              </Stack>

              <Stack mt={30} gap={0}>
                <Text fz={12} c="#98A2B3">
                  Live Key
                </Text>

                <Flex
                  mt={7}
                  className={styles.key__container}
                  justify="space-between"
                  align="center"
                  px={10}
                >
                  <Text className={styles.key__container__text}>
                    {`${live ? live?.key.slice(0, 15) : ""}****************`}
                  </Text>

                  <Copy value="" />
                </Flex>
              </Stack>
            </Paper>
          </GridCol>

          <GridCol span={8} mih={200}>
            <Paper mt={10} withBorder className={styles.payout__table}>
              <Text className={styles.table__text} lts={0.5} fz={10} fw={600}>
                Debit Requests
              </Text>

              <TableScrollContainer minWidth={500}>
                <Table className={styles.table} verticalSpacing="xs">
                  <TableThead>
                    <TableTr>
                      <TableTh className={styles.table__th}>
                        Account Name
                      </TableTh>
                      <TableTh className={styles.table__th}>Amount</TableTh>
                      <TableTh className={styles.table__th}>
                        Date Created
                      </TableTh>
                      <TableTh className={styles.table__th}>Status</TableTh>
                    </TableTr>
                  </TableThead>
                  <TableTbody>
                    {debitLoading ? DynamicSkeleton2(4) : rows}
                  </TableTbody>
                </Table>
              </TableScrollContainer>

              <Button
                component="a"
                href="/debit-requests"
                leftSection={<IconCircleChevronRight size={18} />}
                variant="transparent"
                color="#97AD05"
                fz={11}
              >
                See all Debit Transactions
              </Button>
            </Paper>
          </GridCol>
        </Grid>
      </div>
    </main>
  );
}

const Copy = ({ value }: { value: string }) => {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
          <ActionIcon
            color={copied ? "teal" : "gray"}
            variant="subtle"
            onClick={copy}
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
  );
};
