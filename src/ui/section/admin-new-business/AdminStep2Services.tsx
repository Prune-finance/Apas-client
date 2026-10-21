"use client";

import {
  Box,
  Checkbox,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  IconDatabase,
  IconCreditCard,
  IconMoneybag,
  IconSearch,
  IconArrowsRightLeft,
} from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Icon, IconProps } from "@tabler/icons-react";
import classes from "@/ui/components/CheckboxCard/CheckboxCard.module.css";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SaveProgressBtn } from "@/ui/section/onboarding/shared/utils";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { isAxiosError } from "axios";

const questAxios = createAxiosInstance("questionnaire");

interface RefOption { value: string; label: string }

interface ServiceItem {
  value: string;
  label: string;
  description: string;
  currencies: RefOption[];
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

type ServiceSelection = { service: string; currencies: string[] };

const SERVICE_META: Record<string, { description: string; icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>> }> = {
  OPERATIONS_ACCOUNT: {
    description: "Prune Payments payout service gives the business access to payouts.",
    icon: IconDatabase,
  },
  VIRTUAL_ACCOUNTS: {
    description: "The account service lets businesses issue user accounts to clients.",
    icon: IconCreditCard,
  },
  PAYOUT: {
    description: "This helps businesses manage and disburse funds to recipients.",
    icon: IconMoneybag,
  },
  ACCOUNT_LOOKUP: {
    description: "This helps businesses quickly verify and access account details for transactions.",
    icon: IconSearch,
  },
  REMITTANCE: {
    description: "This helps businesses quickly verify and access account details for transactions.",
    icon: IconArrowsRightLeft,
  },
};

interface Props {
  adminReference: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function AdminStep2Services({ adminReference, onBack, onComplete }: Props) {
  const { handleSuccess, handleError } = useNotification();
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [selected, setSelected] = useState<ServiceSelection[]>([]);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    questAxios
      .get("/business/questionnaire/reference-data", {
        params: { include: "services,currencies" },
      })
      .then(({ data: res }) => {
        const currencies: RefOption[] = res.data?.currencies ?? [];
        const services: RefOption[] = res.data?.services ?? [];
        setServiceItems(
          services.map((s) => ({
            value: s.value,
            label: s.label,
            description: SERVICE_META[s.value]?.description ?? "",
            currencies,
            icon: SERVICE_META[s.value]?.icon ?? IconDatabase,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const toggleService = (serviceValue: string) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.service === serviceValue);
      if (exists) return prev.filter((s) => s.service !== serviceValue);
      return [...prev, { service: serviceValue, currencies: [] }];
    });
  };

  const toggleCurrency = (serviceValue: string, currency: string) => {
    setSelected((prev) => {
      const idx = prev.findIndex((s) => s.service === serviceValue);
      if (idx === -1) {
        return [...prev, { service: serviceValue, currencies: [currency] }];
      }
      const entry = prev[idx];
      const hasCurrency = entry.currencies.includes(currency);
      const newCurrencies = hasCurrency
        ? entry.currencies.filter((c) => c !== currency)
        : [...entry.currencies, currency];
      if (newCurrencies.length === 0) return prev.filter((_, i) => i !== idx);
      return prev.map((s, i) => i === idx ? { ...s, currencies: newCurrencies } : s);
    });
  };

  const buildPayload = () => ({ services: selected });

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(`/business/onboarding/admin/${adminReference}/steps/2`, buildPayload());
      handleSuccess("Progress Saved", "Your progress has been saved");
    } catch (error) {
      handleError("Save failed", isAxiosError(error) ? error.response?.data?.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (selected.length === 0) {
      handleError("Validation", "Please select at least one service");
      return;
    }
    setCompleting(true);
    try {
      await questAxios.post(`/business/onboarding/admin/${adminReference}/steps/2/complete`, buildPayload());
      handleSuccess("Services", "Services saved successfully");
      onComplete();
    } catch (error) {
      handleError("An error occurred", isAxiosError(error) ? error.response?.data?.message : "Something went wrong");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={{ fontFamily: "'EksellDisplay', serif" }}>
        Services
      </Text>
      <Text fz={13} c="var(--prune-text-gray-500)" mt={4} mb={20}>
        Select the services this business will use and the currencies for each.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {serviceItems.map((item) => {
          const SvcIcon = item.icon;
          const serviceEntry = selected.find((s) => s.service === item.value);
          const isChecked = Boolean(serviceEntry);

          return (
            <Checkbox.Card
              key={item.value}
              className={classes.root}
              radius="md"
              checked={isChecked}
              onChange={() => toggleService(item.value)}
            >
              <Stack align="flex-start">
                <ThemeIcon color="var(--prune-text-gray-500)" radius={4} variant="light">
                  <SvcIcon size={16} />
                </ThemeIcon>
                <Stack gap={12} my={12}>
                  <Text className={classes.label}>{item.label}</Text>
                  <Text className={classes.description}>{item.description}</Text>
                </Stack>

                <SimpleGrid cols={2}>
                  {item.currencies.map((currency) => (
                    <Checkbox
                      key={currency.value}
                      label={currency.label}
                      onClick={(e) => e.stopPropagation()}
                      checked={Boolean(serviceEntry?.currencies.includes(currency.value))}
                      onChange={() => toggleCurrency(item.value, currency.value)}
                      fz={12}
                      color="var(--prune-primary-600)"
                    />
                  ))}
                </SimpleGrid>
              </Stack>
            </Checkbox.Card>
          );
        })}
      </SimpleGrid>

      <Flex justify="space-between" mt={32}>
        <SecondaryBtn text="Back" action={onBack} fw={600} />
        <Flex gap={12}>
          <SaveProgressBtn loading={saving} action={handleSaveProgress} />
          <PrimaryBtn
            text="Save & Continue"
            fw={600}
            action={handleSaveAndContinue}
            loading={completing}
            disabled={selected.length === 0}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
