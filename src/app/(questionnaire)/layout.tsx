"use client";

import {
  OperationsAccountSchema,
  questionnaireValues,
  ServicesSchema,
  TurnoverSchema,
  VirtualAccountSchema,
} from "@/lib/schema";
import {
  QuestionnaireFormProvider,
  useQuestionnaireForm,
} from "@/lib/store/questionnaire";
import { AppShell, Box, Container, Progress, Text } from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Navbar from "./Navbar";
import { z } from "zod";

export default function QuestionnaireLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();
  const params = useParams();
  const { slug } = params;
  const isServices = slug && slug[0] === "services";
  const isOperationsAccount = isServices && slug[1] === "operations-account";
  const isVirtualAccount = isServices && slug[1] === "virtual-account";

  const form = useQuestionnaireForm({
    initialValues: questionnaireValues,
    mode: "uncontrolled",
    validate: (values) => {
      if (slug === undefined) return zodResolver(TurnoverSchema)(values);
      if (isOperationsAccount)
        return zodResolver(
          z.object({
            operationsAccount: OperationsAccountSchema,
          })
        )(values);
      if (isVirtualAccount)
        return zodResolver(z.object({ virtualAccount: VirtualAccountSchema }))(
          values
        );
      if (isServices)
        return zodResolver(z.object({ services: ServicesSchema }))(values);

      return {};
    },
  });

  const calculateProgress = useMemo(() => {
    switch (true) {
      case slug === undefined:
        return 25;
      case isOperationsAccount:
        if (
          !form
            .getValues()
            .services.find(
              (service) => service.name === "Virtual Account Services"
            )
        ) {
          return 100;
        }
        return 75;
      case isVirtualAccount:
        return 100;
      case isServices:
        return 50;
      default:
        return 100;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug?.[0], slug?.[1], isOperationsAccount, isServices]);

  return (
    <AppShell
      navbar={{ width: 364, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Navbar withBorder={false}>
        <Navbar />
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
            <Progress
              value={calculateProgress}
              color="var(--prune-primary-600)"
            />
          </Container>
        </Box>

        <Container size={1200}>
          <QuestionnaireFormProvider form={form}>
            {children}
          </QuestionnaireFormProvider>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
