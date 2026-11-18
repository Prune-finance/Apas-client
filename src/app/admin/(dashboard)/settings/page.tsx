"use client";

import { Text, Tabs, TabsList, TabsTab, TabsPanel } from "@mantine/core";

import styles from "@/ui/styles/settings.module.scss";
import { IconCoins, IconLogs, IconNotification } from "@tabler/icons-react";

import Logs from "./(tabs)/logs";
import { useState } from "react";
import Notifications from "./(tabs)/notifications";
import RateCurrencies from "./(tabs)/currencies";
import { useAdminAccess } from "@/lib/hooks/privileges";

export default function DebitRequests() {
  const [tab, setTab] = useState<string | null>("Logs");
  const { can } = useAdminAccess();

  // each tab shows only with its view privilege
  const visibleTabs = tabs.filter((t) => can(t.privilege));
  const shows = (value: string) => visibleTabs.some((t) => t.value === value);
  // fall back to the first tab this admin can see
  const activeTab = tab && shows(tab) ? tab : visibleTabs[0]?.value ?? null;

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
          value={activeTab}
          onChange={setTab}
          variant="pills"
          // Only the open tab is mounted, so each tab fetches when you navigate to it
          keepMounted={false}
          classNames={{
            root: styles.tabs,
            list: styles.tabs__list,
            tab: styles.tab,
          }}
          mt={24}
        >
          <TabsList>
            {visibleTabs.map((tab) => (
              <TabsTab key={tab.title} value={tab.value} leftSection={tab.icon}>
                {tab.title}
              </TabsTab>
            ))}
          </TabsList>

          {shows("Logs") && (
            <TabsPanel value="Logs">
              <Logs />
            </TabsPanel>
          )}
          {shows("Notifications") && (
            <TabsPanel value="Notifications">
              <Notifications />
            </TabsPanel>
          )}
          {shows("Currencies") && (
            <TabsPanel value="Currencies">
              <RateCurrencies />
            </TabsPanel>
          )}
        </Tabs>
      </div>
    </main>
  );
}

const tabs = [
  {
    title: "Audit Logs",
    value: "Logs",
    privilege: "logs.view",
    icon: <IconLogs size={14} />,
  },
  {
    title: "Notifications",
    value: "Notifications",
    privilege: "notifications.view",
    icon: <IconNotification size={14} />,
  },
  {
    title: "Rate Currencies",
    value: "Currencies",
    privilege: "currencies.view",
    icon: <IconCoins size={14} />,
  },
];
