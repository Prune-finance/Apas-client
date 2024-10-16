import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import { AllPayoutRequests } from "./AllPayoutRequests";
import { PendingPayoutRequests } from "./PendingRequests";

export default function PayoutRequests() {
  return (
    <TabsComponent tabs={tabs} mt={28} keepMounted={false}>
      <TabsPanel value="All" mt={28}>
        <AllPayoutRequests />
      </TabsPanel>

      <TabsPanel value="Pending" mt={28}>
        <PendingPayoutRequests />
      </TabsPanel>
    </TabsComponent>
  );
}

export const PayoutReqSearchProps = [
  "beneficiaryFullName",
  "destinationIBAN",
  "PayoutAccount.accountNumber",
  "destinationBank",
  "reference",
];
const tabs = [{ value: "All" }, { value: "Pending" }];
