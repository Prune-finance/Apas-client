"use client";

import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Select, Skeleton, Text, Textarea } from "@mantine/core";
import React, { useMemo, useState } from "react";
import styles from "./addAccount.module.scss";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import {
  accountCreation,
  accountCreationType,
} from "@/lib/schema/account-creation";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useUserListCurrencyAccount } from "@/lib/hooks/accounts";
import useAddAccountCurrencyStore from "@/lib/store/add-account";

interface AddAccountProps {
  onClose: () => void;
  openSuccess: () => void;
}

const data = [
  { value: "EUR", label: "🇪🇺 EUR Account (Euros)" },
  { value: "GBP", label: "🇬🇧 GBP Account (Pounds)" },
  { value: "GHS", label: "🇬🇭 GHS Account (Cedi)" },
  { value: "USD", label: "🇺🇸 USD Account (Dollars)" },
  // { value: "NGN", label: "🇳🇬 NGN Account (Naira)" },
];

const accountType = [
  // { value: "ISSUED_ACCOUNT", label: "ISSUED ACCOUNT" },
  { value: "COMPANY_ACCOUNT", label: "COMPANY ACCOUNT" },
  { value: "PAYOUT_ACCOUNT", label: "PAYOUT ACCOUNT" },
];

function AddAccount({ onClose, openSuccess }: AddAccountProps) {
  const axios = createAxiosInstance("accounts");
  const { handleSuccess, handleError } = useNotification();
  const [loading, setLoading] = useState(false);
  const { setAddAccountCurrency } = useAddAccountCurrencyStore();

  const { listCurrency, loading: currencyLoading } =
    useUserListCurrencyAccount();

  const form = useForm<accountCreationType>({
    initialValues: {
      type: "",
      currency: "",
      reason: "",
    },
    validate: zodResolver(accountCreation),
  });

  const handleAddAccount = async () => {
    try {
      const { hasErrors } = form.validate();
      if (hasErrors) return;

      const { type, currency, reason } = form.values;

      const data = {
        type,
        currency,
        reason,
      };

      setLoading(true);
      const { data: res } = await axios.post(
        `/currency-accounts/requests/request-business-currency-account`,
        data
      );
      console.log(res);
      form.reset();
      handleSuccess(
        "Account Requested Successfully",
        `You have successfully requested a ${type} account.`
      );
      setAddAccountCurrency(currency as "EUR" | "GBP" | "NGN" | "GHS" | "USD");
      onClose();
      openSuccess();
    } catch (error) {
      handleError("Account Requested Successfully", parseError(error));
    } finally {
      setLoading(false);
    }
  };

  // Filter currency options based on selected account type
  const filteredCurrencyOptions = useMemo(() => {
    const selectedType = form.values.type;
    if (!selectedType || !listCurrency) return data;

    // Get currencies that are already APPROVED or PENDING for the selected account type
    const existingCurrencies = (listCurrency || [])
      .filter(
        (item) =>
          item.accountType === selectedType &&
          (item.status === "APPROVED" || item.status === "PENDING")
      )
      .map((item) => item.Currency);

    // Create a new array with disabled property for currencies that are already selected
    return data.map((option) => ({
      ...option,
      disabled: existingCurrencies.includes(option.value),
    }));
  }, [form.values.type, listCurrency, data]);

  return (
    <>
      <Box>
        <Text fz={20} fw={600} mb={20} ff="switzer" lh="100%" ta="center">
          Request Account
        </Text>

        <Flex mb={24}>
          {currencyLoading ? (
            <Skeleton h={40} my={4} w={"100%"} />
          ) : (
            <Select
              searchable
              placeholder="Select Account Type"
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              data={accountType}
              {...form.getInputProps("type")}
              onChange={(value) => {
                form.setFieldValue("type", value || "");
                // Reset currency when account type changes
                form.setFieldValue("currency", "");
              }}
            />
          )}
        </Flex>

        <Flex mb={24}>
          {currencyLoading ? (
            <Skeleton h={40} my={4} w={"100%"} />
          ) : (
            <Select
              searchable
              placeholder="Select Account"
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              data={filteredCurrencyOptions}
              {...form.getInputProps("currency")}
            />
          )}
        </Flex>

        {currencyLoading ? (
          <Skeleton h={100} my={4} w={"100%"} />
        ) : (
          <Textarea
            minRows={3}
            maxRows={4}
            autosize
            classNames={{
              input: styles.textarea,
            }}
            placeholder="Give reason here..."
            {...form.getInputProps("reason")}
          />
        )}

        <PrimaryBtn
          text={"Submit"}
          fullWidth
          h={44}
          mt={32}
          fw={600}
          fz={14}
          loading={loading}
          action={handleAddAccount}
        />
      </Box>
    </>
  );
}

export default AddAccount;
