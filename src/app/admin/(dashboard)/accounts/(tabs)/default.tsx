import { accountList } from "@/lib/static";
import TabsComponent from "@/ui/components/Tabs";
import { Center, TabsPanel } from "@mantine/core";
import React from "react";
import DefaultAccountComponents from "./DefaultComponent";

export default function BusinessAccounts() {
  return (
    <TabsComponent
      tt="capitalize"
      tabs={accountList}
      defaultValue={accountList[0].value}
      mt={32}
      keepMounted={false}
      additionalTile=" Account Details"
    >
      {accountList.map((account) => (
        <TabsPanel value={account.value} key={account.id}>
          {account.active ? (
            <DefaultAccountComponents
              currency={account.currency}
              locale={account.locale}
            />
          ) : (
            <Center h="calc(100dvh - 400px)">Coming Soon</Center>
          )}
        </TabsPanel>
      ))}
    </TabsComponent>
  );
}
