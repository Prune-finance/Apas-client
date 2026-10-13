"use client";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Header from "@/ui/components/Header";
import Navbar from "@/ui/components/Navbar";
import DashboardWave from "./DashboardWave";

import styles from "@/ui/styles/layout.module.scss";
import { switzer } from "@/ui/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <html lang="en">
      <body className={switzer.className}>
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

          <AppShellNavbar p="md">
            <Navbar />
          </AppShellNavbar>

          <AppShellMain>
            <DashboardWave />
            <Container p={0} fluid>
              {children}
            </Container>
          </AppShellMain>
        </AppShell>
      </body>
    </html>
  );
}
