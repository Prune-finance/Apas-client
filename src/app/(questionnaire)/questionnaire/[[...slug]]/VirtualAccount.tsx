import { Box, Group, NumberInput, Stack, Text } from "@mantine/core";
import React from "react";
import {
  NumberInputWithInsideLabel,
  TextInputWithInsideLabel,
} from "./TextInputWithInsideLabel";
import { IconCurrencyPound } from "@tabler/icons-react";
import { QuestionnaireNav } from "./QuestionnaireNav";

export default function VirtualAccount() {
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Virtual Accounts Service
      </Text>

      <Stack gap={16}>
        <NumberInputWithInsideLabel label="How many virtual accounts do you need as a day one requirement?" />

        <NumberInputWithInsideLabel label="What is the projected total number of virtual accounts needed at full capacity?" />

        {transactionLimits.map((section, idx) => (
          <Stack key={idx} gap={16}>
            <Text c="var(--prune-text-gray-500)" fw={500} fz={16}>
              {section.title}
            </Text>
            <Stack gap={16}>
              {section.fields.map((field, idx) => (
                <Group gap={16} key={idx} wrap="nowrap">
                  <Text
                    w={56}
                    c="var(--prune-text-gray-500)"
                    fw={500}
                    fz={14}
                    tt="capitalize"
                  >
                    {field}
                  </Text>

                  <NumberInput
                    leftSection={<IconCurrencyPound />}
                    placeholder="Amount"
                    w="100%"
                  />
                </Group>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>

      <QuestionnaireNav nextText="Submit" />
    </Box>
  );
}

type Period = "daily" | "monthly" | "annually";

interface LimitSection {
  title: string;
  fields: Period[];
}

export const transactionLimits: LimitSection[] = [
  {
    title:
      "Please indicate the maximum value processed per transaction by a single virtual account",
    fields: ["daily", "monthly", "annually"],
  },
  {
    title:
      "Please indicate the maximum value processed per transaction by all virtual account",
    fields: ["daily", "monthly", "annually"],
  },
  {
    title:
      "What is the total highest transaction count that all issued virtual accounts will process?",
    fields: ["daily", "monthly", "annually"],
  },
];
