import { Box, Group, NumberInput, Stack, Text } from "@mantine/core";
import { NumberInputWithInsideLabel } from "./TextInputWithInsideLabel";
import { IconCurrencyPound } from "@tabler/icons-react";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";

export default function VirtualAccount() {
  const form = useQuestionnaireFormContext();

  console.log(form.errors);

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Virtual Accounts Service
      </Text>

      <Stack gap={16}>
        <NumberInputWithInsideLabel
          label="How many virtual accounts do you need as a day one requirement?"
          {...form.getInputProps("virtualAccounts.day_one_requirement")}
          key={form.key("virtualAccounts.day_one_requirement")}
        />

        <NumberInputWithInsideLabel
          label="What is the projected total number of virtual accounts needed at full capacity?"
          {...form.getInputProps(
            "virtualAccounts.total_number_of_virtual_accounts"
          )}
          key={form.key("virtualAccounts.total_number_of_virtual_accounts")}
        />

        {transactionLimits.map((section, idx) => (
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

                  <NumberInput
                    leftSection={<IconCurrencyPound />}
                    placeholder="Amount"
                    w="100%"
                    className="Switzer"
                    min={0}
                    thousandSeparator=","
                    {...form.getInputProps(
                      `virtualAccounts.${
                        idx === 0
                          ? "max_value_per_transaction"
                          : idx === 1
                          ? "max_value_all_virtual_accounts"
                          : "total_highest_transaction_count"
                      }.${field}`
                    )}
                    key={form.key(
                      `virtualAccounts.${
                        idx === 0
                          ? "max_value_per_transaction"
                          : idx === 1
                          ? "max_value_all_virtual_accounts"
                          : "total_highest_transaction_count"
                      }.${field}`
                    )}
                  />
                </Group>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

type Period = "daily" | "monthly" | "annually";

interface LimitSection {
  title: string | JSX.Element;
  fields: Period[];
}

export const transactionLimits: LimitSection[] = [
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
  {
    title:
      "What is the total highest transaction count that all issued virtual accounts will process?",
    fields: ["daily", "monthly", "annually"],
  },
];
