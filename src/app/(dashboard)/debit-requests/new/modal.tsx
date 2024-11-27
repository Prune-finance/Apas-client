"use client";
import { Fragment, use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconCheck,
  IconExclamationMark,
  IconPlus,
} from "@tabler/icons-react";

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
  Alert,
  ActionIcon,
  Badge,
  Loader,
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
import {
  AccountData,
  useUserAccounts,
  validateAccount,
} from "@/lib/hooks/accounts";
import { formatNumber } from "@/lib/utils";
import { SelectDropdownSearch } from "@/ui/components/SelectDropdownSearch";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { countries } from "@/lib/static";
import { useDebouncedValue } from "@mantine/hooks";
import createAxiosInstance from "@/lib/axios";

const axios = createAxiosInstance("payouts");

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
  const [validated, setValidated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  const form = useForm({
    initialValues: {
      ...debitRequest,
      ...(selectedId && {
        account: selectedId,
      }),
    },
    validate: zodResolver(validateDebitRequest),
  });

  const [{ bic, iban }] = useDebouncedValue(
    { iban: form.values.destinationIBAN, bic: form.values.destinationBIC },
    2000
  );

  const handleIbanValidation = async () => {
    setLoading(true);
    setValidated(null);
    setDisabled(false);
    setShowBadge(true);
    try {
      const data = await validateAccount({ iban, bic });

      if (data) {
        form.setValues({
          destinationBank: data.bankName,
          destinationCountry: data.country,
        });

        setValidated(true);
        setDisabled(true);
      } else {
        setValidated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (iban && bic) {
      handleIbanValidation();
    }
  }, [bic, iban]);

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

      await axios.post(`/payout/debit/request`, {
        ...rest,
        ...(form.values.accountType === "Corporate" && {
          destinationFirstName: firstName,
          destinationLastName: lastName,
        }),
      });

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

        {validated === false && (
          <Alert
            title="Account  Validation Failed"
            radius="sm"
            color="#D92D20"
            variant="light"
            mt={32}
            styles={{
              title: { fontSize: "14px", fontWeight: 600 },
            }}
            icon={
              <ThemeIcon radius="xl" color="#D92D20" size={20}>
                <IconExclamationMark />
              </ThemeIcon>
            }
          >
            <Stack>
              <Text fz={14} inline lh="20px">
                Unfortunately, we couldn't validate your account information.
                Please review the details to ensure it is accurate, or proceed
                without validation.{" "}
                <Text span inherit c="var(--prune-text-gray-700)" fw={600}>
                  Know that proceeding without validation may lead to delays or
                  errors in processing.
                </Text>
              </Text>

              <Group justify="end" gap={12}>
                <PrimaryBtn
                  text="Cancel"
                  color="#D92D20"
                  c="#D92D20"
                  variant="transparent"
                  fw={600}
                  action={() => setValidated(null)}
                />
                <PrimaryBtn
                  color="#D92D20"
                  c="#fff"
                  text="Proceed Anyway"
                  fw={600}
                  action={() => {
                    setValidated(true);
                    setShowBadge(false);
                  }}
                />
              </Group>
            </Stack>
          </Alert>
        )}

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

            {(loading || validated) && showBadge && (
              <Group
                justify="space-between"
                bg="#ECFDF3"
                w="100%"
                px={20}
                py={8}
                my={32}
              >
                <Badge
                  fz={14}
                  px={0}
                  c="#12B76A"
                  variant="transparent"
                  fw={600}
                  color="#12B76A"
                  tt="capitalize"
                  rightSection={
                    validated ? (
                      <ActionIcon
                        variant="light"
                        radius="xl"
                        color="#12B76A"
                        size={23}
                      >
                        <IconCheck />
                      </ActionIcon>
                    ) : null
                  }
                >
                  {validated
                    ? "Information Validated "
                    : "Verifying Account Details"}
                </Badge>

                {loading && <Loader type="oval" size={24} color="#12B76A" />}
              </Group>
            )}

            {validated && (
              <>
                <Flex gap={20} mt={24}>
                  <Select
                    placeholder="Select Country"
                    classNames={{ input: styles.input, label: styles.label }}
                    flex={1}
                    label="Country"
                    data={countries}
                    disabled={disabled}
                    searchable
                    {...form.getInputProps("destinationCountry")}
                  />

                  <TextInput
                    placeholder="Enter Bank Name"
                    classNames={{ input: styles.input, label: styles.label }}
                    flex={1}
                    label="Bank"
                    disabled={disabled}
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
              </>
            )}
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
