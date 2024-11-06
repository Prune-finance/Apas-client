"use client";

import { Paper, Stack, TabsPanel } from "@mantine/core";
import { Text } from "@mantine/core";

import styles from "./styles.module.scss";

import { Suspense, useState } from "react";
import TabsComponent from "@/ui/components/Tabs";
import { AccountsTab } from "./(tabs)/Accounts";
import { IssuedAccountsTab } from "./(tabs)/IssuedAccounts";
import { PayoutsTab } from "./(tabs)/Payouts";
import Transaction from "@/lib/store/transaction";
import { TransactionDrawer } from "./drawer";
import { useSearchParams } from "next/navigation";

function AccountTrx() {
  const { opened, close, data } = Transaction();
  const searchParam = useSearchParams();
  const tab = searchParam.get("tab");

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

        <TabsComponent
          tabs={tabs}
          defaultValue={
            tabs.find((t) => t.value.toLowerCase() === tab?.toLowerCase())
              ?.value ?? tabs[0].value
          }
          mt={32}
          keepMounted={false}
        >
          <TabsPanel value="own-account">
            <AccountsTab />
          </TabsPanel>
          <TabsPanel value="issued-accounts">
            <IssuedAccountsTab />
          </TabsPanel>
          <TabsPanel value="payouts">
            <PayoutsTab />
          </TabsPanel>
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
  { title: "Own Account", value: "own-account" },
  { title: "Issued Accounts", value: "issued-accounts" },
  { title: "Payouts", value: "payouts" },
];
