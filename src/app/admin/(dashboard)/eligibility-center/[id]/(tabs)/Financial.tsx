import { Radio, SimpleGrid, Stack, Text } from "@mantine/core";
import PaperContainer from "../PaperContainer";
import {
  CustomRadioCard,
  ProfileTextInput,
} from "@/ui/components/InputWithLabel";
import { formatNumber } from "@/lib/utils";
import { operationsAccountEstimatedBalance } from "@/lib/static";
import { useState } from "react";
import { PanelWrapper } from "./utils";
import { OnboardingBusiness } from "@/lib/interface";
import { OnboardingType } from "@/lib/schema/onboarding";
import { UseFormReturnType } from "@mantine/form";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
}

export default function Financial({ data, loading, form }: ComponentProps) {
  const boldLabel = (boldText: string, normalText: string) => (
    <Text inherit span>
      <Text inherit span fw={700}>
        {boldText}
      </Text>{" "}
      {normalText}
    </Text>
  );

  return (
    <PanelWrapper
      loading={loading}
      rows={
        data?.questionnaireStatus === "SUBMITTED" ||
        data?.questionnaireStatus === "APPROVED"
          ? [1]
          : []
      }
      panelName="Financial"
    >
      <PaperContainer title="Finance">
        <Stack gap={8}>
          <Text fz={14} fw={500} c="var(--prune-text-gray-500)">
            Annual Turnover
          </Text>
          <Text fz={32} fw={500} c="var(--prune-text-gray-700)">
            {data?.annualTurnover?.split("-").join(" ")}
          </Text>
        </Stack>
      </PaperContainer>

      <PaperContainer my={24} title="Virtual Account Service">
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <ProfileTextInput
            label="Account needed as Day 1 requirement"
            placeholder={`${data?.virtualAccounts.day_one_requirement || ""}`}
          />
          <ProfileTextInput
            label="Projected account total"
            placeholder={`${
              data?.virtualAccounts.total_number_of_virtual_accounts || ""
            }`}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} my={24}>
          <ProfileTextInput
            label={boldLabel("Single", "account limit - Daily")}
            placeholder={`${formatNumber(
              data?.virtualAccounts?.max_value_per_transaction?.daily || 0,
              true,
              "GBP"
            )}`}
          />
          <ProfileTextInput
            label={boldLabel("Single", "account limit - Monthly")}
            placeholder={`${formatNumber(
              data?.virtualAccounts?.max_value_per_transaction?.annually || 0,
              true,
              "GBP"
            )}`}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <ProfileTextInput
            label={boldLabel("All", "account limit - Daily")}
            placeholder={`${formatNumber(
              data?.virtualAccounts?.max_value_all_virtual_accounts?.daily || 0,
              true,
              "GBP"
            )}`}
          />
          <ProfileTextInput
            label={boldLabel("All", "account limit - Monthly")}
            placeholder={`${formatNumber(
              data?.virtualAccounts?.max_value_all_virtual_accounts?.monthly ||
                0,
              true,
              "GBP"
            )}`}
          />
          <ProfileTextInput
            label={boldLabel("All", "account limit - Annually")}
            placeholder={`${formatNumber(
              data?.virtualAccounts?.max_value_all_virtual_accounts?.annually ||
                0,
              true,
              "GBP"
            )}`}
          />
          {/* total highest transaction count that all issued virtual accounts will
          process */}
          <ProfileTextInput
            label={boldLabel("Highest", "transaction count - Daily")}
            placeholder={`${formatNumber(
              data?.virtualAccounts?.total_highest_transaction_count?.daily ||
                0,
              true,
              "GBP"
            )}`}
          />
          <ProfileTextInput
            label={boldLabel("Highest", "transaction count - Monthly")}
            placeholder={`${formatNumber(
              data?.virtualAccounts?.total_highest_transaction_count?.monthly ||
                0,
              true,
              "GBP"
            )}`}
          />
          <ProfileTextInput
            label={boldLabel("Highest", "transaction count - Annually")}
            placeholder={`${formatNumber(
              data?.virtualAccounts?.total_highest_transaction_count
                ?.annually || 0,
              true,
              "GBP"
            )}`}
          />
        </SimpleGrid>
      </PaperContainer>

      <PaperContainer title="Operations Account Service">
        <Radio.Group
          value={data?.operationsAccounts?.estimated_balance}
          onChange={() => {}}
        >
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {Object.entries(operationsAccountEstimatedBalance).map(
              ([value, label], idx) => (
                <CustomRadioCard label={label} value={value} key={idx} />
              )
            )}
          </SimpleGrid>
        </Radio.Group>
      </PaperContainer>
    </PanelWrapper>
  );
}
