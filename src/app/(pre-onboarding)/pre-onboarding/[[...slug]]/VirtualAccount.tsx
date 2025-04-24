import { Box, Group, NumberInput, Stack, Text } from "@mantine/core";
import { NumberInputWithInsideLabel } from "./TextInputWithInsideLabel";
import { IconCurrencyPound } from "@tabler/icons-react";
import { QuestionnaireNav } from "./QuestionnaireNav";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { useRouter } from "next/navigation";

export default function VirtualAccount() {
  const form = useQuestionnaireFormContext();
  const { back } = useRouter();

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Virtual Accounts Service
      </Text>

      <Stack gap={16}>
        <NumberInputWithInsideLabel
          label="How many virtual accounts do you need as a day one requirement?"
          {...form.getInputProps("virtualAccount.numberOfAccounts")}
          key={form.key("virtualAccount.numberOfAccounts")}
        />

        <NumberInputWithInsideLabel
          label="What is the projected total number of virtual accounts needed at full capacity?"
          {...form.getInputProps("virtualAccount.projectedTotalAccounts")}
          key={form.key("virtualAccount.projectedTotalAccounts")}
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
                      `virtualAccount.${
                        idx === 0
                          ? "singleAccount"
                          : idx === 1
                          ? "allAccounts"
                          : "transactionCount"
                      }.${field}`
                    )}
                    key={form.key(
                      `virtualAccount.${
                        idx === 0
                          ? "singleAccount"
                          : idx === 1
                          ? "allAccounts"
                          : "transactionCount"
                      }.${field}`
                    )}
                  />
                </Group>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>

      <QuestionnaireNav nextText="Submit" onPrevious={back} />
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
