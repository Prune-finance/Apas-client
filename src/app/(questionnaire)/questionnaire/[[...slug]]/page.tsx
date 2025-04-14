"use client";

import { formatNumber } from "@/lib/utils";
import { Box, Group, Radio, RadioGroup, Stack, Text } from "@mantine/core";
import CustomRadio from "./CustomRadio";
import { validateEditUser } from "@/lib/schema";
import { useState } from "react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { useParams, useRouter } from "next/navigation";
import Services from "./Services";
import { QuestionnaireNav } from "./QuestionnaireNav";
import OperationsAccount from "./OperationsAccount";

export default function Questionnaire() {
  const [turnover, setTurnover] = useState("");
  const params = useParams();
  const { push } = useRouter();

  // console.log(params?.slug);
  if (
    params?.slug &&
    params?.slug[0] === "services" &&
    params.slug[1] === "operations-account"
  )
    return <OperationsAccount />;

  if (params?.slug && params?.slug[0] === "services") return <Services />;

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Tell Us More About Your Business.
      </Text>
      <RadioGroup
        name="annual-turnover"
        label="What is this entity's annual turnover?"
        value={turnover}
        onChange={setTurnover}
        labelProps={{
          fz: 16,
          fw: 500,
          c: "var(--prune-text-gray-500)",
          mb: 16,
        }}
      >
        <Stack gap={20} mt="xs" style={{ cursor: "pointer" }}>
          {Object.entries(turnoverOptions).map(([value, label], idx) => (
            <CustomRadio
              key={idx}
              value={value}
              label={label}
              selected={value === turnover}
            />
          ))}
        </Stack>
      </RadioGroup>
      <QuestionnaireNav onNext={() => push("/questionnaire/services")} />
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
