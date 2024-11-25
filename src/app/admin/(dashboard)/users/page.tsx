"use client";

import { TabsPanel, Text } from "@mantine/core";
import styles from "./styles.module.scss";
import TabsComponent from "@/ui/components/Tabs";
import { IconUsers } from "@tabler/icons-react";
import { Suspense } from "react";
import Users from "./(tabs)/Users";
import EmptyTable from "@/ui/components/EmptyTable";
import BusinessUsers from "./(tabs)/BusinessUsers";
import { useSearchParams } from "next/navigation";

function UsersManagement() {
  const searchParam = useSearchParams();
  const tab = searchParam.get("tab");
  return (
    <main className={styles.main}>
      {/* <Breadcrumbs items={[{ title: "Users", href: "/admin/users" }]} /> */}
      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            User Management
          </Text>
        </div>
        <>
          <TabsComponent
            defaultValue={
              tabs.find((t) => t.value === tab)?.value ?? tabs[0].value
            }
            tabs={tabs}
            tt="capitalize"
            mt={32}
            keepMounted={false}
          >
            <TabsPanel value={tabs[0].value}>
              <Users />
            </TabsPanel>

            <TabsPanel value={tabs[1].value}>
              <BusinessUsers />
            </TabsPanel>
          </TabsComponent>
        </>
      </div>
    </main>
  );
}

const tabs = [
  { title: "Own Users", value: "Users", icon: <IconUsers size={14} /> },
  {
    title: "Business Users",
    value: "Business Users",
    icon: <IconUsers size={14} />,
  },
];

export default function UsersManagementSuspense() {
  return (
    <Suspense>
      <UsersManagement />
    </Suspense>
  );
}
