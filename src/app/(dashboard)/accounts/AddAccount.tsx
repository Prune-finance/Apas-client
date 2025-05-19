"use client";

import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Select, Text, Textarea } from "@mantine/core";
import React, { useState } from "react";
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

interface AddAccountProps {
  onClose: () => void;
  openSuccess: () => void;
}

const data = [
  { value: "EUR", label: "🇪🇺 EUR Account (Euros)" },
  { value: "GBP", label: "🇬🇧 GBP Account (Pounds)" },
  { value: "NGN", label: "🇳🇬 NGN Account (Naira)" },
];

const accountType = [
  // { value: "ISSUED_ACCOUNT", label: "ISSUED ACCOUNT" },
  { value: "PAYOUT_ACCOUNT", label: "PAYOUT ACCOUNT" },
  { value: "COMPANY_ACCOUNT", label: "COMPANY ACCOUNT" },
];

function AddAccount({ onClose, openSuccess }: AddAccountProps) {
  const axios = createAxiosInstance("accounts");
  const { handleSuccess, handleError } = useNotification();
  const [loading, setLoading] = useState(false);
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
        "You have successfully requested a naira account."
      );

      onClose();
      openSuccess();
    } catch (error) {
      handleError("Account Requested Successfully", parseError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Text fz={20} fw={600} mb={20} ff="switzer" lh="100%" ta="center">
          Request Account
        </Text>

        <Flex mb={24}>
          <Select
            searchable
            placeholder="Select Account Type"
            classNames={{ input: styles.input, label: styles.label }}
            flex={1}
            data={accountType}
            {...form.getInputProps("type")}
          />
        </Flex>

        <Flex mb={24}>
          <Select
            searchable
            placeholder="Select Account"
            classNames={{ input: styles.input, label: styles.label }}
            flex={1}
            data={data}
            {...form.getInputProps("currency")}
          />
        </Flex>

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
