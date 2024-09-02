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
import { useState } from "react";
import { useUserBusiness } from "@/lib/hooks/businesses";

export default function DefaultAccount() {
  const { account, loading } = useUserDefaultAccount();
  const { transactions, loading: loadingTrx } = useUserDefaultTransactions();

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
