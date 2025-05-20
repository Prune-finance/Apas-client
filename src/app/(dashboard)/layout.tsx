"use client";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import localFont from "next/font/local";

import { UserHeader } from "@/ui/components/Header";
import { UserNavbar } from "@/ui/components/Navbar";

const switzer = localFont({
  src: "../../assets/fonts/Switzer-Regular.woff2",
});

import styles from "@/ui/styles/layout.module.scss";

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
          classNames={{
            main: styles.user__main,
            navbar: styles.navbar,
            header: styles.user__header,
          }}
        >
          <AppShellHeader withBorder={false}>
            <UserHeader />
          </AppShellHeader>

          <AppShellNavbar p="md">
            <UserNavbar />
          </AppShellNavbar>

          <AppShellMain>
            <Container p={0} fluid mt={80}>
              {children}
            </Container>
          </AppShellMain>
        </AppShell>
      </body>
    </html>
  );
}
