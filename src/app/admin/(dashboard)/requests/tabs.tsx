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
} from "@tabler/icons-react";
import { IconBuildingSkyscraper, IconCurrencyEuro } from "@tabler/icons-react";
import { IconListTree, IconUsers, IconUsersGroup } from "@tabler/icons-react";

import styles from "@/ui/styles/accounts.module.scss";
import { TabsList, TabsTab, Tabs, TabsPanel } from "@mantine/core";
import Debit from "./(tabs)/debit";
import Reactivate from "./(tabs)/reactivate";
import Deactivate from "./(tabs)/deactivate";
import PayoutAccount from "./(tabs)/payout";
import Unfreeze from "./(tabs)/unfreeze";
import TabsComponent from "@/ui/components/Tabs";

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
