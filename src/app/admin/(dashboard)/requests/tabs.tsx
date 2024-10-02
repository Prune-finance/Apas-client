"use client";

import {
  IconUserPlus,
  IconCircleArrowUpRight,
  IconCircleKey,
  IconArrowUpRight,
} from "@tabler/icons-react";

import { TabsPanel } from "@mantine/core";
import Debit from "./(tabs)/debit";
import Reactivate from "./(tabs)/reactivate";

import Services from "./(tabs)/services";

import TabsComponent from "@/ui/components/Tabs";
import LiveKeySuspense from "./(tabs)/live-key";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PayoutRequests from "./(tabs)/payouts";
import PayoutAccountServiceSuspense from "./(tabs)/PayoutAccount";

// import PayoutRequestsSuspense from "./(tabs)/payouts";

function TabsContainer() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  return (
    <TabsComponent
      defaultValue={tabs.find((t) => t.value === tab)?.value ?? tabs[0].value}
      tabs={tabs}
      mt={24}
      tt="capitalize"
      fz={12}
    >
      <TabsPanel value={tabs[0].value}>
        <Debit />
      </TabsPanel>

      <TabsPanel value={tabs[1].value}>
        <PayoutAccountServiceSuspense />
      </TabsPanel>
      <TabsPanel value={tabs[2].value}>
        <Services />
      </TabsPanel>

      <TabsPanel value={tabs[3].value}>
        <LiveKeySuspense />
      </TabsPanel>

      <TabsPanel value={tabs[4].value}>
        <PayoutRequests />
      </TabsPanel>

      <TabsPanel value={tabs[5].value}>
        <Reactivate />
      </TabsPanel>
    </TabsComponent>
  );
}

const tabs = [
  {
    title: "Debit",
    value: "Debit",
    icon: <IconCircleArrowUpRight size={16} />,
  },
  {
    title: "Payout Account",
    value: "payout-account",
    icon: <IconUserPlus size={16} />,
  },
  {
    title: "Account Issuance",
    value: "account-issuance",
    icon: <IconUserPlus size={16} />,
  },
  {
    title: "Live Keys",
    value: "live-keys",
    icon: <IconCircleKey size={16} />,
  },
  {
    title: "Payout Requests",
    value: "payout-requests",
    icon: <IconArrowUpRight size={16} />,
  },
  {
    title: "Other Requests",
    value: "other-requests",
    icon: <IconUserPlus size={16} />,
  },
  // {
  //   title: "Deactivate Account Requests",
  //   value: "Deactivate",
  //   icon: IconUserX,
  // },
  // {
  //   title: "Freeze Account Requests",
  //   value: "Freeze",
  //   icon: IconSnowflake,
  // },
  // {
  //   title: "Unfreeze Accounts Requests",
  //   value: "Unfreeze",
  //   icon: IconSnowflakeOff,
  // },
];

export default function TabsContainerSuspense() {
  return (
    <Suspense>
      <TabsContainer />
    </Suspense>
  );
}
