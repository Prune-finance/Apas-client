import TabsComponent from "@/ui/components/Tabs";
import React from "react";
import { Access } from "./(tabs)/access";
import { BusinessData } from "@/lib/hooks/businesses";
import { TabsPanel } from "@mantine/core";
import { Debit } from "./(tabs)/debit";
import { OtherRequests } from "./(tabs)/requests";

export const Requests = ({ business }: { business: BusinessData | null }) => {
  return (
    <TabsComponent
      tabs={tabs}
      fz={12}
      fw={600}
      tt="uppercase"
      mt={32}
      styles={{ list: { marginBottom: 28 } }}
    >
      <TabsPanel value="services">
        <Access />
      </TabsPanel>

      <TabsPanel value="debit">
        <Debit />
      </TabsPanel>

      <TabsPanel value="other requests">
        <OtherRequests />
      </TabsPanel>
    </TabsComponent>
  );
};

const tabs = [
  { value: "services" },
  { value: "debit" },
  { value: "other requests" },
];
