"use client";

import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { IconCurrencyPound } from "@tabler/icons-react";
import { NumberInputWithInsideLabel } from "@/ui/components/InputWithLabel/QuestInputs";
import CustomRadio from "@/ui/components/CustomRadio";
import { RadioGroup } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SaveProgressBtn } from "@/ui/section/onboarding/shared/utils";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";

const questAxios = createAxiosInstance("questionnaire");

interface RefOption { value: string; label: string }

type FinancialsForm = {
  // Virtual Accounts
  dayOneRequirement: number | "";
  totalVirtualAccounts: number | "";
  singleMaxDaily: number | "";
  singleMaxMonthly: number | "";
  singleMaxAnnually: number | "";
  allMaxDaily: number | "";
  allMaxMonthly: number | "";
  allMaxAnnually: number | "";
  highestTransactionCountDaily: number | "";
  // Operations Account
  operationsEstimatedBalance: string;
};

interface Props {
  adminReference: string;
  selectedServices: string[];
  onBack: () => void;
  onComplete: () => void;
}

const digitsOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^\d$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(e.key)) {
    e.preventDefault();
  }
};

export default function AdminStep3Financials({ adminReference, selectedServices, onBack, onComplete }: Props) {
  const { handleSuccess, handleError } = useNotification();
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [monetaryBands, setMonetaryBands] = useState<RefOption[]>([]);

  const hasVirtualAccounts = selectedServices.includes("VIRTUAL_ACCOUNTS");
  const hasOperationsAccount = selectedServices.includes("OPERATIONS_ACCOUNT");

  useEffect(() => {
    if (!hasOperationsAccount) return;
    questAxios
      .get("/business/questionnaire/reference-data", { params: { include: "monetaryBands" } })
      .then(({ data: res }) => setMonetaryBands(res.data?.monetaryBands ?? []))
      .catch(() => {});
  }, [hasOperationsAccount]);

  const form = useForm<FinancialsForm>({
    initialValues: {
      dayOneRequirement: "",
      totalVirtualAccounts: "",
      singleMaxDaily: "",
      singleMaxMonthly: "",
      singleMaxAnnually: "",
      allMaxDaily: "",
      allMaxMonthly: "",
      allMaxAnnually: "",
      highestTransactionCountDaily: "",
      operationsEstimatedBalance: "",
    },
  });

  const buildPayload = () => {
    const v = form.getValues();
    const payload: Record<string, unknown> = {};

    if (hasVirtualAccounts) {
      if (v.dayOneRequirement !== "") payload.dayOneAccounts = v.dayOneRequirement;
      if (v.totalVirtualAccounts !== "") payload.fullCapacityAccounts = v.totalVirtualAccounts;
      if (v.singleMaxDaily !== "") payload.singleAccountMaxDaily = String(v.singleMaxDaily);
      if (v.singleMaxMonthly !== "") payload.singleAccountMaxMonthly = String(v.singleMaxMonthly);
      if (v.singleMaxAnnually !== "") payload.singleAccountMaxAnnually = String(v.singleMaxAnnually);
      if (v.allMaxDaily !== "") payload.allAccountsMaxDaily = String(v.allMaxDaily);
      if (v.allMaxMonthly !== "") payload.allAccountsMaxMonthly = String(v.allMaxMonthly);
      if (v.allMaxAnnually !== "") payload.allAccountsMaxAnnually = String(v.allMaxAnnually);
      if (v.highestTransactionCountDaily !== "") payload.highestTransactionCount = v.highestTransactionCountDaily;
    }

    if (hasOperationsAccount && v.operationsEstimatedBalance) {
      payload.operationsBalance = v.operationsEstimatedBalance;
    }

    return payload;
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(`/business/onboarding/admin/${adminReference}/steps/3`, buildPayload());
      handleSuccess("Progress Saved", "Your progress has been saved");
    } catch (error) {
      handleError("Save failed", isAxiosError(error) ? error.response?.data?.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    setCompleting(true);
    try {
      await questAxios.post(`/business/onboarding/admin/${adminReference}/steps/3/complete`, buildPayload());
      handleSuccess("Financials", "Financial information saved");
      onComplete();
    } catch (error) {
      handleError("An error occurred", isAxiosError(error) ? error.response?.data?.message : "Something went wrong");
    } finally {
      setCompleting(false);
    }
  };

  const amountRow = (label: string, key: keyof FinancialsForm) => (
    <Group gap={8} wrap="nowrap" key={key}>
      <Text w={56} fz={14} c="var(--prune-text-gray-500)" fw={500} tt="capitalize">
        {label}
      </Text>
      <NumberInputWithInsideLabel
        leftSection={<IconCurrencyPound size={16} />}
        label="Amount"
        w="100%"
        allowNegative={false}
        min={0}
        {...form.getInputProps(key)}
      />
    </Group>
  );

  return (
    <Box>
      <Stack gap={24}>
        {hasVirtualAccounts && (
          <Stack gap={16}>
            <Text fz={16} fw={500} c="var(--prune-text-gray-500)">
              Virtual Account Services
            </Text>

            <NumberInputWithInsideLabel
              label="How many virtual accounts do you need as a day one requirement?"
              allowDecimal={false}
              allowNegative={false}
              min={1}
              onKeyDown={digitsOnly}
              {...form.getInputProps("dayOneRequirement")}
            />

            <NumberInputWithInsideLabel
              label="What is the projected total number of virtual accounts needed at full capacity?"
              allowDecimal={false}
              allowNegative={false}
              min={1}
              onKeyDown={digitsOnly}
              {...form.getInputProps("totalVirtualAccounts")}
            />

            <Stack gap={16} mt={8}>
              <Text fz={16} fw={500} c="var(--prune-text-gray-500)">
                Please indicate the maximum value processed per transaction by a{" "}
                <Text span fw={700} c="var(--prune-text-gray-700)">single</Text>{" "}
                virtual account
              </Text>
              <Stack gap={12}>
                {amountRow("Daily", "singleMaxDaily")}
                {amountRow("Monthly", "singleMaxMonthly")}
                {amountRow("Annually", "singleMaxAnnually")}
              </Stack>
            </Stack>

            <Stack gap={16} mt={8}>
              <Text fz={16} fw={500} c="var(--prune-text-gray-500)">
                Please indicate the maximum value processed per transaction by{" "}
                <Text span fw={700} c="var(--prune-text-gray-700)">all</Text>{" "}
                virtual account
              </Text>
              <Stack gap={12}>
                {amountRow("Daily", "allMaxDaily")}
                {amountRow("Monthly", "allMaxMonthly")}
                {amountRow("Annually", "allMaxAnnually")}
              </Stack>
            </Stack>

            <Stack gap={16} mt={8}>
              <Text fz={16} fw={500} c="var(--prune-text-gray-500)">
                What is the total highest transaction count that all issued virtual accounts will process?
              </Text>
              <NumberInputWithInsideLabel
                label="Count"
                allowDecimal={false}
                allowNegative={false}
                min={1}
                onKeyDown={digitsOnly}
                {...form.getInputProps("highestTransactionCountDaily")}
              />
            </Stack>
          </Stack>
        )}

        {hasOperationsAccount && (
          <Stack gap={16}>
            <Text fz={16} fw={500} c="var(--prune-text-gray-500)">
              Operations Account Service
            </Text>
            <RadioGroup
              name="operations-estimated-balance"
              label="Please indicate the estimated balance(s) you will hold in the operating account(s)"
              {...form.getInputProps("operationsEstimatedBalance")}
              key={form.key("operationsEstimatedBalance")}
              labelProps={{ fz: 14, fw: 500, c: "var(--prune-text-gray-700)", mb: 12 }}
              errorProps={{ mt: 10 }}
            >
              <Stack gap={16} style={{ cursor: "pointer" }}>
                {monetaryBands.map((option) => (
                  <CustomRadio key={option.value} value={option.value} label={option.label} />
                ))}
              </Stack>
            </RadioGroup>
          </Stack>
        )}

        {!hasVirtualAccounts && !hasOperationsAccount && (
          <Text fz={14} c="var(--prune-text-gray-500)">
            No financial information required for the selected services.
          </Text>
        )}
      </Stack>

      <Flex justify="space-between" mt={32}>
        <SaveProgressBtn loading={saving} action={handleSaveProgress} />
        <Flex gap={12}>
          <SecondaryBtn text="Previous" action={onBack} fw={600} />
          <PrimaryBtn
            text="Save & Continue"
            fw={600}
            action={handleSaveAndContinue}
            loading={completing}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
