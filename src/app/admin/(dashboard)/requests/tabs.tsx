"use client";

import {
  IconPointFilled,
  IconFiles,
  IconKey,
  IconUserPlus,
  IconUserX,
  IconSnowflake,
  IconSnowflakeOff,
} from "@tabler/icons-react";
import { IconBuildingSkyscraper, IconCurrencyEuro } from "@tabler/icons-react";
import { IconListTree, IconUsers, IconUsersGroup } from "@tabler/icons-react";

import styles from "@/ui/styles/accounts.module.scss";
import { TabsList, TabsTab, Tabs, TabsPanel } from "@mantine/core";
import Debit from "./(tabs)/debit";
import Reactivate from "./(tabs)/reactivate";
import Deactivate from "./(tabs)/deactivate";
import Freeze from "./(tabs)/freeze";
import Unfreeze from "./(tabs)/unfreeze";

export default function TabsContainer() {
  return (
    <Tabs
      mt={24}
      defaultValue="Debit"
      variant="pills"
      classNames={{
        root: styles.tabs,
        list: styles.tabs__list,
        tab: styles.tab,
      }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTab
            key={tab.value}
            value={tab.value}
            leftSection={<tab.icon size={14} />}
          >
            {tab.title}
          </TabsTab>
        ))}

        {/* <TabsTab
          value="Freeze"
          leftSection={<IconBuildingSkyscraper size={14} />}
        >
          Freeze Requests
        </TabsTab> */}
      </TabsList>

      <TabsPanel value={tabs[0].value}>
        <Debit />
      </TabsPanel>

      <TabsPanel value={tabs[1].value}>
        <Reactivate />
      </TabsPanel>

      <TabsPanel value={tabs[2].value}>
        <Deactivate />
      </TabsPanel>

      <TabsPanel value={tabs[3].value}>
        <Freeze />
      </TabsPanel>

      <TabsPanel value={tabs[4].value}>
        <Unfreeze />
      </TabsPanel>
    </Tabs>
  );
}

const tabs = [
  { title: "Debit Requests", value: "Debit", icon: IconBuildingSkyscraper },
  {
    title: "Reactivate Account Requests",
    value: "Reactivate",
    icon: IconUserPlus,
  },
  {
    title: "Deactivate Account Requests",
    value: "Deactivate",
    icon: IconUserX,
  },
  {
    title: "Freeze Account Requests",
    value: "Freeze",
    icon: IconSnowflake,
  },
  {
    title: "Unfreeze Accounts Requests",
    value: "Unfreeze",
    icon: IconSnowflakeOff,
  },
];
