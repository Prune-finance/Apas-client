import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import AccountIssuanceComponent from "./AccountIssuance";
import PayoutAccountService from "./PayoutAccount";

export default function Services() {
  return (
    <TabsComponent
      tabs={tabs}
      mt={28}
      //  keepMounted={false}
    >
      <TabsPanel value="Account Issuance" mt={28}>
        <AccountIssuanceComponent />
      </TabsPanel>

      <TabsPanel value="Payout Account" mt={28}>
        <PayoutAccountService />
      </TabsPanel>
    </TabsComponent>
  );
}

const tabs = [{ value: "Account Issuance" }, { value: "Payout Account" }];
