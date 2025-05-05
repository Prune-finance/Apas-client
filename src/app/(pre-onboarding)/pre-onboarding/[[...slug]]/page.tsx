"use client";

import { formatNumber } from "@/lib/utils";
import { Box, Flex, RadioGroup, Stack, Text } from "@mantine/core";
import CustomRadio from "./CustomRadio";
import { useParams, useRouter } from "next/navigation";
import Services from "./Services";
import { QuestionnaireNav } from "./QuestionnaireNav";
import OperationsAccount from "./OperationsAccount";
import VirtualAccount from "./VirtualAccount";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import Turnover from "./Turnover";
import { TextInputWithInsideLabel } from "@/ui/components/InputWithLabel";
import { IconBriefcase } from "@tabler/icons-react";

export default function Questionnaire() {
  const params = useParams();
  const { push } = useRouter();
  const form = useQuestionnaireFormContext();

  if (
    params?.slug &&
    params?.slug[0] === "services" &&
    params.slug[1] === "operations-account"
  )
    return <OperationsAccount />;

  if (
    params?.slug &&
    params?.slug[0] === "services" &&
    params.slug[1] === "virtual-account"
  )
    return <VirtualAccount />;

  if (params?.slug && params?.slug[0] === "services") return <Services />;
  if (params?.slug && params?.slug[0] === "turnover") return <Turnover />;

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Tell Us About Your Business.
      </Text>
      <Flex direction={{ base: "column", md: "row" }} align="center">
        <TextInputWithInsideLabel label="Legal Business Name" />
      </Flex>

      <QuestionnaireNav
        onNext={() => push("/pre-onboarding/services")}
        disabledPrev
      />
    </Box>
  );
}

export const turnoverOptions = {
  "less-than-10000": `Less than ${formatNumber(10000, true, "GBP")}`,
  "less-than-50000": `${formatNumber(10000, true, "GBP")} - ${formatNumber(
    50000,
    true,
    "GBP"
  )}`,
  "less-than-100000": `${formatNumber(50000, true, "GBP")} - ${formatNumber(
    100000,
    true,
    "GBP"
  )}`,
  "less-than-500000": `${formatNumber(100000, true, "GBP")} - ${formatNumber(
    500000,
    true,
    "GBP"
  )}`,
  "less-than-1000000": `More than ${formatNumber(500000, true, "GBP")}`,
} as const;
