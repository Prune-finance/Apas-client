"use client";

import { IconPointFilled, IconFiles, IconKey } from "@tabler/icons-react";
import { IconBuildingSkyscraper, IconCurrencyEuro } from "@tabler/icons-react";
import { IconListTree, IconUsers, IconUsersGroup } from "@tabler/icons-react";

import styles from "@/ui/styles/accounts.module.scss";
import { TabsList, TabsTab, Tabs, TabsPanel } from "@mantine/core";
import Debit from "./(tabs)/debit";

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
        <TabsTab
          value="Debit"
          leftSection={<IconBuildingSkyscraper size={14} />}
        >
          Debit Requests
        </TabsTab>

        {/* <TabsTab
          value="Freeze"
          leftSection={<IconBuildingSkyscraper size={14} />}
        >
          Freeze Requests
        </TabsTab> */}
      </TabsList>

      <TabsPanel value="Debit">
        <Debit />
      </TabsPanel>
    </Tabs>
  );
}
