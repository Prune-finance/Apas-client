"use client";

import "@/ui/styles/globals.scss";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "./Navbar";

export default function QuestionnaireLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened] = useDisclosure();

  return (
    <AppShell
      navbar={{ width: 364, breakpoint: "sm", collapsed: { mobile: !opened } }}
      bg="#fff"
    >
      <AppShell.Navbar withBorder={false}>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main pb="lg">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
