"use client";
import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";

import {
  Flex,
  Paper,
  ThemeIcon,
  Text,
  Box,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { TextInput, Select, Button, UnstyledButton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";

import {
  newBusiness,
  validateDebitRequest,
  validateNewBusiness,
} from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { useUserAccounts } from "@/lib/hooks/accounts";
import { formatNumber } from "@/lib/utils";

import createAxiosInstance from "@/lib/axios";

const axios = createAxiosInstance("payouts");

export default function DebitRequest() {
  const router = useRouter();
  const { accounts } = useUserAccounts();
  const [processing, setProcessing] = useState(false);
  const { handleSuccess, handleError } = useNotification();

  const accountsIBAN = useMemo(() => {
    return accounts.map((account) => {
      return {
        value: account.id,
        label: `${account.accountNumber} (${formatNumber(
          account.accountBalance,
          true,
          "EUR"
        )})`,
      };
    });
  }, [accounts]);

  const debitRequest = {
    account: "",
    amount: "",
    accountType: "",
    destinationIBAN: "",
    destinationBIC: "",
    destinationCountry: "",
    destinationBank: "",
    reference: crypto.randomUUID(),
    reason: "",
    destinationFirstName: "",
    destinationLastName: "",
    accountBalance: 0,
  };

  const form = useForm({
    initialValues: debitRequest,
    validate: zodResolver(validateDebitRequest),
  });

  const createDebitRequest = async () => {
    setProcessing(true);
    try {
      const { hasErrors } = form.validate();
      if (hasErrors) return;

      await axios.post(`/payout/debit/request`, form.values);

      handleSuccess("Action Completed", "Debit request created");
      router.push("/debit-requests");
    } catch (error) {
      handleError("Action Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/" },
          { title: "Debit Requests", href: "/debit-requests" },
          { title: "New Debit Request", href: "/debit-requests/new" },
        ]}
      />

      <Paper withBorder className={styles.form__container}>
        <Flex gap={10} align="center">
          <UnstyledButton onClick={() => router.back()}>
            <ThemeIcon color="rgba(212, 243, 7)" radius="lg">
              <IconArrowLeft
                color="#1D2939"
                style={{ width: "70%", height: "70%" }}
              />
            </ThemeIcon>
          </UnstyledButton>

          <Text className={styles.form__container__hdrText}>Debit Request</Text>
        </Flex>

        <Box mt={32}>
          <Flex gap={20}>
            <Select
              placeholder="Select Account"
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Account"
              data={accountsIBAN}
              searchable
              clearable
              {...form.getInputProps("account")}
            />

            <NumberInput
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Amount"
              placeholder="Enter amount"
              {...form.getInputProps("amount")}
              withAsterisk
            />
          </Flex>

          <Box mt={40}>
            <Text fz={16} c="#97AD05">
              Destination Account:
            </Text>

            <Flex gap={20} mt={24}>
              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                withAsterisk
                label="Receiver IBAN"
                placeholder="Enter IBAN"
                {...form.getInputProps("destinationIBAN")}
              />

              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                withAsterisk
                label="Receiver BIC"
                placeholder="Enter BIC"
                {...form.getInputProps("destinationBIC")}
              />
            </Flex>

            <Flex gap={20} mt={24}>
              <Select
                placeholder="Select Country"
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                label="Country"
                data={["United Kingdom", "Belgium", "Spain"]}
                {...form.getInputProps("destinationCountry")}
              />

              <Select
                placeholder="Select Bank"
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                label="Bank"
                data={["Standard Chartered", "IBSN"]}
                {...form.getInputProps("destinationBank")}
              />
            </Flex>

            <Flex gap={20} mt={24}>
              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                withAsterisk
                label="Reference"
                placeholder="Enter reference"
                {...form.getInputProps("reference")}
              />
            </Flex>

            <Flex gap={20} mt={24}>
              <Textarea
                flex={1}
                autosize
                minRows={3}
                classNames={{ input: styles.textarea, label: styles.label }}
                withAsterisk
                label="Reason"
                placeholder="Enter reason"
                {...form.getInputProps("reason")}
              />
            </Flex>
          </Box>
        </Box>

        <Flex mt={24} justify="flex-end" gap={15}>
          <Button
            onClick={() => {
              form.reset();
            }}
            color="#D0D5DD"
            variant="outline"
            className={styles.cta}
          >
            Cancel
          </Button>

          <Button
            onClick={createDebitRequest}
            loading={processing}
            className={styles.cta}
            variant="filled"
            color="#D4F307"
          >
            Submit
          </Button>
        </Flex>
      </Paper>
    </main>
  );
}
