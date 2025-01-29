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
  Box,
  Group,
  Space,
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
import {
  CardFour,
  CardOne,
  CardThree,
  CardTwo,
  DebitRequestCard,
  SeeAll,
} from "@/ui/components/Cards";
import styles from "@/ui/styles/page.module.scss";

import { formatNumber } from "@/lib/utils";
import { useBusiness } from "@/lib/hooks/businesses";
import { useDebitRequests, useRequests } from "@/lib/hooks/requests";
import { useAccounts } from "@/lib/hooks/accounts";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

import EmptyImage from "@/assets/empty.png";
import Image from "next/image";
import Link from "next/link";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import { DynamicSkeleton2, IssuedAccountTableHeaders } from "@/lib/static";
import {
  usePayoutTransactions,
  useTransactions,
} from "@/lib/hooks/transactions";
import { AmountGroup } from "@/ui/components/AmountGroup";
import { BadgeComponent } from "@/ui/components/Badge";
import { IssuedTransactionTableRows } from "@/ui/components/TableRows";
import Transaction from "@/lib/store/transaction";
import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import useAxios from "@/lib/hooks/useAxios";

export default function Home() {
  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const { loading, meta, stats, statsMeta } = useBusiness({
    period: chartFrequency === "Monthly" ? "year" : "week",
  });
  const {
    data: selectedTrxData,
    close,
    opened: openedDrawer,
    open,
    setData,
  } = Transaction();
  const {
    loading: accountsLoading,
    meta: accountsMeta,
    accounts,
  } = useAccounts();
  const {
    loading: debitLoading,
    requests: debitRequests,
    revalidate: revalidateDebitReq,
  } = useDebitRequests({ limit: 4 });
  const {
    loading: requestsLoading,
    meta: requestMeta,
    requests,
  } = useRequests({ status: "PENDING" });

  const { loading: loadingTrx, transactions } = useTransactions(undefined, {
    limit: 4,
  });

  const { loading: loadingPayoutTrx, transactions: payoutTrx } =
    usePayoutTransactions({ limit: 4 });

  const data = stats;

  const cardFourItems = useMemo(() => {
    if (loading) return [];

    return requests.slice(0, 4).map((request) => {
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
  }, [requests, loading]);

  const cardTwoItems = useMemo(() => {
    if (debitLoading) return [];

    return debitRequests.slice(0, 3).map((request) => {
      return {
        title: request.Account.Company.name,
        amount: request.amount,
        subText: `Date Created: ${dayjs(request.createdAt).format(
          "DD MMM, YYYY"
        )}`,
        // subText: (
        //   <Text fz={10} c="var(--prune-text-gray-400)">
        //     Number of Request:{" "}
        //     <Text
        //       inherit
        //       fw={600}
        //       component="span"
        //       c="var(--prune-text-gray-700)"
        //     >
        //       {100}
        //     </Text>
        //   </Text>
        // ),
        // subText: "Date Created: 24th May, 2024",
        status: request.status,
      };
    });
  }, [debitRequests, debitLoading]);

  const payoutRows = payoutTrx.map((element) => (
    <TableTr
      key={element.id}
      style={{ cursor: "pointer" }}
      onClick={() => {
        open();
        setData(element);
      }}
    >
      <TableTd className={styles.table__td}>{element.senderName}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientName || element.recipientIban}
      </TableTd>

      <TableTd className={styles.table__td}>
        <AmountGroup
          type={element.type}
          amount={element.amount}
          fz={12}
          fw={400}
        />
      </TableTd>

      <TableTd className={styles.table__td}>
        <BadgeComponent status={element.status} fz={10} />
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
      {/* <Breadcrumbs items={[{ title: "Dashboard", href: "/" }]} /> */}

      <div className={styles.grid__cards}>
        <Grid>
          <GridCol span={9}>
            <Grid>
              <GridCol span={{ lg: 4, md: 6 }}>
                <CardOne
                  loading={loading}
                  title="Total Business"
                  stat={loading ? 0 : meta?.total || 0}
                  link="/admin/businesses"
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

              <GridCol span={{ lg: 4, md: 6 }}>
                <Link href="/admin/account-requests?status=Active">
                  <CardOne
                    loading={requestsLoading}
                    stat={requestMeta?.approvedRequests || 0}
                    title="Approved Account Requests"
                    text={
                      <>
                        This shows the total number of approved account requests
                        for all businesses
                      </>
                    }
                  />
                </Link>
              </GridCol>

              <GridCol span={{ lg: 4, md: 6 }}>
                <Link href="/admin/account-requests?status=PENDING">
                  <CardOne
                    loading={requestsLoading}
                    stat={requestMeta?.pendingRequests || 0}
                    title="Pending Account Requests"
                    text={
                      <>
                        This shows the total number of pending account requests
                        for all businesses
                      </>
                    }
                  />
                </Link>
              </GridCol>

              <GridCol span={{ lg: 12, md: 9 }}>
                <Grid className={styles.grid__cards__two}>
                  <GridCol
                    className={styles.grid__cards__charts}
                    span={{ base: 12, sm: 12, md: 12, lg: 12 }}
                    mt={5}
                  >
                    <div
                      className={styles.chart__container}
                      style={{ border: "1px solid #f2f4f7" }}
                    >
                      <div className={styles.container__text}>
                        <Text
                          tt="uppercase"
                          fz={10}
                          fw={600}
                          className={styles.text}
                        >
                          Business Overview
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

                    <Box style={{ border: "1px solid #f2f4f7" }} p={15} mt={15}>
                      <Group justify="space-between">
                        <Text
                          tt="uppercase"
                          fz={10}
                          fw={600}
                          className={styles.text}
                        >
                          Transactions
                        </Text>

                        <Link href="/admin/transactions?tab=issued-accounts">
                          <SeeAll />
                        </Link>
                      </Group>

                      <TableComponent
                        head={IssuedAccountTableHeaders}
                        rows={
                          <IssuedTransactionTableRows
                            data={transactions.slice(0, 4)}
                            searchProps={[
                              "senderIban",
                              "senderName",
                              "recipientIban",
                              "recipientName",
                              "reference",
                            ]}
                            search=""
                          />
                        }
                        loading={loadingTrx}
                        noBg
                      />

                      <EmptyTable
                        loading={loadingTrx}
                        rows={transactions}
                        title="There is no transaction"
                        text="When a transaction is created it will appear here"
                      />
                    </Box>

                    <Grid mt={15}>
                      <GridCol
                        span={{ base: 12, xs: 12, sm: 12, md: 7, lg: 6 }}
                        mih={345}
                      >
                        <div
                          className={styles.payout__table}
                          style={{ border: "1px solid #f2f4f7" }}
                        >
                          <Flex justify="space-between" align="center">
                            <Text
                              className={styles.table__text}
                              lts={0.5}
                              fz={10}
                              fw={600}
                            >
                              Payout History
                            </Text>

                            <Link
                              href={"/admin/transactions?tab=payout-accounts"}
                            >
                              <SeeAll />
                            </Link>
                          </Flex>

                          {(loadingPayoutTrx || payoutTrx.length > 0) && (
                            <TableScrollContainer minWidth={500}>
                              <Table
                                verticalSpacing="md"
                                layout="fixed"
                                styles={{
                                  th: { fontWeight: 600, fontSize: 10 },
                                  td: { fontSize: 10 },
                                }}
                              >
                                <TableThead>
                                  <TableTr>
                                    {payoutHeaders.map((header, index) => (
                                      <TableTh
                                        key={index}
                                        className={styles.table__th}
                                      >
                                        {header}
                                      </TableTh>
                                    ))}
                                  </TableTr>
                                </TableThead>
                                <TableTbody
                                  className={styles.table__td}
                                  style={{ wordBreak: "break-word" }}
                                >
                                  {loadingPayoutTrx
                                    ? DynamicSkeleton2(payoutHeaders.length)
                                    : payoutRows}
                                </TableTbody>
                              </Table>
                            </TableScrollContainer>
                          )}

                          {!loadingPayoutTrx && payoutTrx.length === 0 && (
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
                            </Flex>
                          )}
                          {/* <Text fz={10} c="#667085">
              When an account is created, it will appear here
            </Text> */}
                        </div>
                      </GridCol>

                      <GridCol
                        span={{ base: 12, xs: 12, sm: 12, md: 5, lg: 6 }}
                      >
                        <DebitRequestCard
                          title="Debit Requests"
                          link="/admin/requests"
                          stat={10}
                          // withBorder
                          requests={debitRequests.slice(0, 4)}
                          // requests={[]}
                          container
                          loading={debitLoading}
                          revalidate={revalidateDebitReq}
                        />
                        {/* <Space my={20} />
                        <CardTwo
                          title="Debit Requests"
                          link="/admin/requests"
                          items={cardTwoItems}
                        /> */}
                      </GridCol>
                    </Grid>
                  </GridCol>
                </Grid>
              </GridCol>

              {/* <GridCol span={{ lg: 3, md: 6 }}> */}
              {/* <Link href="/admin/accounts?status=Frozen"> */}
              {/* <CardOne
              loading={requestsLoading}
              stat={requestMeta?.inactiveAccounts || 0}
              title="Deactivated Accounts"
            /> */}
              {/* </Link> */}
              {/* </GridCol> */}

              {/* <GridCol span={{ lg: 3, md: 6 }}>
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
          </GridCol> */}
            </Grid>
          </GridCol>

          <GridCol span={3}>
            <Grid>
              {/* Grid for Account Status */}

              <GridCol
                className={styles.grid__cards__side}
                span={{ md: 12, lg: 12 }}
                // mt={5}
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
                      // subTitle="Total Number of Active Accounts for all Business"
                    />
                  </GridCol>

                  <GridCol
                    span={{ lg: 12, md: 3.5 }}
                    className={styles.grid__card}
                  >
                    <CardThree
                      title="Account Status"
                      bg="#EAECF0"
                      color="#667085"
                      minTitle="In-active Accounts"
                      amount={accountsMeta?.inactive || 0}
                      percentage="0"
                      // subTitle="Total Number of In-active Accounts for all Business"
                    />
                  </GridCol>

                  <GridCol
                    span={{ lg: 12, md: 3.5 }}
                    className={styles.grid__card}
                    mih={200}
                  >
                    <CardThree
                      title="Account Status"
                      bg="#FEF3F2"
                      color="#D92D20"
                      minTitle="Deactivated Accounts"
                      amount={accountsMeta?.deactivated || 0}
                      percentage="0"
                      // subTitle="Total Number of Active Accounts for all Business"
                    />
                  </GridCol>

                  <GridCol
                    span={{ lg: 12, md: 3.5 }}
                    className={styles.grid__card}
                    mih={200}
                  >
                    <CardThree
                      title="Account Status"
                      bg="#e6f0ff"
                      color="#0047b3"
                      minTitle="Frozen Accounts"
                      amount={accountsMeta?.frozen || 0}
                      percentage="0"
                      // subTitle="Total Number of Active Accounts for all Business"
                    />
                  </GridCol>

                  <GridCol
                    span={{ lg: 12, md: 5 }}
                    className={styles.grid__card}
                  >
                    <CardFour
                      title="Account Creation"
                      link="/admin/account-requests"
                      items={cardFourItems}
                    />
                  </GridCol>
                </Grid>
              </GridCol>
            </Grid>
          </GridCol>
        </Grid>
      </div>

      {selectedTrxData && (
        <TransactionDrawer
          opened={openedDrawer}
          close={close}
          selectedRequest={selectedTrxData}
        />
      )}
    </main>
  );
}

const payoutHeaders = ["Senders name", "Beneficiary", "Amount", "Status"];
