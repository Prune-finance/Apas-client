import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import { AllPayoutRequests } from "./AllPayoutRequests";
import { PendingPayoutRequests } from "./PendingRequests";
import { useSearchParams } from "next/navigation";

export default function PayoutRequests() {
  const searchParam = useSearchParams();
  const subTab = searchParam.get("subTab");
  return (
    <TabsComponent
      tabs={tabs}
      defaultValue={
        tabs.find((tab) => tab.value.toLowerCase() === subTab?.toLowerCase())
          ?.value ?? tabs[0].value
      }
      mt={28}
      keepMounted={false}
    >
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
