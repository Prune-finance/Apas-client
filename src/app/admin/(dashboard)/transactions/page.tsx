"use client";

import { Paper, Stack, Text, Title } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import Transaction from "@/lib/store/transaction";
import { Suspense, useState } from "react";

import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import TabsComponent from "@/ui/components/Tabs";

import { BusinessAccountTransactions } from "./(tabs)/business";
import { IssuedAccountTransactions } from "./(tabs)/issued";
import { PayoutAccountTransactions } from "./(tabs)/payout";

function TransactionForAccount() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(1);

  const { tab } = Object.fromEntries(searchParams.entries());

  const { data, close, opened: openedDrawer } = Transaction();

  const customStatusOption = ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"];

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
          onChange={() => setActive(1)}
          mt={28}
          styles={{ list: { marginBottom: 28 } }}
          keepMounted={false}
        >
          <BusinessAccountTransactions
            panelValue={tabs[0].value}
            customStatusOption={customStatusOption}
            active={active}
            setActive={setActive}
          />

          <IssuedAccountTransactions
            panelValue={tabs[1].value}
            customStatusOption={customStatusOption}
            active={active}
            setActive={setActive}
          />

          <PayoutAccountTransactions
            panelValue={tabs[2].value}
            customStatusOption={customStatusOption}
            active={active}
            setActive={setActive}
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
  { value: "business-accounts", title: "Business Accounts" },
  { value: "issued-accounts", title: "Issued Accounts" },
  { value: "payout-accounts", title: "Payout Accounts" },
];

const searchProps = ["senderIban", "recipientIban", "recipientBankAddress"];

export default function TransactionForAccountSuspense() {
  return (
    <Suspense>
      <TransactionForAccount />
    </Suspense>
  );
}
