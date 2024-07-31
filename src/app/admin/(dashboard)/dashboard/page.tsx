"use client";

import { useMemo, useState } from "react";
import {
  Grid,
  GridCol,
  NativeSelect,
  Text,
  TableScrollContainer,
  Button,
  Flex,
} from "@mantine/core";
import {
  Table,
  TableTr,
  TableTd,
  TableThead,
  TableTh,
  TableTbody,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import {
  IconArrowUpRight,
  IconCircleChevronRight,
  IconPointFilled,
} from "@tabler/icons-react";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { CardFour, CardOne, CardThree, CardTwo } from "@/ui/components/Cards";
import styles from "@/ui/styles/page.module.scss";

import { formatNumber } from "@/lib/utils";
import { useBusiness } from "@/lib/hooks/businesses";
import { useDebitRequests, useRequests } from "@/lib/hooks/requests";
import { useAccounts } from "@/lib/hooks/accounts";
import dayjs from "dayjs";

import EmptyImage from "@/assets/empty.png";
import Image from "next/image";

export default function Home() {
  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const { loading, meta, stats, statsMeta } = useBusiness({
    period: chartFrequency === "Monthly" ? "year" : "week",
  });
  const {
    loading: accountsLoading,
    meta: accountsMeta,
    accounts,
  } = useAccounts();
  const { loading: debitLoading, requests: debitRequests } = useDebitRequests();
  const {
    loading: requestsLoading,
    meta: requestMeta,
    requests,
  } = useRequests({ status: "PENDING" });

  const data = stats;

  const cardFourItems = useMemo(() => {
    if (loading) return [];

    return requests.slice(0, 3).map((request) => {
      return {
        title: request.Company.name,
        date: request.createdAt,
        type: request.accountType,
        status: request.status,
        subText: (
          <Text fz={10} c="var(--prune-text-gray-400)">
            Number of Request:{" "}
            <Text
              inherit
              fw={600}
              component="span"
              c="var(--prune-text-gray-700)"
            >
              {100}
            </Text>
          </Text>
        ),
        link: `/admin/account-requests/${request.id}`,
      };
    });
  }, [requests]);

  const tableData = [
    {
      AccName: "Matthew Philips",
      Biz: "C80 Limited",
      Amount: 200000,
      Status: "successful",
    },
    {
      AccName: "Agatha Goldie",
      Biz: "TechNexus",
      Amount: 300000,
      Status: "successful",
    },
    {
      AccName: "Omar Zeeda",
      Biz: "Fusion Works",
      Amount: 250000,
      Status: "successful",
    },
    {
      AccName: "Sharon Akindele",
      Biz: "Azure Wave",
      Amount: 400000,
      Status: "successful",
    },
    {
      AccName: "Bethel Teddy",
      Biz: "NanoSphere",
      Amount: 150000,
      Status: "successful",
    },
  ];

  const cardTwoItems = useMemo(() => {
    if (debitLoading) return [];

    return debitRequests.map((request) => {
      return {
        title: request.Account.Company.name,
        amount: request.amount,
        // subText: `Date Created: ${dayjs(request.createdAt).format(
        //   "DD MMM, YYYY"
        // )}`,
        subText: (
          <Text fz={10} c="var(--prune-text-gray-400)">
            Number of Request:{" "}
            <Text
              inherit
              fw={600}
              component="span"
              c="var(--prune-text-gray-700)"
            >
              {100}
            </Text>
          </Text>
        ),
        // subText: "Date Created: 24th May, 2024",
        status: request.status,
      };
    });
  }, [debitRequests]);

  const rows = tableData.map((element) => (
    <TableTr key={element.AccName}>
      <TableTd className={styles.table__td}>{element.AccName}</TableTd>
      <TableTd className={styles.table__td}>{element.Biz}</TableTd>
      <TableTd className={`${styles.table__td}`}>
        <IconArrowUpRight
          color="#D92D20"
          size={16}
          className={styles.table__td__icon}
        />
        {formatNumber(element.Amount)}
        {/* <Text fz={12}></Text> */}
      </TableTd>
      <TableTd className={styles.table__td}>
        <div className={styles.table__td__status}>
          <IconPointFilled size={14} color="#12B76A" />
          <Text tt="capitalize" fz={12} c="#12B76A">
            {element.Status}
          </Text>
        </div>
      </TableTd>
    </TableTr>
  ));

  const cards = [
    {
      title: "Total Business",
      stat: loading ? 0 : meta?.total || 0,
      text: (
        <>
          There is a{" "}
          <Text bg="#ECFDF3" c="#12B76A" fz={9} span>
            +100%
          </Text>{" "}
          increase this month and a total of{" "}
          <Text bg="#FBFEE6" c="#97AD05" fz={9} span>
            {statsMeta?.weekCount || 0}
          </Text>{" "}
          new businesses this week
        </>
      ),
    },
  ];

  return (
    <main className={styles.main}>
      <Breadcrumbs items={[{ title: "Dashboard", href: "/" }]} />

      <div className={styles.grid__cards}>
        <Grid>
          <GridCol span={{ lg: 3, md: 6 }}>
            <CardOne
              loading={loading}
              title="Total Business"
              stat={loading ? 0 : meta?.total || 0}
              // link="/admin/businesses"
              // colored
              text={
                <>
                  There is a{" "}
                  <Text bg="#ECFDF3" c="#12B76A" fz={9} span>
                    +100%
                  </Text>{" "}
                  increase this month and a total of{" "}
                  <Text bg="#FBFEE6" c="#97AD05" fz={9} span>
                    {statsMeta?.weekCount || 0}
                  </Text>{" "}
                  new businesses this week
                </>
              }
            />
          </GridCol>

          <GridCol span={{ lg: 3, md: 6 }}>
            <CardOne
              loading={requestsLoading}
              stat={requestMeta?.approvedRequests || 0}
              title="Approved Accounts"
              text={
                <>
                  This shows the total number of approved account requests in
                  the system
                </>
              }
            />
          </GridCol>

          <GridCol span={{ lg: 3, md: 6 }}>
            <CardOne
              loading={requestsLoading}
              stat={requestMeta?.pendingRequests || 0}
              title="Pending Accounts"
              text={
                <>
                  This shows the total number of pending account requests in the
                  system
                </>
              }
            />
          </GridCol>
          <GridCol span={{ lg: 3, md: 6 }}>
            <CardOne
              title="Account Balance"
              stat={accounts.reduce((prv, curr) => {
                return prv + curr.accountBalance;
              }, 0)}
              formatted
              // colored
              currency="EUR"
              loading={accountsLoading}
              text={
                <>{`From Jul 01, 2024 to ${dayjs().format("MMM DD, YYYY")}`}</>
              }
            />
          </GridCol>
        </Grid>

        <Grid className={styles.grid__cards__two}>
          <GridCol
            className={styles.grid__cards__charts}
            span={{ base: 12, sm: 12, md: 12, lg: 9 }}
            mt={5}
          >
            <div className={styles.chart__container}>
              <div className={styles.container__text}>
                <Text tt="uppercase" fz={10} fw={600} className={styles.text}>
                  Business Registration Statistics
                </Text>

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
              </div>

              <BarChart
                style={{ marginLeft: "-12px" }}
                h={230}
                data={data}
                dataKey={chartFrequency === "Monthly" ? "month" : "day"}
                barProps={{ barSize: 20, radius: 3 }}
                series={[{ name: "registration", color: "#97AD05" }]}
                tickLine="y"
              />
            </div>

            <Grid mt={15}>
              <GridCol span={{ base: 12, xs: 12, sm: 12, md: 5, lg: 5 }}>
                <CardTwo
                  title="Debit Requests"
                  link="/admin/requests"
                  items={cardTwoItems}
                />
              </GridCol>

              <GridCol
                span={{ base: 12, xs: 12, sm: 12, md: 7, lg: 7 }}
                mih={345}
              >
                <div className={styles.payout__table}>
                  <Text
                    className={styles.table__text}
                    lts={0.5}
                    fz={10}
                    fw={600}
                  >
                    Payout History
                  </Text>

                  {/* <TableScrollContainer minWidth={500}>
                    <Table className={styles.table} verticalSpacing="lg">
                      <TableThead>
                        <TableTr>
                          <TableTh className={styles.table__th}>
                            Account Name
                          </TableTh>
                          <TableTh className={styles.table__th}>
                            Business name
                          </TableTh>
                          <TableTh className={styles.table__th}>Amount</TableTh>
                          <TableTh className={styles.table__th}>Status</TableTh>
                        </TableTr>
                      </TableThead>
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
                  </Button> */}

                  <Flex
                    style={{ flexGrow: 1 }}
                    direction="column"
                    align="center"
                    justify="center"
                    mt={24}
                  >
                    <Image
                      src={EmptyImage}
                      alt="no content"
                      width={120}
                      height={96}
                    />
                    <Text mt={14} fz={10} c="#1D2939">
                      No payout history.
                    </Text>
                    {/* <Text fz={10} c="#667085">
              When an account is created, it will appear here
            </Text> */}
                  </Flex>
                </div>
              </GridCol>
            </Grid>
          </GridCol>

          <GridCol
            className={styles.grid__cards__side}
            span={{ md: 12, lg: 3 }}
            mt={5}
          >
            <Grid className={styles.grid__cards__grid}>
              <GridCol
                span={{ lg: 12, md: 3.5 }}
                className={styles.grid__card}
                mih={200}
              >
                <CardThree
                  title="Account Status"
                  bg="#ECFDF3"
                  color="#12B76A"
                  minTitle="Active Accounts"
                  amount={accountsMeta?.active || 0}
                  percentage="0"
                  subTitle="Total Number of Active Accounts for all Business"
                />
              </GridCol>
              <GridCol span={{ lg: 12, md: 3.5 }} className={styles.grid__card}>
                <CardThree
                  title="Account Status"
                  bg="#FEF3F2"
                  color="#D92D20"
                  minTitle="In-active Accounts"
                  amount={accountsMeta?.inactive || 0}
                  percentage="0"
                  subTitle="Total Number of In-active Accounts for all Business"
                />
              </GridCol>
              <GridCol span={{ lg: 12, md: 5 }} className={styles.grid__card}>
                <CardFour
                  title="Pending Account Requests"
                  link="/admin/account-requests"
                  items={cardFourItems}
                />
              </GridCol>
            </Grid>
          </GridCol>
        </Grid>
      </div>
    </main>
  );
}
