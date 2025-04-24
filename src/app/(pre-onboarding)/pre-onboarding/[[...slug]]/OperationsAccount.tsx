import { Box, RadioGroup, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import CustomRadio from "./CustomRadio";
import { QuestionnaireNav } from "./QuestionnaireNav";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { useDisclosure } from "@mantine/hooks";
import ConsentModal from "./ConsentModal";

export default function OperationsAccount() {
  const { push, back } = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const form = useQuestionnaireFormContext();
  const isVirtualAccount = Boolean(
    form
      .getValues()
      .services.find((service) => service.name === "Virtual Account Services")
  );

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Operations Account
      </Text>

      <RadioGroup
        name="operations-account-balance"
        label="Please indicate the estimated balance(s) you will hold in the operating account(s)"
        {...form.getInputProps("operationsAccount.estimatedBalance")}
        key={form.key("operationsAccount.estimatedBalance")}
        labelProps={{
          fz: 16,
          fw: 500,
          c: "var(--prune-text-gray-500)",
          mb: 16,
        }}
        errorProps={{ mt: 10 }}
      >
        <Stack gap={20} mt="xs" style={{ cursor: "pointer" }}>
          {Object.entries(estimatedBalance).map(([value, label], idx) => (
            <CustomRadio key={idx} value={value} label={label} />
          ))}
        </Stack>
      </RadioGroup>
      <QuestionnaireNav
        nextText={!isVirtualAccount ? "Submit" : "Next"}
        onNext={() => {
          if (!isVirtualAccount) return open();
          push("/pre-onboarding/services/virtual-account");
        }}
        onPrevious={back}
      />

      <ConsentModal opened={opened} close={close} />
    </Box>
  );
}

const estimatedBalance = {
  "less-than-10000": `Less than ${formatNumber(10000, true, "GBP")}`,
  "between-10000-50000": `Between ${formatNumber(
    10000,
    true,
    "GBP"
  )} - ${formatNumber(50000, true, "GBP")}`,
  "between-50000-100000": `Between ${formatNumber(
    50000,
    true,
    "GBP"
  )} - ${formatNumber(100000, true, "GBP")}`,
  "between-100000-500000": `Between ${formatNumber(
    100000,
    true,
    "GBP"
  )} - ${formatNumber(500000, true, "GBP")}`,
  "above-500000": `Above ${formatNumber(500000, true, "GBP")}`,
} as const;
