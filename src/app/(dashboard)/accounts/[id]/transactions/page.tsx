"use client";
import dayjs from "dayjs";

import Image from "next/image";
import { Paper, ThemeIcon } from "@mantine/core";
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
} from "@tabler/icons-react";

import { DynamicSkeleton } from "@/lib/static";
import { formatNumber } from "@/lib/utils";

import EmptyImage from "@/assets/empty.png";

import { useParams, useRouter } from "next/navigation";
import { useTransactions, useUserTransactions } from "@/lib/hooks/transactions";

export default function AccountTrx() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { loading, transactions } = useUserTransactions(params.id);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const rows = transactions.map((element) => (
    <TableTr key={element.id}>
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd>
      <TableTd className={styles.table__td}>{element.reference}</TableTd>
      {/* <TableTd className={styles.table__td}>{dayjs().format()}</TableTd> */}
      <TableTd className={`${styles.table__td}`}>
        <IconArrowUpRight
          color="#D92D20"
          size={16}
          className={styles.table__td__icon}
        />
        {formatNumber(element.amount, true, "EUR")}
        {/* <Text fz={12}></Text> */}
      </TableTd>
      <TableTd className={styles.table__td}>{dayjs().format()}</TableTd>
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
          { title: "Dashboard", href: "/dashboard" },
          { title: "Accounts", href: "/accounts" },
          { title: params.id, href: `/accounts/${params.id}` },
          {
            title: "Transactions",
            href: `/accounts/${params.id}/transactions`,
          },
        ]}
      />

      <Paper withBorder className={styles.table__container}>
        <div className={styles.container__header}>
          <Flex gap={10} align="center">
            <UnstyledButton onClick={() => router.back()}>
              <ThemeIcon color="rgba(212, 243, 7)" radius="lg">
                <IconArrowLeft
                  color="#1D2939"
                  style={{ width: "70%", height: "70%" }}
                />
              </ThemeIcon>
            </UnstyledButton>

            <Text fz={18} fw={600}>
              Account Transactions
            </Text>
          </Flex>
        </div>

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

        <div className={styles.pagination__container}>
          <Text fz={14}>Rows: {rows.length}</Text>
          <Pagination
            autoContrast
            color="#fff"
            total={1}
            classNames={{ control: styles.control, root: styles.pagination }}
          />
        </div>
      </Paper>
    </main>
  );
}
