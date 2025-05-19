"use client";

import { Image, Paper, Stack, TabsPanel } from "@mantine/core";
import { Text } from "@mantine/core";
import { Suspense } from "react";
import TabsComponent from "@/ui/components/Tabs";

import Transaction from "@/lib/store/transaction";
import { useSearchParams } from "next/navigation";
import { EuroAccount } from "../EuroAccount";
import EUIcon from "@/assets/EU-icon.png";
import GBPIcon from "@/assets/GB.png";
import { GBPAccount } from "../GBPAccount";

export const AccountsTab = () => {
  const { opened, close, data } = Transaction();
  const searchParam = useSearchParams();
  const tab = searchParam.get("tab");

  return (
    <main>
      <Paper>
        <TabsComponent
          tt="capitalize"
          tabs={tabs}
          defaultValue={
            tabs.find((t) => t.value.toLowerCase() === tab?.toLowerCase())
              ?.value ?? tabs[0].value
          }
          mt={32}
          keepMounted={false}
        >
          <TabsPanel value="eur-account">
            <EuroAccount />
          </TabsPanel>
          <TabsPanel value="gbp-accounts">
            <GBPAccount />
          </TabsPanel>
        </TabsComponent>
      </Paper>
    </main>
  );
};

const tabs = [
  {
    title: "Euro Transaction",
    value: "eur-account",
    icon: <Image src={EUIcon.src} alt="icon" h={20} w={20} />,
  },
  {
    title: "Pounds Transactions",
    value: "gbp-accounts",
    icon: <Image src={GBPIcon.src} alt="icon" h={20} w={20} />,
  },
];
