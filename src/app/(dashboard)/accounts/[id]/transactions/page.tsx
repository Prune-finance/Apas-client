"use client";
import dayjs from "dayjs";

import Image from "next/image";
import { Box, Divider, Drawer, Paper, ThemeIcon } from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { UnstyledButton, rem, Text, Pagination } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Checkbox, Flex, TableTh, TableThead } from "@mantine/core";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import {
  IconArrowUpRight,
  IconArrowLeft,
  IconSearch,
  IconListTree,
  IconPointFilled,
  IconX,
} from "@tabler/icons-react";

import { DynamicSkeleton } from "@/lib/static";
import { formatNumber } from "@/lib/utils";

import EmptyImage from "@/assets/empty.png";

import { useParams, useRouter } from "next/navigation";
import {
  TransactionType,
  TrxData,
  useTransactions,
  useUserTransactions,
} from "@/lib/hooks/transactions";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

export default function AccountTrx() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { loading, transactions } = useUserTransactions(params.id);
  const [selectedRequest, setSelectedRequest] = useState<TrxData | null>(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const rows = transactions.map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd>
      <TableTd className={styles.table__td}>{element.reference}</TableTd>
      {/* <TableTd className={styles.table__td}>{dayjs().format()}</TableTd> */}
      <TableTd className={`${styles.table__td}`}>
        <Flex align="center" gap={5}>
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            className={styles.table__td__icon}
          />
          {formatNumber(element.amount, true, "EUR")}
        </Flex>
        {/* <Text fz={12}></Text> */}
      </TableTd>
      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("DD MMM, YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <div className={styles.table__td__status}>
          {/* <IconPointFilled size={14} color="#12B76A" /> */}
          <Text
            tt="capitalize"
            fz={10}
            fw={700}
            c={element.status === "PENDING" ? "#F79009" : "#12B76A"}
          >
            {element.status}
          </Text>
        </div>
      </TableTd>
    </TableTr>
  ));

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/accounts" },
          { title: params.id, href: `/accounts/${params.id}` },
          {
            title: "Transactions",
            href: `/accounts/${params.id}/transactions`,
          },
        ]}
      />

      <Paper className={styles.table__container}>
        <div className={styles.container__header}>
          <Flex gap={10} align="center">
            <Text fz={18} fw={600}>
              Transactions
            </Text>
          </Flex>
        </div>

        <Flex className={styles.overview__container} direction="column">
          <Flex className={styles.container__header}>
            <Text fz={16} c="#1A1B20">
              Overview
            </Text>
          </Flex>

          <Flex className={styles.container__body} gap={30}>
            <Flex flex={1} direction="column" gap={10}>
              <Flex gap={10} align="center">
                <Text className={styles.body__text__header}>Total Balance</Text>
              </Flex>

              <Text className={styles.body__text} fz={24} fw={600}>
                {formatNumber(
                  transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
                  true,
                  "EUR"
                )}
              </Text>
            </Flex>

            <Flex flex={1} direction="column" gap={10}>
              <Flex gap={10} align="center">
                <Text className={styles.body__text__header}>Money In</Text>
              </Flex>

              <Text className={styles.body__text} fz={24} fw={600}>
                {formatNumber(0, true, "EUR")}
              </Text>
            </Flex>

            <Flex flex={1} direction="column" gap={10}>
              <Flex gap={10} align="center">
                <Text className={styles.body__text__header}>Money Out</Text>
              </Flex>

              <Text className={styles.body__text} fz={24} fw={600}>
                {formatNumber(
                  transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
                  true,
                  "EUR"
                )}
              </Text>
            </Flex>

            <Flex flex={1} direction="column" gap={10}>
              <Flex gap={10} align="center">
                <Text className={styles.body__text__header}>
                  Total Transactions
                </Text>
              </Flex>

              <Text className={styles.body__text} fz={24} fw={600}>
                {transactions.length}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <div className={styles.container__search__filter}>
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            classNames={{ wrapper: styles.search, input: styles.input__search }}
          />

          <Button
            className={styles.filter__cta}
            rightSection={<IconListTree size={14} />}
          >
            <Text fz={12} fw={500}>
              Filter
            </Text>
          </Button>
        </div>

        <TableScrollContainer minWidth={500}>
          <Table className={styles.table} verticalSpacing="md">
            <TableThead>
              <TableTr>
                <TableTh className={styles.table__th}>Recipient IBAN</TableTh>
                <TableTh className={styles.table__th}>Bank</TableTh>
                <TableTh className={styles.table__th}>Reference</TableTh>
                <TableTh className={styles.table__th}>Amount</TableTh>
                <TableTh className={styles.table__th}>Date Created</TableTh>
                <TableTh className={styles.table__th}>Status</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>{loading ? DynamicSkeleton(0) : rows}</TableTbody>
          </Table>
        </TableScrollContainer>

        {!loading && !!!rows.length && (
          <Flex direction="column" align="center" mt={70}>
            <Image src={EmptyImage} alt="no content" width={156} height={120} />
            <Text mt={14} fz={14} c="#1D2939">
              There are no transactions.
            </Text>
            <Text fz={10} c="#667085">
              When a transaction is recorded, it will appear here
            </Text>
          </Flex>
        )}
      </Paper>

      <div className={styles.pagination__container}>
        <Text fz={14}>Rows: {rows.length}</Text>
        <Pagination
          autoContrast
          color="#fff"
          total={1}
          classNames={{ control: styles.control, root: styles.pagination }}
        />
      </div>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        withCloseButton={false}
        size="30%"
      >
        <Flex justify="space-between" pb={28}>
          <Text fz={18} fw={600} c="#1D2939">
            Transaction Details
          </Text>

          <IconX onClick={closeDrawer} />
        </Flex>

        <Box>
          <Flex direction="column">
            <Text c="#8B8B8B" fz={12}>
              Amount Sent
            </Text>

            <Text c="#97AD05" fz={32} fw={600}>
              {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
            </Text>
          </Flex>

          <Divider mt={30} mb={20} />

          <Text fz={16} mb={24}>
            Receiver Details
          </Text>

          <Flex direction="column" gap={30}>
            {/* <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Business Name:
              </Text>

              <Text fz={14}>{selectedRequest?.Account.Company.name}</Text>
            </Flex> */}

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Account IBAN:
              </Text>

              <Text fz={14}>{selectedRequest?.recipientIban}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Bank:
              </Text>

              <Text fz={14}>{selectedRequest?.recipientBankAddress}</Text>
            </Flex>
          </Flex>

          <Divider my={30} />

          <Text fz={16} mb={24}>
            Other Details
          </Text>

          <Flex direction="column" gap={30}>
            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Alert Type
              </Text>

              <Flex align="center">
                <IconArrowUpRight
                  color="#F04438"
                  size={16}
                  className={styles.table__td__icon}
                  // style={{ marginTop: "-20px" }}
                />

                <Text c="#F04438" fz={14}>
                  Debit
                </Text>
              </Flex>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Date and Time
              </Text>

              <Text fz={14}>
                {dayjs(selectedRequest?.createdAt).format(
                  "DD MMMM, YYYY - HH:mm"
                )}
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Transaction ID
              </Text>

              <Text fz={14}>{selectedRequest?.id}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Status:
              </Text>

              <Box bg="#FFFAEB" p={5} style={{ borderRadius: "3px" }}>
                <Flex align="center">
                  <IconPointFilled size={14} color="#C6A700" />
                  <Text c="#C6A700" tt="capitalize" fz={14}>
                    {selectedRequest?.status.toLocaleLowerCase()}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Drawer>
    </main>
  );
}
