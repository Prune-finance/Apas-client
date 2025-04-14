"use client";

import {
  AppShell,
  Box,
  Burger,
  Container,
  Divider,
  Group,
  Progress,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function QuestionnaireLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Navbar p="md" withBorder={false}>
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Box pos="sticky" top={0} bg="#FCFCFD" mb={30} style={{ zIndex: 100 }}>
          <Container size={1200} pt={30} pb={20}>
            <Text
              ta="left"
              mb={30}
              c="var(--prune-text-gray-700)"
              fz={24}
              fw={500}
            >
              Prune Onboarding: Company Profile
            </Text>
            <Progress value={50} color="var(--prune-primary-600)" />
          </Container>
        </Box>

        <Container size={1200}>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
}
