"use client";
import Cookies from "js-cookie";

import axios from "axios";
import { Fragment, use, useEffect, useMemo, useState } from "react";
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
  Stack,
  Group,
} from "@mantine/core";
import { TextInput, Select, Button, UnstyledButton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";

import {
  // debitRequest,
  newBusiness,
  validateDebitRequest,
  validateNewBusiness,
} from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import { AccountData, useUserAccounts } from "@/lib/hooks/accounts";
import { formatNumber } from "@/lib/utils";
import { SelectDropdownSearch } from "@/ui/components/SelectDropdownSearch";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { countries } from "@/lib/static";

export default function DebitRequestModal({
  close,
  selectedId,
  accountsData,
  accountBalance,
  revalidate,
}: {
  close: () => void;
  selectedId?: string;
  accountsData?: AccountData[];
  accountBalance?: number;
  revalidate?: () => void;
}) {
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
  };

  const router = useRouter();
  const { accounts } = useUserAccounts({ limit: 1000 });
  const [processing, setProcessing] = useState(false);
  const { handleSuccess, handleError } = useNotification();
  // const [accountType, setAccountType] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");

  const form = useForm({
    initialValues: {
      ...debitRequest,
      ...(selectedId && {
        account: selectedId,
      }),
    },
    validate: zodResolver(validateDebitRequest),
  });

  // useEffect(() => {
  //   form.setFieldValue(
  //     "accountBalance",
  //     accounts.find((item) => item.id === form.values.account)
  //       ?.accountBalance ?? 0
  //   );
  // }, [form.values.account]);

  const createDebitRequest = async () => {
    setProcessing(true);
    let firstName = "";
    let lastName = "";
    try {
      const { hasErrors } = form.validate();

      if (Number(form.values.amount) > Number(accountBalance)) {
        console.log("true");
        return form.setFieldError(
          "amount",
          "Amount must be less than or equal to account balance"
        );
      }

      if (hasErrors) return;

      if (form.values.accountType === "Corporate") {
        firstName = companyName.split(" ")[0];
        lastName = companyName.split(" ")[1] || "";
      }

      const { accountType, ...rest } = form.values;

      // console.log({
      //   ...rest,
      //   ...(form.values.accountType === "Corporate" && {
      //     destinationFirstName: firstName,
      //     destinationLastName: lastName,
      //   }),
      // });
      // return;

      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/payout/debit/request`,
        {
          ...rest,
          ...(form.values.accountType === "Corporate" && {
            destinationFirstName: firstName,
            destinationLastName: lastName,
          }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      handleSuccess(
        "Action Completed",
        "You have successfully sent a new debit request."
      );
      router.push("/debit-requests");
      revalidate && revalidate();
      close();
    } catch (error) {
      handleError("Action Failed", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className={styles.main}>
      <Paper className={styles.form__container}>
        <Flex gap={10} align="center">
          <Text className={styles.form__container__hdrText}>Debit Request</Text>
        </Flex>

        <Box mt={32}>
          {/* <Select
              placeholder="Select Account"
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Account"
              data={accountsIBAN}
              searchable
              clearable
              {...form.getInputProps("account")}
            /> */}

          <Box flex={1} mb={24}>
            <SelectDropdownSearch
              value={form.values.account}
              setValue={(value) => form.setFieldValue("account", value)}
              label="Account Name"
              accountsData={accountsData}
              disabled={!!selectedId}
            />
          </Box>

          <Stack gap={4} flex={1}>
            <NumberInput
              classNames={{ input: styles.input, label: styles.label }}
              description={
                Number(form.values.amount) >
                Number(
                  accounts.find((item) => item.id === form.values.account)
                    ?.accountBalance
                )
                  ? "Insufficient Balance"
                  : ""
              }
              styles={{
                description: {
                  color: "var(--prune-warning)",
                },
                input: {
                  border:
                    Number(form.values.amount) >
                    Number(
                      accounts.find((item) => item.id === form.values.account)
                        ?.accountBalance
                    )
                      ? "1px solid red"
                      : "1px solid #eaecf0",
                },
              }}
              label="Amount"
              placeholder="Enter amount"
              {...form.getInputProps("amount")}
              // value={form.values.amount}
              // onChange={(value) => form.setFieldValue("amount", Number(value))}
              withAsterisk
            />

            {form.values.account && (
              <Text fz={12} c="var(--prune-primary-800)">
                {`Account balance: ${formatNumber(
                  accounts.find((item) => item.id === form.values.account)
                    ?.accountBalance ?? 0,
                  true,
                  "EUR"
                )}`}
              </Text>
            )}
            {/* <Group justify="space-between">
              {form.errors.accountBalance && (
                <Text fz={12} c="var(--prune-warning)">
                  {form.errors.accountBalance}
                </Text>
              )}
              {form.values.account && (
                <Text fz={12} c="var(--prune-primary-800)">
                  {`Account balance: ${formatNumber(
                    accounts.find((item) => item.id === form.values.account)
                      ?.accountBalance ?? 0,
                    true,
                    "EUR"
                  )}`}
                </Text>
              )}
            </Group> */}
          </Stack>

          <Box mt={40}>
            <Text fz={16} c="#97AD05">
              Destination Account:
            </Text>

            <Flex gap={20} mt={24}>
              <Select
                placeholder="Select destination account type"
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                label="Account Type"
                data={["Corporate", "Individual"]}
                // value={accountType}
                // onChange={(value) => setAccountType(value!)}
                {...form.getInputProps("accountType")}
              />
            </Flex>

            <Flex gap={20} mt={24}>
              {form.values.accountType === "Corporate" ? (
                <TextInput
                  classNames={{ input: styles.input, label: styles.label }}
                  flex={1}
                  withAsterisk
                  label="Company Name"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.currentTarget.value)}
                  // {...form.getInputProps("destinationFirstName")}
                />
              ) : (
                <>
                  <TextInput
                    classNames={{ input: styles.input, label: styles.label }}
                    flex={1}
                    withAsterisk
                    label="First Name"
                    placeholder="Enter first name"
                    {...form.getInputProps("destinationFirstName")}
                  />

                  <TextInput
                    classNames={{ input: styles.input, label: styles.label }}
                    flex={1}
                    withAsterisk
                    label="Last Name"
                    placeholder="Enter last name"
                    {...form.getInputProps("destinationLastName")}
                  />
                </>
              )}
            </Flex>
            <Flex gap={20} mt={24}>
              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                withAsterisk
                label="IBAN"
                placeholder="Enter IBAN"
                {...form.getInputProps("destinationIBAN")}
              />

              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                withAsterisk
                label="BIC"
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
                data={countries}
                searchable
                {...form.getInputProps("destinationCountry")}
              />

              <TextInput
                placeholder="Enter Bank Name"
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                label="Bank"
                // data={["Standard Chartered", "IBSN"]}
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
                readOnly
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
                label="Narration"
                placeholder="Enter narration"
                {...form.getInputProps("reason")}
              />
            </Flex>
          </Box>
        </Box>

        <Flex mt={24} justify="flex-end" gap={15}>
          <SecondaryBtn
            text="Cancel"
            w={126}
            fw={600}
            action={() => {
              form.reset();
              close();
            }}
          />
          <PrimaryBtn
            action={createDebitRequest}
            loading={processing}
            text="Submit"
            fw={600}
            w={126}
          />
        </Flex>
      </Paper>
    </main>
  );
}
