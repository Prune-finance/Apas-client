"use client";

import Navbar from "@/app/(pre-onboarding)/Navbar";
import { AppShell, Box, Center, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({
  children,
}: Readonly<OnboardingLayoutProps>) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      navbar={{
        width: 364,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      bg="#fff"
    >
      <AppShell.Navbar withBorder={false}>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size={462}>
          <Center h="100dvh" w="100%">
            {children}
          </Center>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
