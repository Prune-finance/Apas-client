"use client";

import localFont from "next/font/local";
import { Text } from "@mantine/core";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "@/ui/styles/accounts.module.scss";

import TabsContainer from "./tabs";

const switzer = localFont({
  src: "../../../../assets/fonts/Switzer-Regular.woff2",
});

export default function DebitRequests() {
  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Requests", href: "/admin/requests" },
        ]}
      />

      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            All Requests
          </Text>
        </div>

        <TabsContainer />
      </div>
    </main>
  );
}
