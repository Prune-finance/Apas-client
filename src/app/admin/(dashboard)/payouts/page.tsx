"use client";

import TabsComponent from "@/ui/components/Tabs";
import { Paper, TabsPanel, Text } from "@mantine/core";
import { Users } from "./(tabs)/Users";
import { PayoutTransactions } from "./(tabs)/PayoutTransactions";
import { InquiriesTab } from "./(tabs)/Inquiries";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AdminPayout() {
  const searchParams = useSearchParams();
  const _tab = searchParams.get("tab");
  return (
    <main>
      <Paper>
        <div>
          <Text fz={18} fw={600}>
            Payouts
          </Text>
        </div>

        <TabsComponent
          defaultValue={
            tabs.find((tab) => tab.value === _tab)?.value ?? tabs[0].value
          }
          tabs={tabs}
          mt={32}
          fz={12}
        >
          <TabsPanel value={tabs[0].value}>
            <Users />
          </TabsPanel>

          <TabsPanel value={tabs[1].value}>
            <PayoutTransactions />
          </TabsPanel>

          <TabsPanel value={tabs[2].value}>
            <InquiriesTab />
          </TabsPanel>
        </TabsComponent>
      </Paper>
    </main>
  );
}

const tabs = [
  { value: "Users" },
  { value: "Transactions" },
  { value: "Inquiries" },
];

export default function AdminPayoutSuspense() {
  return (
    <Suspense>
      <AdminPayout />
    </Suspense>
  );
}
