"use client";

import { Text, Tabs, TabsList, TabsTab, TabsPanel } from "@mantine/core";

import styles from "@/ui/styles/settings.module.scss";
import { IconLogs, IconNotification } from "@tabler/icons-react";

import Logs from "./(tabs)/logs";
import { useState } from "react";
import Notifications from "./(tabs)/notifications";

export default function DebitRequests() {
  const [tab, setTab] = useState<string | null>("Logs");
  return (
    <main className={styles.main}>
      {/* <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/admin/dashboard" },
          { title: `${tab}`, href: "/admin/settings" },
        ]}
      /> */}

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Settings
          </Text>
        </div>

        <Tabs
          // defaultValue="Logs"
          value={tab}
          onChange={setTab}
          variant="pills"
          classNames={{
            root: styles.tabs,
            list: styles.tabs__list,
            tab: styles.tab,
          }}
          mt={24}
        >
          <TabsList>
            {tabs.map((tab) => (
              <TabsTab
                key={tab.title}
                value={tab.value || tab.title}
                leftSection={tab.icon}
              >
                {tab.title}
              </TabsTab>
            ))}
          </TabsList>

          <TabsPanel value="Logs">
            <Logs />
          </TabsPanel>
          <TabsPanel value="Notifications">
            <Notifications />
          </TabsPanel>
        </Tabs>
      </div>
    </main>
  );
}

const tabs = [
  { title: "Audit Logs", value: "Logs", icon: <IconLogs size={14} /> },
  { title: "Notifications", icon: <IconNotification size={14} /> },
];
