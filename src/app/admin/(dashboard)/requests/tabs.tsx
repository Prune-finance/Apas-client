"use client";

import {
  IconPointFilled,
  IconFiles,
  IconKey,
  IconUserPlus,
  IconUserX,
  IconSnowflake,
  IconSnowflakeOff,
  IconArrowUpRightCircle,
  IconCircleArrowUpRight,
  IconCircleKey,
  IconMoneybag,
} from "@tabler/icons-react";
import { IconBuildingSkyscraper, IconCurrencyEuro } from "@tabler/icons-react";
import { IconListTree, IconUsers, IconUsersGroup } from "@tabler/icons-react";

import styles from "@/ui/styles/accounts.module.scss";
import { TabsList, TabsTab, Tabs, TabsPanel } from "@mantine/core";
import Debit from "./(tabs)/debit";
import Reactivate from "./(tabs)/reactivate";
import Deactivate from "./(tabs)/deactivate";
import PayoutAccount from "./(tabs)/payout";
import Unfreeze from "./(tabs)/live-key";
import TabsComponent from "@/ui/components/Tabs";
import LiveKeySuspense from "./(tabs)/live-key";

export default function TabsContainer() {
  return (
    <TabsComponent tabs={tabs} mt={24} tt="capitalize" fz={12}>
      <TabsPanel value={tabs[0].value}>
        <Debit />
      </TabsPanel>

      <TabsPanel value={tabs[1].value}>
        <PayoutAccount />
      </TabsPanel>

      <TabsPanel value={tabs[2].value}>
        <LiveKeySuspense />
      </TabsPanel>

      <TabsPanel value={tabs[3].value}>
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
    title: "Services",
    value: "services",
    icon: <IconUserPlus size={16} />,
  },
  {
    title: "Live Keys",
    value: "live-keys",
    icon: <IconCircleKey size={16} />,
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
