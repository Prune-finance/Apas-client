import { Box, Text, RadioGroup, Stack } from "@mantine/core";
import React from "react";
import CustomRadio from "./CustomRadio";
import { turnoverOptions } from "./page";
import { QuestionnaireNav } from "./QuestionnaireNav";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { useRouter } from "next/navigation";

export default function Turnover() {
  const form = useQuestionnaireFormContext();
  const { push } = useRouter();
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Tell Us More About Your Business.
      </Text>
      <RadioGroup
        name="turnover"
        label="What is this entity's annual turnover?"
        {...form.getInputProps("turnover")}
        key={form.key("turnover")}
        errorProps={{ mt: 10 }}
        labelProps={{
          fz: 16,
          fw: 500,
          c: "var(--prune-text-gray-500)",
          mb: 16,
        }}
      >
        <Stack gap={20} mt="xs" style={{ cursor: "pointer" }}>
          {Object.entries(turnoverOptions).map(([value, label], idx) => (
            <CustomRadio key={idx} value={value} label={label} />
          ))}
        </Stack>
      </RadioGroup>
      <QuestionnaireNav
        onNext={() => push("/pre-onboarding/services")}
        disabledPrev
      />
    </Box>
  );
}
