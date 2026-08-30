"use client";

import { TabsPanel, Text, Title, Paper, Stack } from "@mantine/core";
import React from "react";
import { Suspense } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import TabsComponent from "@/ui/components/Tabs";
import { useRouter, useSearchParams } from "next/navigation";
import IssuedAccounts from "./(tabs)/issued";
import BusinessAccounts from "./(tabs)/default";
import PayoutAccounts from "./(tabs)/payout";
import AllAccounts from "./(tabs)/all";

function Accounts() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get("tab");

  return (
    <main className={styles.main}>
      <Paper p={20}>
        <Stack gap={8}>
          <Title c="var(--prune-text-gray-700)" fz={24} fw={600}>
            Accounts
          </Title>
        </Stack>

        <TabsComponent
          tabs={tabs}
          defaultValue={
            tabs.find((t) => t.value.toLowerCase() === tab?.toLowerCase())
              ?.value ?? tabs[0].value
          }
          onChange={(value) => { if (value) router.push(`?tab=${value}`); }}
          tt="uppercase"
          mt={28}
          keepMounted={false}
        >
          <TabsPanel value={tabs[0].value}>
            <AllAccounts />
          </TabsPanel>
          <TabsPanel value={tabs[1].value}>
            <BusinessAccounts />
          </TabsPanel>
          <TabsPanel value={tabs[2].value}>
            <IssuedAccounts />
          </TabsPanel>
          <TabsPanel value={tabs[3].value}>
            <PayoutAccounts />
          </TabsPanel>
        </TabsComponent>
      </Paper>
    </main>
  );
}

export default function AccountSuspense() {
  return (
    <Suspense>
      <Accounts />
    </Suspense>
  );
}

const tabs = [
  { value: "all-accounts", title: "All Accounts" },
  { value: "business-accounts", title: "Business Accounts" },
  { value: "issued-accounts", title: "Issued Accounts" },
  { value: "payout-accounts", title: "Payout Accounts" },
];
