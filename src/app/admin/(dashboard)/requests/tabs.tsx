"use client";

import {
  IconUserPlus,
  IconCircleArrowUpRight,
  IconCircleKey,
  IconArrowUpRight,
  IconRosetteDiscountCheck,
} from "@tabler/icons-react";

import { TabsPanel } from "@mantine/core";
import Debit from "./(tabs)/debit";
import Reactivate from "./(tabs)/reactivate";

import Services from "./(tabs)/services";

import TabsComponent from "@/ui/components/Tabs";
import LiveKeySuspense from "./(tabs)/live-key";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAdminAccess } from "@/lib/hooks/privileges";
import PayoutRequests from "./(tabs)/payouts";
import OtherCurrency from "./(tabs)/otherCurrencies";

// import PayoutRequestsSuspense from "./(tabs)/payouts";

function TabsContainer() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { can } = useAdminAccess();
  // each request type shows only with its view privilege
  const visibleTabs = tabs.filter((t) => can(t.privilege));
  const shows = (value: string) => visibleTabs.some((t) => t.value === value);

  return (
    <TabsComponent
      defaultValue={
        visibleTabs.find((t) => t.value === tab)?.value ?? visibleTabs[0]?.value
      }
      onChange={(value) => {
        window.history.pushState({}, "", "?tab=" + value);
      }}
      tabs={visibleTabs}
      mt={24}
      tt="capitalize"
      fz={12}
      keepMounted={false}
    >
      {shows("Debit") && (
        <TabsPanel value="Debit">
          <Debit />
        </TabsPanel>
      )}

      {shows("services") && (
        <TabsPanel value="services">
          <Services />
        </TabsPanel>
      )}

      {shows("other-currencies") && (
        <TabsPanel value="other-currencies">
          <OtherCurrency />
        </TabsPanel>
      )}

      {shows("live-keys") && (
        <TabsPanel value="live-keys">
          <LiveKeySuspense />
        </TabsPanel>
      )}

      {shows("payout-requests") && (
        <TabsPanel value="payout-requests">
          <PayoutRequests />
        </TabsPanel>
      )}

      {shows("other-requests") && (
        <TabsPanel value="other-requests">
          <Reactivate />
        </TabsPanel>
      )}
    </TabsComponent>
  );
}

const tabs = [
  {
    title: "Debit",
    value: "Debit",
    privilege: "debit-requests.view",
    icon: <IconCircleArrowUpRight size={16} />,
  },
  {
    title: "Services",
    value: "services",
    privilege: "service-requests.view",
    icon: <IconUserPlus size={16} />,
  },

  {
    title: "Other currencies",
    value: "other-currencies",
    privilege: "currency-requests.view",
    icon: <IconRosetteDiscountCheck size={16} />,
  },

  {
    title: "Live Keys",
    value: "live-keys",
    privilege: "live-key-requests.view",
    icon: <IconCircleKey size={16} />,
  },
  {
    title: "Payout Requests",
    value: "payout-requests",
    privilege: "payout-requests.view",
    icon: <IconArrowUpRight size={16} />,
  },
  {
    title: "Other Requests",
    value: "other-requests",
    privilege: "reactivation-requests.view",
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
