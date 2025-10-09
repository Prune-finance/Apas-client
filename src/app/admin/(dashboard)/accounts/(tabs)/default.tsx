import { accountList } from "@/lib/static";
import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import React from "react";
import DefaultAccountComponents from "./DefaultComponent";
import { AccountType, Currency } from "@/lib/interface/currency";

interface Props {
  accountType: AccountType;
  currencies: Currency[];
}

export default function BusinessAccounts({ accountType, currencies }: Props) {
  const availableCurrencies = accountList.filter((account) =>
    (currencies || []).includes(account.currency as Currency)
  );

  return (
    <TabsComponent
      tt="capitalize"
      tabs={availableCurrencies}
      defaultValue={currencies[0]}
      mt={32}
      keepMounted={false}
      additionalTile=" Account Details"
    >
      {availableCurrencies.map((account) => (
        <TabsPanel value={account.value} key={account.id}>
          <DefaultAccountComponents
            currency={account.currency}
            locale={account.locale}
            accountType={accountType}
          />
        </TabsPanel>
      ))}
    </TabsComponent>
  );
}
