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
import USDIcon from "@/assets/USD.png";
import { GBPAccount } from "../GBPAccount";
import { USDAccount } from "../USDAccount";

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
          <TabsPanel value="usd-accounts">
            <USDAccount />
          </TabsPanel>
        </TabsComponent>
      </Paper>
    </main>
  );
};

const tabs = [
  {
    title: "EUR Transaction",
    value: "eur-account",
    icon: <Image src={EUIcon.src} alt="icon" h={20} w={20} />,
  },
  {
    title: "GBP Transactions",
    value: "gbp-accounts",
    icon: <Image src={GBPIcon.src} alt="icon" h={20} w={20} />,
  },
  {
    title: "USD Transactions",
    value: "usd-accounts",
    icon: <Image src={USDIcon.src} alt="icon" h={20} w={20} />,
  },
];
