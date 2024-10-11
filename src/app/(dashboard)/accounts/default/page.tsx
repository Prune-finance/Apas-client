"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import { useUserDefaultAccount } from "@/lib/hooks/accounts";
import {
  TransactionType,
  useUserDefaultTransactions,
} from "@/lib/hooks/transactions";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import {
  DefaultAccountHead,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import {
  Flex,
  Group,
  Avatar,
  Skeleton,
  Stack,
  Text,
  Space,
} from "@mantine/core";
import { Suspense, useMemo, useState } from "react";
import { useUserBusiness } from "@/lib/hooks/businesses";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

function Account() {
  const searchParams = useSearchParams();

  const {
    status,
    date,
    type,
    senderName,
    endDate,
    recipientName,
    recipientIban,
  } = Object.fromEntries(searchParams.entries());

  const param = useMemo(() => {
    return {
      ...(status && { status: status.toUpperCase() }),
      ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
      ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
      ...(type && { type: type }),
      ...(senderName && { senderName: senderName }),
      ...(recipientName && { recipientName: recipientName }),
      ...(recipientIban && { recipientIban: recipientIban }),
      // page: active,
      // limit: parseInt(limit ?? "10", 10),
    };
  }, [status, date, type, senderName, endDate, recipientName, recipientIban]);

  const { account, loading } = useUserDefaultAccount();
  const { transactions, loading: loadingTrx } =
    useUserDefaultTransactions(param);

  const { business, meta, revalidate, loading: loadingBiz } = useUserBusiness();

  const [chartFrequency, setChartFrequency] = useState("Monthly");

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/accounts" },
          { title: "Own Accounts", href: "/accounts/default" },
          {
            title: account?.accountName || "",
            href: `/accounts/default`,
            loading: loading,
          },
        ]}
      />

      {/* <Flex
        justify="space-between"
        align="center"
        className={styles.main__header}
      >
        <Group gap={12} align="center">
          {!loading ? (
            <Avatar
              size="lg"
              color="var(--prune-primary-700)"
              // variant="light"
            >
              {account?.accountName
                .split(" ")
                .map((item) => item.charAt(0))
                .join("")}
            </Avatar>
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
          <PrimaryBtn text="Send Money" fw={600} />
        </Flex>
      </Flex> */}

      <Space mt={32} />
      <DefaultAccountHead
        account={account}
        business={business}
        loadingBiz={loadingBiz}
        loading={loading}
        open={() => {}}
      />

      <SingleDefaultAccountBody
        account={account}
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={loadingTrx}
        setChartFrequency={setChartFrequency}
      />
    </main>
  );
}

export default function DefaultAccount() {
  return (
    <Suspense>
      <Account />
    </Suspense>
  );
}
