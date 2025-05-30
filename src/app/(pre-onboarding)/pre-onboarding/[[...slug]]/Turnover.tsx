import { Box, Text, RadioGroup, Stack } from "@mantine/core";
import React from "react";
import CustomRadio from "./CustomRadio";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { formatNumber } from "@/lib/utils";

export default function Turnover() {
  const form = useQuestionnaireFormContext();

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Tell Us More About Your Business.
      </Text>
      <RadioGroup
        name="turnover"
        label="What is this entity's annual turnover?"
        {...form.getInputProps("annualTurnover")}
        key={form.key("annualTurnover")}
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
    </Box>
  );
}

const turnoverOptions = {
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
  "above-500000": `More than ${formatNumber(500000, true, "GBP")}`,
} as const;
