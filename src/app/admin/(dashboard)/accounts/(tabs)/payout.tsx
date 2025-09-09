import { accountList } from "@/lib/static";
import TabsComponent from "@/ui/components/Tabs";
import { Center, TabsPanel } from "@mantine/core";
import React from "react";
import PayoutAccountsComponent from "./PayoutAccountComponent";

export default function PayoutAccounts() {
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
            <PayoutAccountsComponent
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
