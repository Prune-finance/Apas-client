"use client";

import { Text } from "@mantine/core";
import { Suspense } from "react";
import styles from "./styles.module.scss";
import Users from "./(tabs)/Users";

// Admins only. The old page with the Business Users tab is kept at
// /admin/user-old.
function UsersManagement() {
  return (
    <main className={styles.main}>
      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            User Management
          </Text>
        </div>

        <Users />
      </div>
    </main>
  );
}

export default function UsersManagementSuspense() {
  // Users reads the URL's filter params, which needs a Suspense boundary
  return (
    <Suspense>
      <UsersManagement />
    </Suspense>
  );
}
