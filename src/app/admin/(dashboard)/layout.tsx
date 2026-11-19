"use client";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { AdminPageGuard } from "@/lib/hooks/privileges";
import { refreshAdminMe } from "@/lib/hooks/adminRoles";

import Header from "@/ui/components/Header";
import Navbar from "@/ui/components/Navbar";

import styles from "@/ui/styles/layout.module.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  // keep the stored /admin/me (role + privileges) current, not just as it
  // was at login
  useEffect(() => {
    refreshAdminMe();
  }, []);

  return (
    <AppShell
      layout="alt"
      header={{ height: 56 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="xl"
      classNames={{ main: styles.main }}
      className={styles.admin__shell}
    >
      <AppShellHeader withBorder={false} className={styles.admin__header}>
        <Header />
      </AppShellHeader>

      <AppShellNavbar p="md" className={styles.admin__navbar}>
        <Navbar />
      </AppShellNavbar>

      <AppShellMain>
        <Container p={0} fluid>
          {/* pages the admin has no privilege for show "no access" */}
          <AdminPageGuard>{children}</AdminPageGuard>
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
