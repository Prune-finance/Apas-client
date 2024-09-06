"use client";

import { useParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import {
  Avatar,
  Flex,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";

import { useState } from "react";

import { useSingleUserAccount } from "@/lib/hooks/accounts";
import { TransactionType, useUserTransactions } from "@/lib/hooks/transactions";

import { useDisclosure } from "@mantine/hooks";
import DebitRequestModal from "../../debit-requests/new/modal";
import { BadgeComponent } from "@/ui/components/Badge";
import { SingleAccountBody } from "@/ui/components/SingleAccount";
import { PrimaryBtn } from "@/ui/components/Buttons";

export default function Account() {
  const params = useParams<{ id: string }>();
  const { account, loading } = useSingleUserAccount(params.id);
  const { loading: trxLoading, transactions } = useUserTransactions(params.id);
  const [chartFrequency, setChartFrequency] = useState("Monthly");

  const [opened, { open, close }] = useDisclosure(false);

  console.log({ account });

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/accounts" },
          { title: "Issued Accounts", href: "/accounts" },
          {
            title: account?.accountName || "",
            href: `/accounts/${params.id}`,
            loading: loading,
          },
        ]}
      />

      <Flex
        justify="space-between"
        align="center"
        className={styles.main__header}
      >
        <Group gap={12} align="center">
          {!loading ? (
            <Avatar
              size="lg"
              color="var(--prune-primary-700)"
              variant="filled"
            >{`${account?.firstName.charAt(0)}${account?.lastName.charAt(
              0
            )}`}</Avatar>
          ) : (
            <Skeleton circle h={50} w={50} />
          )}

          <Stack gap={2}>
            {!loading ? (
              <Text fz={24} className={styles.main__header__text} m={0} p={0}>
                {account?.accountName}
              </Text>
            ) : (
              <Skeleton h={10} w={100} />
            )}

            {!loading ? (
              <Text
                fz={10}
                fw={400}
                className={styles.main__header__text}
                m={0}
                p={0}
              >
                {account?.accountNumber ?? ""}
              </Text>
            ) : (
              <Skeleton h={10} w={50} />
            )}
          </Stack>

          {!loading ? (
            <BadgeComponent status={account?.status ?? ""} active />
          ) : (
            <Skeleton w={60} h={10} />
          )}
        </Group>

        <Flex gap={10}>
          {/* <Button
            fz={12}
            className={styles.main__cta}
            variant="filled"
            color="#C1DD06"
          >
            Freeze Account
          </Button> */}

          <PrimaryBtn text="Debit Account" fw={600} action={open} />
        </Flex>
      </Flex>

      <SingleAccountBody
        account={account}
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={trxLoading}
        setChartFrequency={setChartFrequency}
      />

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

//  <div className={styles.grid__container}>
//    <Grid>
//      <GridCol span={9}>
//        <Flex className={styles.overview__container} direction="column">
//          <Flex className={styles.container__header}>
//            <Text fz={16} c="#1A1B20">
//              Account Overview
//            </Text>
//          </Flex>

//          <Flex className={styles.container__body} gap={30}>
//            <Flex flex={1} direction="column" gap={10}>
//              <Flex gap={10} align="center">
//                <Text className={styles.body__text__header}>Euro Account</Text>
//              </Flex>

//              <Text className={styles.body__text} fz={24} fw={600}>
//                {formatNumber(account?.accountBalance || 0, true, "EUR")}
//              </Text>
//            </Flex>

//            <Flex flex={1} direction="column" gap={10}>
//              <Flex gap={10} align="center">
//                <Text className={styles.body__text__header}>
//                  Dollar Accounts
//                </Text>
//              </Flex>

//              <Text className={styles.body__text} fz={24} fw={600}>
//                {formatNumber(0, true, "EUR")}
//              </Text>
//            </Flex>

//            <Flex flex={1} direction="column" gap={10}>
//              <Flex gap={10} align="center">
//                <Text className={styles.body__text__header}>Pound Accounts</Text>
//              </Flex>

//              <Text className={styles.body__text} fz={24} fw={600}>
//                {formatNumber(0, true, "EUR")}
//              </Text>
//            </Flex>
//          </Flex>
//        </Flex>
//      </GridCol>

//      <GridCol span={3}>
//        <Grid>
//          <GridCol span={12}>
//            <Paper className={styles.card__one__container}>
//              <Flex direction="column" className={styles.card__one}>
//                <Flex className={styles.card__one__header} align="center">
//                  <Text fw={600} fz={16}>
//                    Bank Details
//                  </Text>
//                </Flex>

//                <Flex
//                  className={styles.card__one__body}
//                  direction="column"
//                  gap={20}
//                >
//                  <Flex justify="space-between">
//                    <Text className={styles.body__title}>Account Name</Text>
//                    {loading ? (
//                      <Skeleton h={10} w={100} />
//                    ) : (
//                      <Text className={styles.body__text}>
//                        {account?.accountName || ""}
//                      </Text>
//                    )}
//                  </Flex>

//                  {/* <Divider my="sm" /> */}

//                  <Flex justify="space-between">
//                    <Text className={styles.body__title}>Account Number</Text>
//                    {loading ? (
//                      <Skeleton h={10} w={100} />
//                    ) : (
//                      <Text className={styles.body__text}>
//                        {account?.accountNumber || ""}
//                      </Text>
//                    )}
//                  </Flex>
//                </Flex>
//              </Flex>
//              {/* <Button
//                     fz={11}
//                     td="underline"
//                     variant="transparent"
//                     rightSection={<IconArrowRight size={14} />}
//                     color="#97AD05"
//                   >
//                     View Documents
//                   </Button> */}
//            </Paper>
//          </GridCol>
//        </Grid>
//      </GridCol>

//      <GridCol span={8} mih={300}>
//        <Paper style={{ border: "1px solid #f5f5f5" }} py={20} h="100%" px={14}>
//          <Flex px={10} justify="space-between" align="center">
//            <Text fz={16} fw={600}>
//              Transaction Statistics
//            </Text>

//            <Flex gap={22}>
//              <Flex align="center" gap={5} p={5} px={8}>
//                <IconSquareFilled color="#D92D20" size={14} />
//                <Text fz={12}>Outflow</Text>
//              </Flex>

//              <Flex align="center" gap={5} p={5} px={8}>
//                <IconSquareFilled color="#D5E855" size={14} />
//                <Text fz={12}>Inflow</Text>
//              </Flex>

//              <NativeSelect
//                classNames={{
//                  wrapper: styles.select__wrapper,
//                  input: styles.select__input,
//                }}
//                onChange={(event) =>
//                  setChartFrequency(event.currentTarget.value)
//                }
//                data={["Monthly"]}
//              />
//            </Flex>
//          </Flex>

//          {lineData.length > 0 ? (
//            // <BarChart
//            //   pr={20}
//            //   mt={31}
//            //   h={300}
//            //   data={chartFrequency === "Monthly" ? lineData : weekData}
//            //   dataKey={chartFrequency === "Monthly" ? "month" : "day"}
//            //   barProps={{ barSize: 10, radius: 3 }}
//            //   series={[
//            //     { name: "failed", color: "#039855" },
//            //     { name: "successful", color: "#D92D20" },
//            //     { name: "pending", color: "#F79009" },
//            //   ]}
//            //   tickLine="y"
//            // />

//            <AreaChart
//              h={250}
//              mt={30}
//              curveType="bump"
//              data={lineData}
//              dataKey="date"
//              series={[
//                { name: "inflow", color: "#D5E855" },
//                { name: "outflow", color: "#D92D20" },
//              ]}
//            />
//          ) : (
//            <Flex direction="column" align="center" mt={70}>
//              <Image
//                src={EmptyImage}
//                alt="no content"
//                width={156}
//                height={126}
//              />
//              <Text mt={14} fz={14} c="#1D2939">
//                There are no transactions.
//              </Text>
//              <Text fz={10} c="#667085">
//                When a transaction is recorded, it will appear here
//              </Text>
//            </Flex>
//          )}
//        </Paper>
//      </GridCol>

//      <GridCol span={4}>
//        <Paper style={{ border: "1px solid #f5f5f5" }} py={20} h="100%" px={16}>
//          <Flex px={10} justify="space-between" align="center">
//            <Text fz={16} fw={600}>
//              Transaction Volume
//            </Text>

//            <Flex>
//              <NativeSelect
//                classNames={{
//                  wrapper: styles.select__wrapper,
//                  input: styles.select__input,
//                }}
//                onChange={(event) =>
//                  setChartFrequency(event.currentTarget.value)
//                }
//                data={["Monthly", "Weekly"]}
//              />
//            </Flex>
//          </Flex>

//          <Flex justify="center" my={37}>
//            <DonutChart
//              startAngle={180}
//              endAngle={0}
//              // paddingAngle={4}
//              data={donutData}
//              chartLabel={donutData.reduce((prv, cur) => {
//                return cur.value + prv;
//              }, 0)}
//              size={200}
//              thickness={20}
//            />
//          </Flex>

//          <Flex px={10} gap={15} mt={-50}>
//            {donutData.map((item, index) => {
//              return (
//                <Flex
//                  style={{ borderLeft: `3px solid ${item.color}` }}
//                  flex={1}
//                  key={index}
//                  direction="column"
//                  pl={10}
//                >
//                  <Flex align="center" gap={5}>
//                    {/* <IconSquareFilled color={item.color} size={14} /> */}
//                    <Text fz={12} c="#98A2B3">
//                      {item.name}
//                    </Text>
//                  </Flex>

//                  <Text fz={12} fw={600}>
//                    {formatNumber(item.value, true, "EUR")}
//                  </Text>
//                </Flex>
//              );
//            })}
//          </Flex>
//        </Paper>
//      </GridCol>

//      <GridCol span={12}>
//        <Paper
//          style={{ border: "1px solid #f5f5f5" }}
//          className={styles.payout__table}
//        >
//          <Flex justify="space-between" align="center">
//            <Text className={styles.table__text} fz={16} fw={600}>
//              Recent Transactions
//            </Text>

//            <Link href={`/accounts/${account?.id}/transactions`}>
//              <Text td="underline" c="#758604" fz={12} fw={600}>
//                See All Transactions
//              </Text>
//            </Link>
//          </Flex>

//          <TableScrollContainer
//            className={styles.table__container}
//            minWidth={500}
//          >
//            <Table className={styles.table} verticalSpacing="md">
//              {/* <TableTbody>{rows}</TableTbody> */}
//              <TableThead>
//                <TableTr>
//                  <TableTh className={styles.table__th}>Recipient IBAN</TableTh>
//                  <TableTh className={styles.table__th}>Bank</TableTh>
//                  <TableTh className={styles.table__th}>Date Created</TableTh>
//                  <TableTh className={styles.table__th}>Amount</TableTh>
//                  <TableTh className={styles.table__th}>Reference</TableTh>
//                  <TableTh className={styles.table__th}>Status</TableTh>
//                </TableTr>
//              </TableThead>
//              <TableTbody>{loading ? DynamicSkeleton(1) : rows}</TableTbody>
//            </Table>

//            {!loading && !!!rows.length && (
//              <Flex direction="column" align="center" mt={50}>
//                <Image
//                  src={EmptyImage}
//                  alt="no content"
//                  width={126}
//                  height={96}
//                />
//                <Text mt={14} fz={14} c="#1D2939">
//                  There are no transactions.
//                </Text>
//                <Text fz={10} c="#667085">
//                  When a transaction is recorded, it will appear here
//                </Text>
//              </Flex>
//            )}
//          </TableScrollContainer>
//        </Paper>
//      </GridCol>
//    </Grid>
//  </div>;
