"use client";

import { Paper, Stack, Text, Title } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import Transaction from "@/lib/store/transaction";
import { Suspense, useState } from "react";

import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import TabsComponent from "@/ui/components/Tabs";

import { BusinessAccountTransactions } from "./(tabs)/business";
import { IssuedAccountTransactions } from "./(tabs)/issued";
import { PayoutAccountTransactions } from "./(tabs)/payout";
import { AllAccountTransactions } from "./(tabs)/all";

function TransactionForAccount() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tab } = Object.fromEntries(searchParams.entries());
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});

  const { data, close, opened: openedDrawer } = Transaction();

  const customStatusOption = [
    "PENDING",
    "CONFIRMED",
    "REJECTED",
    "CANCELLED",
    "FAILED",
  ];

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    setTabCounts((prev) => ({ ...prev, [value]: (prev[value] ?? 0) + 1 }));
    router.push(`?tab=${value}`);
  };

  const tabKey = (value: string) => `${value}-${tabCounts[value] ?? 0}`;

  return (
    <main>
      <Paper p={20}>
        <Stack gap={8}>
          <Title c="var(--prune-text-gray-700)" fz={24} fw={600}>
            Transactions
          </Title>

          <Text fz={14} c="var(--prune-text-gray-500)">
            Here’s an overview of all transactions{" "}
          </Text>
        </Stack>

        <TabsComponent
          tabs={tabs}
          defaultValue={
            tabs.find((t) => t.value.toLowerCase() === tab?.toLowerCase())
              ?.value ?? tabs[0].value
          }
          onChange={handleTabChange}
          mt={28}
          styles={{ list: { marginBottom: 28 } }}
          keepMounted={false}
        >
          <AllAccountTransactions
            key={tabKey(tabs[0].value)}
            panelValue={tabs[0].value}
            customStatusOption={customStatusOption}
          />
          <BusinessAccountTransactions
            key={tabKey(tabs[1].value)}
            panelValue={tabs[1].value}
            customStatusOption={customStatusOption}
          />

          <IssuedAccountTransactions
            key={tabKey(tabs[2].value)}
            panelValue={tabs[2].value}
            customStatusOption={customStatusOption}
          />

          <PayoutAccountTransactions
            key={tabKey(tabs[3].value)}
            panelValue={tabs[3].value}
            customStatusOption={customStatusOption}
          />

          
        </TabsComponent>

        {data && (
          <TransactionDrawer
            opened={openedDrawer}
            close={close}
            selectedRequest={data}
          />
        )}
      </Paper>
    </main>
  );
}

const tabs = [
  { value: "all-transactions", title: "All Transactions" },
  { value: "business-accounts", title: "Business Accounts" },
  { value: "issued-accounts", title: "Issued Accounts" },
  { value: "payout-accounts", title: "Payout Accounts" }
];

const searchProps = ["senderIban", "recipientIban", "recipientBankAddress"];

export default function TransactionForAccountSuspense() {
  return (
    <Suspense>
      <TransactionForAccount />
    </Suspense>
  );
}
