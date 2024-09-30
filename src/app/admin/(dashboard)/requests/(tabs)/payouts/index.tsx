import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import { AllPayoutRequests } from "./AllPayoutRequests";
import { PendingPayoutRequests } from "./PendingRequests";

export default function PayoutRequests() {
  return (
    <TabsComponent tabs={tabs} mt={28}>
      <TabsPanel value={tabs[0].value} mt={28}>
        <AllPayoutRequests />
      </TabsPanel>
      <TabsPanel value={tabs[1].value} mt={28}>
        <PendingPayoutRequests />
      </TabsPanel>
    </TabsComponent>
  );
}

const tabs = [{ value: "All" }, { value: "Pending" }];
