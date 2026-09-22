import { Box, Group, Stack, Text } from "@mantine/core";
import { NumberInputWithInsideLabel } from "@/ui/components/InputWithLabel/QuestInputs";
import { IconCurrencyPound } from "@tabler/icons-react";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import type React from "react";

const digitsOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/^\d$/.test(e.key) &&
    !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(e.key)
  ) {
    e.preventDefault();
  }
};

export default function VirtualAccount() {
  const form = useQuestionnaireFormContext();

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Virtual Accounts Service
      </Text>

      <Stack gap={16}>
        <NumberInputWithInsideLabel
          label="How many virtual accounts do you need as a day one requirement?"
          allowDecimal={false}
          allowNegative={false}
          min={1}
          max={Number.MAX_SAFE_INTEGER}
          onKeyDown={digitsOnly}
          {...form.getInputProps("virtualAccounts.day_one_requirement")}
          key={form.key("virtualAccounts.day_one_requirement")}
        />

        <NumberInputWithInsideLabel
          label="What is the projected total number of virtual accounts needed at full capacity?"
          allowDecimal={false}
          allowNegative={false}
          min={1}
          max={Number.MAX_SAFE_INTEGER}
          onKeyDown={digitsOnly}
          {...form.getInputProps("virtualAccounts.total_number_of_virtual_accounts")}
          key={form.key("virtualAccounts.total_number_of_virtual_accounts")}
        />

        {currencyLimits.map((section, idx) => (
          <Stack key={idx} gap={16}>
            <Text c="var(--prune-text-gray-500)" fw={500} fz={16}>
              {section.title}
            </Text>
            <Stack gap={16}>
              {section.fields.map((field, innerIdx) => (
                <Group gap={16} key={innerIdx} wrap="nowrap">
                  <Text
                    w={56}
                    c="var(--prune-text-gray-500)"
                    fw={500}
                    fz={14}
                    tt="capitalize"
                  >
                    {field}
                  </Text>
                  <NumberInputWithInsideLabel
                    leftSection={<IconCurrencyPound />}
                    label="Amount"
                    w="100%"
                    className="Switzer"
                    allowNegative={false}
                    min={1}
                    max={Number.MAX_SAFE_INTEGER}
                    {...form.getInputProps(
                      `virtualAccounts.${
                        idx === 0
                          ? "max_value_per_transaction"
                          : "max_value_all_virtual_accounts"
                      }.${field}`
                    )}
                    key={form.key(
                      `virtualAccounts.${
                        idx === 0
                          ? "max_value_per_transaction"
                          : "max_value_all_virtual_accounts"
                      }.${field}`
                    )}
                  />
                </Group>
              ))}
            </Stack>
          </Stack>
        ))}

        <Stack gap={16}>
          <Text c="var(--prune-text-gray-500)" fw={500} fz={16}>
            What is the total highest transaction count that all issued virtual accounts will process?
          </Text>
          <NumberInputWithInsideLabel
            label="Count"
            allowDecimal={false}
            allowNegative={false}
            min={1}
            max={Number.MAX_SAFE_INTEGER}
            onKeyDown={digitsOnly}
            {...form.getInputProps("virtualAccounts.total_highest_transaction_count.daily")}
            key={form.key("virtualAccounts.total_highest_transaction_count.daily")}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

type Period = "daily" | "monthly" | "annually";

interface LimitSection {
  title: string | JSX.Element;
  fields: Period[];
}

export const currencyLimits: LimitSection[] = [
  {
    title: (
      <Text>
        Please indicate the maximum value processed per transaction by a{" "}
        <Text fw={700} inherit span>
          single
        </Text>{" "}
        virtual account
      </Text>
    ),
    fields: ["daily", "monthly", "annually"],
  },
  {
    title: (
      <Text>
        Please indicate the maximum value processed per transaction by{" "}
        <Text fw={700} inherit span>
          all
        </Text>{" "}
        virtual account
      </Text>
    ),
    fields: ["daily", "monthly", "annually"],
  },
];
