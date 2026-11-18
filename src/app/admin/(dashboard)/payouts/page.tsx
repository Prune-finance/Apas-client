"use client";

import TabsComponent from "@/ui/components/Tabs";
import { Paper, TabsPanel, Text } from "@mantine/core";
import { Users } from "./(tabs)/Users";
import { PayoutTransactions } from "./(tabs)/PayoutTransactions";
import { InquiriesTab } from "./(tabs)/Inquiries";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAdminAccess } from "@/lib/hooks/privileges";

function AdminPayout() {
  const searchParams = useSearchParams();
  const _tab = searchParams.get("tab");
  const { can } = useAdminAccess();
  // each tab shows only with its privilege
  const visibleTabs = tabs.filter((t) => can(t.privilege));
  const shows = (value: string) => visibleTabs.some((t) => t.value === value);
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
            visibleTabs.find((tab) => tab.value === _tab)?.value ??
            visibleTabs[0]?.value
          }
          tabs={visibleTabs}
          mt={32}
          fz={12}
        >
          {shows("Users") && (
            <TabsPanel value="Users">
              <Users />
            </TabsPanel>
          )}

          {shows("Transactions") && (
            <TabsPanel value="Transactions">
              <PayoutTransactions />
            </TabsPanel>
          )}

          {shows("Inquiries") && (
            <TabsPanel value="Inquiries">
              <InquiriesTab />
            </TabsPanel>
          )}
        </TabsComponent>
      </Paper>
    </main>
  );
}

const tabs = [
  { value: "Users", privilege: "payouts.view" },
  { value: "Transactions", privilege: "payouts.view" },
  { value: "Inquiries", privilege: "payouts.view-inquiries" },
];

export default function AdminPayoutSuspense() {
  return (
    <Suspense>
      <AdminPayout />
    </Suspense>
  );
}
