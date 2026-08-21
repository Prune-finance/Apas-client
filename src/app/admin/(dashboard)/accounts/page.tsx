"use client";

import { TabsPanel, Text, Title, Paper, Stack } from "@mantine/core";
import React, { useState } from "react";
import { Suspense } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import TabsComponent from "@/ui/components/Tabs";
import { useSearchParams } from "next/navigation";
import IssuedAccounts from "./(tabs)/issued";
import BusinessAccounts from "./(tabs)/default";
import PayoutAccounts from "./(tabs)/payout";
import AllAccounts from "./(tabs)/all";

function Accounts() {
  const searchParams = useSearchParams();
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});

  const tab = searchParams.get("tab");

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    setTabCounts((prev) => ({ ...prev, [value]: (prev[value] ?? 0) + 1 }));
  };

  const tabKey = (value: string) => `${value}-${tabCounts[value] ?? 0}`;

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
          tt="uppercase"
          mt={28}
          keepMounted={false}
          onChange={handleTabChange}
        >
          <TabsPanel key={tabKey(tabs[0].value)} value={tabs[0].value}>
            <AllAccounts />
          </TabsPanel>
          <TabsPanel key={tabKey(tabs[1].value)} value={tabs[1].value}>
            <BusinessAccounts />
          </TabsPanel>
          <TabsPanel key={tabKey(tabs[2].value)} value={tabs[2].value}>
            <IssuedAccounts />
          </TabsPanel>
          <TabsPanel key={tabKey(tabs[3].value)} value={tabs[3].value}>
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
