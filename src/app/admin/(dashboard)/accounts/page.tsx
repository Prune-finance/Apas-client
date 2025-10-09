"use client";

import { Group, TabsPanel, Text } from "@mantine/core";
import React, { useState } from "react";
import { Suspense } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import TabsComponent from "@/ui/components/Tabs";
import { useDebouncedValue } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import IssuedAccounts from "./(tabs)/issued";
import BusinessAccounts from "./(tabs)/default";
import PayoutAccounts from "./(tabs)/payout";
import { AccountType } from "@/lib/interface/currency";
import { useAccountCurrencyStatistics } from "@/lib/hooks/accounts";
import PayoutAccountsSkeleton from "@/ui/components/Skeletons/PayoutAccountsSkeleton";

function Accounts() {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const { loading, meta, data } = useAccountCurrencyStatistics({
    accountType: "COMPANY_ACCOUNT",
    frequency: "",
  });

  return (
    <main className={styles.main}>
      <div className={styles.container__header}>
        <Text fz={18} fw={600} mt={33} mb={44}>
          Accounts
        </Text>
      </div>

      <TabsComponent
        tabs={tabs}
        defaultValue={
          tabs.find((t) => t.value.toLowerCase() === tab?.toLowerCase())
            ?.value ?? tabs[0].value
        }
        // tt="capitalize"
        keepMounted={false}
      >
        {tabs.map((tab) => {
          const Component = tab.component;
          return (
            <TabsPanel value={tab.value} key={tab.value}>
              {loading ? (
                <PayoutAccountsSkeleton />
              ) : (
                <Component
                  accountType={tab.value as AccountType}
                  currencies={meta?.currencies || []}
                />
              )}
            </TabsPanel>
          );
        })}
      </TabsComponent>
    </main>
  );
}

export default function AccountSuspense() {
  return (
    <Suspense>
      <Accounts />
    </Suspense>
  );
}

const tabs = [
  {
    value: "COMPANY_ACCOUNT",
    title: "Business Accounts",
    component: BusinessAccounts,
  },
  {
    value: "ISSUED_ACCOUNT",
    title: "Issued Accounts",
    component: IssuedAccounts,
  },
  {
    value: "PAYOUT_ACCOUNT",
    title: "Payout Accounts",
    component: PayoutAccounts,
  },
];
