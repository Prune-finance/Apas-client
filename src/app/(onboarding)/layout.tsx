"use client";

import "@/ui/styles/globals.scss";

import { AppShell, Box, Container, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "./Header";

export default function QuestionnaireLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 56 }} bg="#fff">
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main pb="lg">
        <Container size={1200} mt={40}>
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
