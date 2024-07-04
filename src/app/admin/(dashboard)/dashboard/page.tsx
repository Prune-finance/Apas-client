"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  GridCol,
  NativeSelect,
  Text,
  TableScrollContainer,
  Button,
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
import { useRequests } from "@/lib/hooks/requests";
import { useAccounts } from "@/lib/hooks/accounts";

export default function Home() {
  const { loading, meta } = useBusiness();
  const { loading: accountsLoading, meta: accountsMeta } = useAccounts();

  const {
    loading: requestsLoading,
    meta: requestMeta,
    requests,
  } = useRequests("PENDING");
  const [chartFrequency, setChartFrequency] = useState("Monthly");

  const data = [
    { month: "Jan", registration: 300 },
    { month: "Feb", registration: 900 },
    { month: "Mar", registration: 500 },
    { month: "Apr", registration: 350 },
    { month: "May", registration: 1000 },
    { month: "Jun", registration: 800 },
    { month: "Jul", registration: 200 },
    { month: "Aug", registration: 400 },
    { month: "Sep", registration: 500 },
    { month: "Oct", registration: 800 },
    { month: "Nov", registration: 900 },
    { month: "Dec", registration: 100 },
  ];

  const weekData = [
    { day: "Mon", registration: 280 },
    { day: "Tue", registration: 349 },
    { day: "Wed", registration: 936 },
    { day: "Thu", registration: 350 },
    { day: "Fri", registration: 2460 },
    { day: "Sat", registration: 726 },
    { day: "Sun", registration: 1049 },
  ];

  const cardTwoItems = [
    {
      title: "C80 Limited",
      amount: 200000000,
      subText: "Date Created: 24th May, 2024",
      status: "pending",
    },
    {
      title: "TechNexus",
      amount: 300000000,
      subText: "Date Created: 23rd May, 2024",
      status: "approved",
    },
    {
      title: "CyberPulse Systems",
      amount: 25000000,
      subText: "Date Created: 22nd May, 2024",
      status: "rejected",
    },
    {
      title: "Infinity Ventures",
      amount: 25000000,
      subText: "Date Created: 19th May, 2024",
      status: "rejected",
    },
    {
      title: "Digital Horizons",
      amount: 100000000,
      subText: "Date Created: 14th May, 2024",
      status: "pending",
    },
  ];

  const cardFourItems = useMemo(() => {
    if (loading) return [];

    return requests.map((request) => {
      return {
        title: request.Company.name,
        date: request.createdAt,
        type: request.accountType,
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
              link="/admin/businesses"
              colored
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
              stat={0}
              formatted
              colored
              text={<>From Jan 01, 2022 to Jan 31, 2022</>}
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
                data={chartFrequency === "Monthly" ? data : weekData}
                dataKey={chartFrequency === "Monthly" ? "month" : "day"}
                barProps={{ barSize: 20, radius: 3 }}
                series={[{ name: "registration", color: "#97AD05" }]}
                tickLine="y"
              />
            </div>

            <Grid mt={15}>
              <GridCol span={{ base: 12, xs: 12, sm: 12, md: 5, lg: 5 }}>
                <CardTwo title="Debit Requests" link="/" items={cardTwoItems} />
              </GridCol>

              <GridCol
                span={{ base: 12, xs: 12, sm: 12, md: 7, lg: 7 }}
                mih={400}
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

                  <TableScrollContainer minWidth={500}>
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
                  </Button>
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
                  percentage="+23"
                  subTitle="Total Number of Active Accounts of All Business"
                />
              </GridCol>
              <GridCol span={{ lg: 12, md: 3.5 }} className={styles.grid__card}>
                <CardThree
                  title="Account Status"
                  bg="#FEF3F2"
                  color="#D92D20"
                  minTitle="In-active Accounts"
                  amount={accountsMeta?.inactive || 0}
                  percentage="-10"
                  subTitle="Total Number of In-active Accounts of All Business"
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
