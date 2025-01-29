"use client";

import { Group, TabsPanel, Text } from "@mantine/core";
import React, { useState } from "react";
import { Suspense } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import TabsComponent from "@/ui/components/Tabs";
import { useDebouncedValue } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import IssuedAccounts from "./(tabs)/issued";

function Accounts() {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");
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
        tt="capitalize"
      >
        <TabsPanel value={tabs[0].value}>
          <IssuedAccounts />
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <IssuedAccounts />
        </TabsPanel>
        <TabsPanel value={tabs[2].value}>
          <IssuedAccounts />
        </TabsPanel>
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
  { value: "business-accounts", title: "Business Accounts" },
  { value: "issued-accounts", title: "Issued Accounts" },
  { value: "payout-accounts", title: "Payout Accounts" },
];
