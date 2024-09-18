import TabsComponent from "@/ui/components/Tabs";
import { Paper, TabsPanel, Text } from "@mantine/core";
import { Users } from "./(tabs)/Users";
import { PayoutTransactions } from "./(tabs)/PayoutTransactions";
import { InquiriesTab } from "./(tabs)/Inquiries";

export default function AdminPayout() {
  return (
    <main>
      <Paper>
        <div>
          <Text fz={18} fw={600}>
            Payouts
          </Text>
        </div>

        <TabsComponent tabs={tabs} mt={32} fz={12}>
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
