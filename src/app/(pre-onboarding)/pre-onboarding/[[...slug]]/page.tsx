"use client";

import { Box, Container, Progress, Text } from "@mantine/core";

import Services from "./Services";
import { QuestionnaireNav } from "./QuestionnaireNav";
import OperationsAccount from "./OperationsAccount";
import VirtualAccount from "./VirtualAccount";
import {
  QuestionnaireFormProvider,
  useQuestionnaireForm,
} from "@/lib/store/questionnaire";
import Turnover from "./Turnover";

import {
  // BizBasicInfoSchema,
  OperationsAccountSchema,
  ServicesSchema,
  TurnoverSchema,
  VirtualAccountSchema,
} from "@/lib/schema";
import { useState } from "react";
import { zodResolver } from "@mantine/form";
import { z } from "zod";
import BasicInfo from "./BasicInfo";
import useAxios from "@/lib/hooks/useAxios";
import { useParams } from "next/navigation";
import { Onboarding } from "@/lib/interface";
import { useDisclosure } from "@mantine/hooks";
import ConsentModal from "./ConsentModal";
import {
  BizBasicInfoSchema,
  questionnaireValues,
} from "@/lib/schema/pre-onboarding";

export default function Questionnaire() {
  const [active, setActive] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const params = useParams();

  const questionnaireId = params?.slug?.[0];

  const form = useQuestionnaireForm({
    initialValues: questionnaireValues,
    mode: "controlled",
    validate: (values) => {
      if (active === 0) return zodResolver(BizBasicInfoSchema)(values);
      if (active === 1) return zodResolver(TurnoverSchema)(values);
      if (active === 2)
        return zodResolver(z.object({ services: ServicesSchema }))(values);
      if (active === 3)
        return zodResolver(
          z.object({
            operationsAccounts: OperationsAccountSchema,
          })
        )(values);
      if (active === 4)
        return zodResolver(z.object({ virtualAccounts: VirtualAccountSchema }))(
          values
        );

      return {};
    },
  });

  const hasVirtualAccount = Boolean(
    form.values.services.find(
      (service) => service.name === "Virtual Account Services"
    )
  );

  const { data, loading } = useAxios<Onboarding>({
    baseURL: "auth",
    endpoint: `/onboarding/get-questionnaire-by-id/${questionnaireId}`,
    enabled: !!!questionnaireId,
    dependencies: [questionnaireId],
    onSuccess: (data) => {
      form.setValues({
        ...data,
        isRegulated: data.isRegulated ? "yes" : "no",
        virtualAccounts:
          Object.keys(data.virtualAccounts).length === 0
            ? questionnaireValues.virtualAccounts
            : data.virtualAccounts,
        operationsAccounts:
          Object.keys(data.operationsAccounts).length === 0
            ? questionnaireValues.operationsAccounts
            : data.operationsAccounts,
      });
    },
  });

  return (
    <QuestionnaireFormProvider form={form}>
      <Box pos="sticky" top={0} style={{ zIndex: 100 }} bg="#FCFCFD">
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
            value={20}
            // value={calculateProgress}
            color="var(--prune-primary-600)"
          />
        </Container>
      </Box>

      <Container size={1200} mt={40}>
        <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
          Tell Us About Your Business.
        </Text>
        {active === 0 && <BasicInfo />}
        {active === 3 && <OperationsAccount />}
        {active === 4 && <VirtualAccount />}
        {active === 2 && <Services />}
        {active === 1 && <Turnover />}

        <QuestionnaireNav
          onNext={() => {
            if (active === 3 && !hasVirtualAccount) return open();
            if (active === 4) return open();
            setActive((prev) => Math.min(prev + 1, 4));
          }}
          disabledPrev={active === 0}
          // disabled={active === 4}
          onPrevious={() => {
            setActive((prev) => Math.max(prev - 1, 0));
          }}
          nextText={
            (active === 3 && !hasVirtualAccount) || active === 4
              ? "Submit"
              : "Next"
          }
        />
      </Container>

      <ConsentModal opened={opened} close={close} />
    </QuestionnaireFormProvider>
  );
}
