"use client";
import { useEffect, useMemo, useState } from "react";

import { Text, TableTd, Paper, Box, Modal } from "@mantine/core";
import { TableTbody, TableTh, TableThead } from "@mantine/core";
import { Tooltip, rem, Button, Table } from "@mantine/core";
import { Stack, CopyButton, ActionIcon } from "@mantine/core";
import { Grid, GridCol, NativeSelect, TableTr } from "@mantine/core";
import { Flex, TableScrollContainer } from "@mantine/core";
import { DonutChart, LineChart, AreaChart } from "@mantine/charts";

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
import { useDisclosure } from "@mantine/hooks";
import DebitRequestModal from "./debit-requests/new/modal";
import { BadgeComponent } from "@/ui/components/Badge";

export default function Home() {
  const { loading, meta } = useUserAccounts();
  const { loading: debitLoading, requests } = useUserDebitRequests();
  const { loading: balanceLoading, balance } = useUserBalances();
  const { transactions } = useUserTransactions();

  const [opened, { open, close }] = useDisclosure(false);

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
      <TableTd className={styles.table__td}>
        <Flex align="center">
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            className={styles.table__td__icon}
          />
          {formatNumber(element.amount, true, "EUR")}
        </Flex>
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("DD MMM, YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        {/* <div
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
        </div> */}
        <BadgeComponent status={element.status} />
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

    transactions.map((trx) => {
      let successful = 0,
        pending = 0,
        failed = 0;

      const date = dayjs(trx.createdAt).format("MMM DD");
      // trx.status === "PENDING"
      //   ? (pending += trx.amount)
      //   : (successful += trx.amount);

      trx.status === "PENDING"
        ? (pending += trx.amount)
        : trx.status === "REJECTED"
        ? (failed += trx.amount)
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
      {/* <Breadcrumbs items={[{ title: "Dashboard", href: "/" }]} /> */}
      <Flex
        justify="space-between"
        align="center"
        className={styles.main__header}
      >
        <Flex direction="column">
          <Text fz={24} className={styles.main__header__text}>
            Welcome
          </Text>
          <Text fz={14} className={styles.main__header__subtext}>
            Here's an overview of your financial activities
          </Text>
        </Flex>

        <Button
          fz={12}
          className={styles.main__cta}
          variant="filled"
          color="#C1DD06"
        >
          Account Statement
        </Button>
      </Flex>

      <Flex className={styles.overview__container} direction="column">
        <Flex className={styles.container__header}>
          <Text fz={16} c="#1A1B20">
            Overview
          </Text>
        </Flex>

        <Flex className={styles.container__body} gap={30}>
          <Flex flex={1.5} direction="column" gap={10}>
            <Flex gap={10} align="center">
              <Text className={styles.body__text__header}>Total Balance</Text>
              <Button
                onClick={open}
                className={styles.debit__btn}
                variant="filled"
                color="#F9FCE6"
                fz={10}
                fw={600}
                rightSection={
                  <IconArrowUpRight
                    color="#758604"
                    size={13}
                    className={styles.table__td__icon}
                  />
                }
              >
                Debit Request
              </Button>
            </Flex>

            <Text className={styles.body__text} fz={24} fw={600}>
              {formatNumber(balance, true, "EUR")}
            </Text>
          </Flex>

          <Flex flex={1} direction="column" gap={10}>
            <Flex gap={10} align="center">
              <Text className={styles.body__text__header}>Total Accounts</Text>
            </Flex>

            <Text className={styles.body__text} fz={24} fw={600}>
              {meta?.total}
            </Text>
          </Flex>

          <Flex flex={1} direction="column" gap={10}>
            <Flex gap={10} align="center">
              <Text className={styles.body__text__header}>Active Accounts</Text>
            </Flex>

            <Text className={styles.body__text} fz={24} fw={600}>
              {meta?.active}
            </Text>
          </Flex>

          <Flex flex={1} direction="column" gap={10}>
            <Flex gap={10} align="center">
              <Text className={styles.body__text__header}>
                Inactive Accounts
              </Text>
            </Flex>

            <Text className={styles.body__text} fz={24} fw={600}>
              {meta?.inactive}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <div className={styles.grid__cards}>
        <Grid className={styles.grid__cards__two}>
          <GridCol span={8} mih={100}>
            <Paper mt={10} className={styles.payout__table}>
              <Flex
                style={{ borderBottom: "1px solid #f5f5f5" }}
                justify="space-between"
                align="center"
                pb={14}
              >
                <Text className={styles.table__text} lts={0.5} fz={16} fw={600}>
                  Debit Requests
                </Text>

                <Button
                  component="a"
                  href="/debit-requests"
                  variant="transparent"
                  color="#97AD05"
                  fz={11}
                  className={styles.table__cta}
                >
                  See all Debit Requests
                </Button>
              </Flex>

              <TableScrollContainer
                className={styles.table__container}
                minWidth={500}
              >
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
            </Paper>
          </GridCol>

          <GridCol span={4}>
            <Paper mt={10} className={styles.api__keys__container}>
              <Flex
                style={{ borderBottom: "1px solid #f5f5f5" }}
                justify="space-between"
                align="center"
                pb={14}
              >
                <Text fz={16} fw={600}>
                  API Keys
                </Text>
                {/* <Text>Test</Text> */}
              </Flex>

              <Stack mt={10} gap={0}>
                <Text fz={12} c="#98A2B3">
                  Test Key
                </Text>

                <Flex
                  className={styles.key__container}
                  justify="space-between"
                  align="center"
                  // px={10}
                >
                  <Text className={styles.key__container__text}>
                    {`${test ? test?.key.slice(0, 20) : ""}****************`}
                  </Text>

                  <Copy value={test?.key || ""} />
                </Flex>
              </Stack>

              <Stack mt={30} gap={0}>
                <Text fz={12} c="#98A2B3">
                  Live Key
                </Text>

                <Flex
                  className={styles.key__container}
                  justify="space-between"
                  align="center"
                  // px={10}
                >
                  <Text className={styles.key__container__text}>
                    {`${live ? live?.key.slice(0, 20) : ""}****************`}
                  </Text>

                  <Copy value={live?.key || ""} />
                </Flex>
              </Stack>
            </Paper>
          </GridCol>
        </Grid>

        <Grid>
          <GridCol span={8} mih={300}>
            <Paper className={styles.chart__container}>
              <div className={styles.container__text}>
                <Text fz={16} fw={600}>
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

              <AreaChart
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

          <GridCol span={4}>
            <Paper
              style={{ border: "1px solid #f5f5f5", height: "100%" }}
              p={10}
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

              <Flex justify="center" mt={37}>
                <DonutChart
                  startAngle={180}
                  endAngle={0}
                  // paddingAngle={4}
                  data={donutData}
                  chartLabel={formatNumber(
                    donutData.reduce((prv, cur) => {
                      return cur.value + prv;
                    }, 0),
                    true,
                    "EUR"
                  )}
                  size={200}
                  thickness={20}
                />
              </Flex>

              <Flex px={10} gap={15} mt={-30}>
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
        </Grid>
      </div>

      <Modal
        size="xl"
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
      >
        <DebitRequestModal close={close} />
      </Modal>
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
