"use client";

import { Box, Flex, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { isAxiosError } from "axios";
import { IconCurrencyPound } from "@tabler/icons-react";
import { NumberInputWithInsideLabel } from "@/ui/components/InputWithLabel/QuestInputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SaveProgressBtn } from "@/ui/section/onboarding/shared/utils";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";

const questAxios = createAxiosInstance("questionnaire");

type FinancialsForm = {
  dayOneAccounts: number | "";
  fullCapacityAccounts: number | "";
  singleAccountMaxDaily: number | "";
  singleAccountMaxMonthly: number | "";
  singleAccountMaxAnnually: number | "";
  allAccountsMaxDaily: number | "";
  allAccountsMaxMonthly: number | "";
  allAccountsMaxAnnually: number | "";
  highestTransactionCount: number | "";
  operationsBalance: number | "";
};

interface Props {
  adminReference: string;
  onBack: () => void;
  onComplete: () => void;
}

const digitsOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/^\d$/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(e.key)) {
    e.preventDefault();
  }
};

export default function AdminStep3Financials({ adminReference, onBack, onComplete }: Props) {
  const { handleSuccess, handleError } = useNotification();
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const form = useForm<FinancialsForm>({
    initialValues: {
      dayOneAccounts: "",
      fullCapacityAccounts: "",
      singleAccountMaxDaily: "",
      singleAccountMaxMonthly: "",
      singleAccountMaxAnnually: "",
      allAccountsMaxDaily: "",
      allAccountsMaxMonthly: "",
      allAccountsMaxAnnually: "",
      highestTransactionCount: "",
      operationsBalance: "",
    },
    validate: {
      dayOneAccounts: (v) => (v === "" ? "Required" : null),
      fullCapacityAccounts: (v) => (v === "" ? "Required" : null),
    },
  });

  const buildPayload = () => {
    const v = form.getValues();
    return {
      dayOneAccounts: v.dayOneAccounts || undefined,
      fullCapacityAccounts: v.fullCapacityAccounts || undefined,
      singleAccountMaxDaily: v.singleAccountMaxDaily || undefined,
      singleAccountMaxMonthly: v.singleAccountMaxMonthly || undefined,
      singleAccountMaxAnnually: v.singleAccountMaxAnnually || undefined,
      allAccountsMaxDaily: v.allAccountsMaxDaily || undefined,
      allAccountsMaxMonthly: v.allAccountsMaxMonthly || undefined,
      allAccountsMaxAnnually: v.allAccountsMaxAnnually || undefined,
      highestTransactionCount: v.highestTransactionCount || undefined,
      operationsBalance: v.operationsBalance || undefined,
    };
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
    const { hasErrors } = form.validate();
    if (hasErrors) return;
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

  const numField = (key: keyof FinancialsForm, label: string, required = false) => (
    <NumberInputWithInsideLabel
      label={label + (required ? "" : " (Optional)")}
      w="100%"
      allowDecimal={false}
      allowNegative={false}
      min={0}
      onKeyDown={digitsOnly}
      {...form.getInputProps(key)}
      key={key}
    />
  );

  const amountField = (key: keyof FinancialsForm, label: string) => (
    <NumberInputWithInsideLabel
      label={label}
      w="100%"
      leftSection={<IconCurrencyPound size={16} />}
      allowNegative={false}
      min={0}
      {...form.getInputProps(key)}
      key={key}
    />
  );

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={{ fontFamily: "'EksellDisplay', serif" }}>
        Financials
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          {numField("dayOneAccounts", "How many virtual accounts are needed on day one?", true)}
          {numField("fullCapacityAccounts", "Projected total virtual accounts at full capacity?", true)}
        </Flex>

        <Text fz={14} fw={600} c="var(--prune-text-gray-600)" mt={8}>
          Single Account Transaction Limits
        </Text>
        <Stack gap={16}>
          <Flex gap={24} w="100%">
            {amountField("singleAccountMaxDaily", "Max Daily")}
            {amountField("singleAccountMaxMonthly", "Max Monthly")}
            {amountField("singleAccountMaxAnnually", "Max Annually")}
          </Flex>
        </Stack>

        <Text fz={14} fw={600} c="var(--prune-text-gray-600)" mt={8}>
          All Accounts Transaction Limits
        </Text>
        <Stack gap={16}>
          <Flex gap={24} w="100%">
            {amountField("allAccountsMaxDaily", "Max Daily")}
            {amountField("allAccountsMaxMonthly", "Max Monthly")}
            {amountField("allAccountsMaxAnnually", "Max Annually")}
          </Flex>
        </Stack>

        <Flex gap={24} w="100%">
          {numField("highestTransactionCount", "Highest expected transaction count per day")}
          {amountField("operationsBalance", "Operations balance requirement")}
        </Flex>
      </Stack>

      <Flex justify="space-between" mt={32}>
        <SecondaryBtn text="Back" action={onBack} fw={600} />
        <Flex gap={12}>
          <SaveProgressBtn loading={saving} action={handleSaveProgress} />
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
