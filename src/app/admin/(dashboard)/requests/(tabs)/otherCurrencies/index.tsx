import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import React from "react";
import OperationAccount from "./OperationAccount";
import PayoutCurrencyAccount from "./PayoutCurrencyAccount";

function OtherCurrency() {
  return (
    <TabsComponent tabs={tabs} mt={28} tt="capitalize">
      <TabsPanel value="Operations Account" mt={28} tt="capitalize">
        <OperationAccount />
      </TabsPanel>

      <TabsPanel value="Payout Account" mt={28} tt="capitalize">
        <PayoutCurrencyAccount />
      </TabsPanel>
    </TabsComponent>
  );
}

const tabs = [{ value: "Operations Account" }, { value: "Payout Account" }];
export default OtherCurrency;
