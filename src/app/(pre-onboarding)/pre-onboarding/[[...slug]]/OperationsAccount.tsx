import { Box, RadioGroup, Stack, Text } from "@mantine/core";
import CustomRadio from "./CustomRadio";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { operationsAccountEstimatedBalance } from "@/lib/static";

export default function OperationsAccount() {
  const form = useQuestionnaireFormContext();

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        Operations Account
      </Text>

      <RadioGroup
        name="operations-account-balance"
        label="Please indicate the estimated balance(s) you will hold in the operating account(s)"
        {...form.getInputProps("operationsAccounts.estimated_balance")}
        key={form.key("operationsAccounts.estimated_balance")}
        labelProps={{
          fz: 16,
          fw: 500,
          c: "var(--prune-text-gray-500)",
          mb: 16,
        }}
        errorProps={{ mt: 10 }}
      >
        <Stack gap={20} mt="xs" style={{ cursor: "pointer" }}>
          {Object.entries(operationsAccountEstimatedBalance).map(
            ([value, label], idx) => (
              <CustomRadio key={idx} value={value} label={label} />
            )
          )}
        </Stack>
      </RadioGroup>
    </Box>
  );
}
