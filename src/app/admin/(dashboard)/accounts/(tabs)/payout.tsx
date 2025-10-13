import { accountList } from "@/lib/static";
import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";
import React from "react";
import PayoutAccountsComponent from "./PayoutAccountComponent";
import { AccountType, Currency } from "@/lib/interface/currency";
import { useSearchParams } from "next/navigation";

interface Props {
  accountType: AccountType;
  currencies: Currency[];
}

export default function PayoutAccounts({ accountType, currencies }: Props) {
  const searchParams = useSearchParams();

  const currencyTab = searchParams.get("currencyTab");

  const availableCurrencies = accountList.filter((account) =>
    (currencies || []).includes(account.currency as Currency)
  );

  return (
    <TabsComponent
      tt="capitalize"
      tabs={availableCurrencies}
      defaultValue={currencyTab || currencies[0]}
      mt={32}
      keepMounted={false}
      additionalTile=" Account Details"
    >
      {availableCurrencies.map((account) => (
        <TabsPanel value={account.value} key={account.id}>
          <PayoutAccountsComponent
            currency={account.currency}
            locale={account.locale}
            accountType={accountType}
          />
        </TabsPanel>
      ))}
    </TabsComponent>
  );
}
