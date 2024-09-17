"use client";

import { Paper, Stack } from "@mantine/core";
import { Text } from "@mantine/core";

import styles from "./styles.module.scss";

import { Suspense, useState } from "react";
import TabsComponent from "@/ui/components/Tabs";
import { AccountsTab } from "./(tabs)/Accounts";
import { IssuedAccountsTab } from "./(tabs)/IssuedAccounts";
import { PayoutsTab } from "./(tabs)/Payouts";
import Transaction from "@/lib/store/transaction";
import { TransactionDrawer } from "./drawer";

function AccountTrx() {
  const { opened, close, data } = Transaction();

  return (
    <main>
      <Paper>
        <div className={styles.container__header}>
          <Stack gap={8}>
            <Text fz={18} fw={600}>
              Transactions
            </Text>
            <Text fz={14} fw={400}>
              Here’s an overview of all your transactions
            </Text>
          </Stack>
        </div>

        <TabsComponent tabs={tabs} mt={32}>
          <AccountsTab />
          <IssuedAccountsTab />
          <PayoutsTab />
        </TabsComponent>
      </Paper>

      <TransactionDrawer opened={opened} close={close} selectedRequest={data} />
    </main>
  );
}

export default function AccountTrxSuspense() {
  return (
    <Suspense>
      <AccountTrx />
    </Suspense>
  );
}

const tabs = [
  { value: "Own Account" },
  { value: "Issued Accounts" },
  { value: "Payouts" },
];
