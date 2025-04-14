import { Box, RadioGroup, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import CustomRadio from "./CustomRadio";
import { turnoverOptions } from "./page";
import { QuestionnaireNav } from "./QuestionnaireNav";
import { useRouter } from "next/navigation";

export default function OperationsAccount() {
  const [turnover, setTurnover] = useState("");
  const { push } = useRouter();
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Operations Account
      </Text>

      <RadioGroup
        name="operations-account-balance"
        label="Please indicate the estimated balance(s) you will hold in the operating account(s)"
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
      <QuestionnaireNav
        onNext={() => push("/questionnaire/services/virtual-account")}
      />
    </Box>
  );
}
