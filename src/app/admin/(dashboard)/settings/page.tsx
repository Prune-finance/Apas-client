"use client";

import Image from "next/image";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  UnstyledButton,
  rem,
  Text,
  Drawer,
  Flex,
  Box,
  Divider,
  Button,
  TextInput,
  TableScrollContainer,
  Table,
  TableTh,
  TableThead,
  TableTr,
  Pagination,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
} from "@mantine/core";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/settings.module.scss";
import {
  IconDots,
  IconEye,
  IconTrash,
  IconX,
  IconCheck,
  IconSearch,
  IconListTree,
  IconLogs,
  IconAccessible,
  IconNotification,
} from "@tabler/icons-react";
import EmptyImage from "@/assets/empty.png";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import { formatNumber } from "@/lib/utils";
import { AllBusinessSkeleton } from "@/lib/static";
import { useBusiness } from "@/lib/hooks/businesses";
import { switzer } from "@/app/layout";
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
