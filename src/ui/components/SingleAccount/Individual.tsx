"use client";

import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { IconCheck } from "@tabler/icons-react";

import styles from "./sendMoney.module.scss";

import {
  Flex,
  Text,
  Box,
  NumberInput,
  Textarea,
  Group,
  TabsPanel,
  Badge,
  Loader,
  ActionIcon,
  ScrollArea,
  Checkbox,
  Modal,
  Skeleton,
} from "@mantine/core";
import { TextInput, Select } from "@mantine/core";
import { useForm, UseFormReturnType, zodResolver } from "@mantine/form";
import { PrimaryBtn } from "../Buttons";
import {
  DefaultAccount,
  useUserListOfBanks,
  validateAccount,
  validateAccountGBP,
} from "@/lib/hooks/accounts";
// import { countries } from "@/lib/static";
import DropzoneComponent from "../Dropzone";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { sendMoneyIndividualValidate } from "@/lib/schema";
import { removeWhitespace } from "@/lib/utils";
import countries from "@/assets/countries.json";
import TransactionProcessingTimes from "./TransactionProcessingTimes";
import useCurrencySwitchStore from "@/lib/store/currency-switch";
import TransactionProcessTimeGBP from "./TransactionProcessTimeGBP";
import NoticeBanner from "../NoticeBanner";
import SelectTypeOfTransfer from "@/app/(dashboard)/accounts/SelectTypeOfTransfer";
import useTransferCurrencySwitchStore from "@/lib/store/transfer-currency-type";
import USDSelectTypeOfTransfer from "@/app/(dashboard)/accounts/USDSelectTypeOfTransfer";
import USDuseTransferCurrencySwitchStore from "@/lib/store/usd-transfer-currency-type";
interface IndividualProps {
  account: DefaultAccount | null;
  close: () => void;
  openPreview: () => void;
  setRequestForm: any;
  setSectionState: any;
  validated: boolean | null;
  setValidated: Dispatch<SetStateAction<boolean | null>>;
  showBadge: boolean;
  setShowBadge: Dispatch<SetStateAction<boolean>>;
  openDebtor: () => void;
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;
}

export const sendMoneyIndividualRequest = {
  firstName: "",
  lastName: "",
  destinationIBAN: "",
  destinationBIC: "",
  destinationBank: "",
  destinationAccountNumber: "",
  destinationSortCode: "",
  routingNumber: "",
  bankAddress: "",
  destinationCountry: "",
  amount: "",
  invoice: "",
  narration: "",
  currency: "",
  phoneNumber: "",
  accountNumber: "",
  beneficiaryBankCode: "",
  gshTransferType: "",
  usdTransferType: "",
};

const Individual = forwardRef<HTMLDivElement, IndividualProps>(
  function Individual(
    {
      account,
      close,
      openPreview,
      setRequestForm,
      setSectionState,
      validated,
      setValidated,
      setShowBadge,
      showBadge,
      openDebtor,
      paymentType,
      setPaymentType,
    },
    ref
  ) {
    const { banks, loading } = useUserListOfBanks();

    const [processing, setProcessing] = useState(false);
    const [disableBank, setDisableBank] = useState(false);
    const [disableAddress, setDisableAddress] = useState(false);
    const [disableCountry, setDisableCountry] = useState(false);
    const { switchCurrency } = useCurrencySwitchStore();
    const { transferCurrency: switchCurrencyOutsideUS } =
      USDuseTransferCurrencySwitchStore();
    const { transferCurrency } = useTransferCurrencySwitchStore();

    const form = useForm({
      initialValues: {
        ...sendMoneyIndividualRequest,
      },
      validate: zodResolver(sendMoneyIndividualValidate),
    });

    useEffect(() => {
      form.setFieldValue("currency", switchCurrency);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [switchCurrency]);

    useEffect(() => {
      form.setFieldValue("gshTransferType", transferCurrency);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transferCurrency]);

    useEffect(() => {
      form.setFieldValue("usdTransferType", switchCurrencyOutsideUS);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [switchCurrencyOutsideUS]);

    const [{ bic, iban }] = useDebouncedValue(
      { iban: form.values.destinationIBAN, bic: form.values.destinationBIC },
      2000
    );

    const [{ accountNumber, sortCode }] = useDebouncedValue(
      {
        accountNumber: form.values.destinationAccountNumber,
        sortCode: form.values.destinationSortCode,
      },
      2000
    );

    const handleIbanValidation = async () => {
      setProcessing(true);
      setValidated(null);
      setDisableAddress(false);
      setDisableBank(false);
      setDisableCountry(false);
      setShowBadge(true);
      try {
        const data = await validateAccount({
          iban: removeWhitespace(iban ?? accountNumber),
          bic: removeWhitespace(bic ?? sortCode),
        });

        if (data) {
          form.setValues({
            bankAddress: data.address || data.city,
            destinationBank: data.bankName,
            destinationCountry: data.country,
          });

          setValidated(true);
          if (data.address || data.city) setDisableAddress(true);
          if (data.bankName) setDisableBank(true);
          if (data.country) setDisableCountry(true);
        } else {
          setValidated(false);
          if (ref && typeof ref !== "function" && ref.current) {
            ref.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      } finally {
        setProcessing(false);
      }
    };

    const handleIbanValidationGBP = async () => {
      setProcessing(true);
      setValidated(null);
      setDisableAddress(false);
      setDisableBank(false);
      setDisableCountry(false);
      setShowBadge(true);

      try {
        const data = await validateAccountGBP({
          accountNumber: removeWhitespace(accountNumber),
          sortCode: removeWhitespace(sortCode),
        });

        if (data) {
          form.setValues({
            bankAddress: data.bankAddress || data.city,
            destinationBank: data.bankName,
            // destinationCountry: data.bankTown,
          });

          setValidated(true);
          if (data.bankAddress || data.city) setDisableAddress(true);
          if (data.bankName) setDisableBank(true);
          // if (data.bankTown) setDisableCountry(true);
        } else {
          setValidated(false);
          if (ref && typeof ref !== "function" && ref.current) {
            ref.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      } finally {
        setProcessing(false);
      }
    };

    useEffect(() => {
      if (iban && bic) {
        handleIbanValidation();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bic, iban]);

    useEffect(() => {
      if (accountNumber && sortCode) {
        handleIbanValidationGBP();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountNumber, sortCode]);

    const handleDebtorState = () => {
      // const { hasErrors } = form.validate();
      // if (hasErrors) return;

      const result = sendMoneyIndividualValidate.safeParse(form.values);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        Object.entries(errors).forEach(([field, messages]) => {
          if (messages?.[0]) {
            console.log(messages);
            form.setFieldError(field, messages[0]);
          }
        });
        return;
      }

      if (!account?.accountBalance || account?.accountBalance === 0)
        return form.setFieldError(
          "amount",
          `Insufficient funds: The amount entered exceeds your balance`
        );

      if (
        account?.accountBalance &&
        account?.accountBalance < Number(form.values.amount)
      )
        return form.setFieldError(
          "amount",
          `Insufficient funds: The amount entered exceeds your balance`
        );
      // close();
      setRequestForm(form.values);
      setSectionState("Individual");
      openDebtor();
    };

    const memorizedData = useMemo(() => {
      if (!banks || !Array.isArray(banks)) return [];
      return banks
        .filter((item) => transferCurrency === item?.payoutType)
        .map((item) => ({
          label: item?.bankName || "",
          value: item?.bankName || "",
        }));
    }, [banks, transferCurrency]);

    useEffect(() => {
      form.setFieldValue("destinationBank", null!);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transferCurrency]);

    useEffect(() => {
      form.setFieldValue("destinationBIC", "");
      form.setFieldValue("destinationIBAN", "");
      form.setFieldValue("accountNumber", "");
      form.setFieldValue("routingNumber", "");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [switchCurrencyOutsideUS]);

    // Helper UI components to reduce repetition and keep JSX concise
    const NameFields = useCallback(
      ({
        form,
        mt,
      }: {
        form: UseFormReturnType<typeof sendMoneyIndividualRequest>;
        mt?: number;
      }) => (
        <Flex gap={20} mt={mt}>
          <TextInput
            classNames={{ input: styles.input, label: styles.label }}
            flex={1}
            size="lg"
            label={
              <Text fz={14} c="#667085">
                First Name <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Enter first name"
            {...form.getInputProps("firstName")}
            errorProps={{ fz: 12 }}
          />

          <TextInput
            classNames={{ input: styles.input, label: styles.label }}
            flex={1}
            size="lg"
            label={
              <Text fz={14} c="#667085">
                Last Name <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Enter last name"
            {...form.getInputProps("lastName")}
            errorProps={{ fz: 12 }}
          />
        </Flex>
      ),
      []
    );

    const AmountField = useCallback(
      ({
        form,
      }: {
        form: UseFormReturnType<typeof sendMoneyIndividualRequest>;
      }) => (
        <Flex gap={20} mt={24}>
          <NumberInput
            flex={1}
            classNames={{ input: styles.input, label: styles.label }}
            description={
              <Text fz={12}>
                {Number(form.values.amount) > Number(account?.accountBalance) ||
                !account?.accountBalance ||
                account?.accountBalance === 0
                  ? `Insufficient Balance`
                  : ""}
              </Text>
            }
            styles={{
              description: { color: "var(--prune-warning)" },
              input: {
                border:
                  Number(form.values.amount) >
                    Number(account?.accountBalance) ||
                  !account?.accountBalance ||
                  account?.accountBalance === 0
                    ? "1px solid red"
                    : "1px solid #eaecf0",
              },
            }}
            label={
              <Text fz={14} c="#667085">
                Amount <span style={{ color: "red" }}>*</span>
              </Text>
            }
            hideControls
            size="lg"
            placeholder="Enter amount"
            {...form.getInputProps("amount")}
            errorProps={{ fz: 12 }}
          />
        </Flex>
      ),
      [account?.accountBalance]
    );

    const DropzoneOptional = useCallback(
      ({
        form,
      }: {
        form: UseFormReturnType<typeof sendMoneyIndividualRequest>;
      }) => (
        <Flex gap={20} mt={24} direction="column">
          <Text fz={14} c="#667085" m={0} p={0}>
            Upload supporting document (Optional)
          </Text>
          <DropzoneComponent<typeof sendMoneyIndividualRequest>
            style={{ flex: 1 }}
            otherForm={form}
            formKey="invoice"
            uploadedFileUrl={form.values.invoice}
            isUser
          />
        </Flex>
      ),
      []
    );

    const NarrationField = useCallback(
      ({
        form,
      }: {
        form: UseFormReturnType<typeof sendMoneyIndividualRequest>;
      }) => (
        <Flex gap={20} mt={24}>
          <Textarea
            flex={1}
            autosize
            minRows={3}
            size="lg"
            maxLength={24}
            classNames={{ input: styles.textarea, label: styles.label }}
            label={
              <Text fz={14} c="#667085">
                Narration <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Enter narration"
            {...form.getInputProps("narration")}
            errorProps={{ fz: 12 }}
          />
        </Flex>
      ),
      []
    );

    const BICIBANField = useCallback(
      ({
        form,
      }: {
        form: UseFormReturnType<typeof sendMoneyIndividualRequest>;
      }) => (
        <Flex align="center" mt={24} gap={20}>
          <TextInput
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            flex={1}
            size="lg"
            label={
              <Text fz={14} c="#667085">
                BIC / SWIFT <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Enter BIC"
            {...form.getInputProps("destinationBIC")}
            errorProps={{ fz: 12 }}
          />

          <TextInput
            classNames={{
              input: styles.input,
              label: styles.label,
            }}
            flex={1}
            size="lg"
            label={
              <Text fz={14} c="#667085">
                IBAN <span style={{ color: "red" }}>*</span>
              </Text>
            }
            placeholder="Enter IBAN"
            {...form.getInputProps("destinationIBAN")}
            errorProps={{ fz: 12 }}
          />
        </Flex>
      ),
      []
    );

    return (
      <>
        <TabsPanel value="To Individual">
          <Box mt={20}>
            <ScrollArea
              h={validated ? "calc(100dvh - 500px)" : "100%"}
              scrollbarSize={3}
            >
              {switchCurrency === "GHS" ? (
                <>
                  <SelectTypeOfTransfer />

                  {loading ? (
                    <Skeleton h={50} w={"100%"} />
                  ) : (
                    <Flex gap={20}>
                      <Select
                        searchable
                        label={
                          <Text fz={14} c="#667085">
                            {transferCurrency === "BankTransfer"
                              ? "Bank"
                              : "Provider"}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                        }
                        classNames={{
                          input: styles.input,
                          label: styles.label,
                        }}
                        flex={1}
                        data={memorizedData}
                        placeholder={
                          transferCurrency === "BankTransfer"
                            ? "Select Bank"
                            : "Select Provider"
                        }
                        {...form.getInputProps("destinationBank")}
                        onChange={(value) => {
                          form.setFieldValue("destinationBank", value!);
                          if (value && banks && Array.isArray(banks)) {
                            const selectedBank = banks.find(
                              (bank) =>
                                bank.bankName === value &&
                                transferCurrency === bank.payoutType
                            );
                            if (selectedBank) {
                              form.setFieldValue(
                                "beneficiaryBankCode",
                                selectedBank.bankCode
                              );
                            }
                          }
                        }}
                        errorProps={{ fz: 12 }}
                      />
                    </Flex>
                  )}

                  <Flex gap={20} mt={24}>
                    {transferCurrency === "BankTransfer" ? (
                      <TextInput
                        classNames={{
                          input: styles.input,
                          label: styles.label,
                        }}
                        flex={1}
                        size="lg"
                        type="number"
                        minLength={10}
                        maxLength={16}
                        label={
                          <Text fz={14} c="#667085">
                            Account Number{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                        }
                        placeholder="Enter account number"
                        {...form.getInputProps("accountNumber")}
                        errorProps={{ fz: 12 }}
                      />
                    ) : (
                      <TextInput
                        type="number"
                        minLength={10}
                        maxLength={13}
                        classNames={{
                          input: styles.input,
                          label: styles.label,
                        }}
                        flex={1}
                        size="lg"
                        label={
                          <Text fz={14} c="#667085">
                            Phone Number <span style={{ color: "red" }}>*</span>
                          </Text>
                        }
                        placeholder="Enter phone number (e.g. 233XXXXXXXXX)"
                        {...form.getInputProps("phoneNumber")}
                        errorProps={{ fz: 12 }}
                      />
                    )}
                  </Flex>

                  <NameFields mt={24} form={form} />

                  <AmountField form={form} />

                  <DropzoneOptional form={form} />

                  <NarrationField form={form} />
                </>
              ) : switchCurrency === "USD" ? (
                <>
                  <USDSelectTypeOfTransfer />

                  <NameFields mt={24} form={form} />

                  {switchCurrencyOutsideUS === "WithinUSA" ? (
                    <>
                      <BICIBANField form={form} />

                      {(processing || validated) && showBadge && (
                        <Group
                          justify="space-between"
                          bg="#ECFDF3"
                          w="100%"
                          px={20}
                          py={8}
                          my={switchCurrency === "USD" ? 0 : 32}
                          mt={20}
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
                          {processing && (
                            <Loader type="oval" size={24} color="#12B76A" />
                          )}
                        </Group>
                      )}
                    </>
                  ) : (
                    <Flex align="center" mt={24} gap={20}>
                      <TextInput
                        classNames={{
                          input: styles.input,
                          label: styles.label,
                        }}
                        flex={1}
                        size="lg"
                        type="number"
                        minLength={10}
                        maxLength={16}
                        label={
                          <Text fz={14} c="#667085">
                            Routing Number (ABA){" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                        }
                        placeholder="Enter routing number"
                        {...form.getInputProps("routingNumber")}
                        errorProps={{ fz: 12 }}
                      />

                      <TextInput
                        classNames={{
                          input: styles.input,
                          label: styles.label,
                        }}
                        flex={1}
                        size="lg"
                        type="number"
                        minLength={10}
                        maxLength={16}
                        label={
                          <Text fz={14} c="#667085">
                            Account Number{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Text>
                        }
                        placeholder="Enter account number"
                        {...form.getInputProps("accountNumber")}
                        errorProps={{ fz: 12 }}
                      />
                    </Flex>
                  )}

                  <Flex gap={20} mt={24}>
                    <TextInput
                      placeholder="Enter Bank Name"
                      classNames={{
                        input: styles.input,
                        label: styles.label,
                      }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          Bank <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      disabled={disableBank}
                      {...form.getInputProps("destinationBank")}
                      errorProps={{ fz: 12 }}
                    />
                  </Flex>

                  <Flex gap={20} mt={24}>
                    <TextInput
                      classNames={{
                        input: styles.input,
                        label: styles.label,
                      }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          Bank Address
                        </Text>
                      }
                      placeholder="Bank Address"
                      disabled={disableAddress}
                      {...form.getInputProps("bankAddress")}
                      errorProps={{ fz: 12 }}
                    />
                  </Flex>

                  <AmountField form={form} />

                  <Flex gap={20} mt={24}>
                    <Select
                      searchable
                      placeholder="Select Country"
                      classNames={{
                        input: styles.input,
                        label: styles.label,
                      }}
                      flex={1}
                      label={
                        <Text fz={14} c="#667086">
                          Country <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      data={countries.map((c) => c?.name)}
                      disabled={disableCountry}
                      {...form.getInputProps("destinationCountry")}
                    />
                  </Flex>

                  <DropzoneOptional form={form} />

                  <NarrationField form={form} />
                </>
              ) : (
                <>
                  <NameFields form={form} />

                  <Flex gap={20} mt={24} direction={"column"}>
                    {switchCurrency === "EUR" ? (
                      <Flex direction="column" style={{ flex: 1 }} gap={20}>
                        <TextInput
                          classNames={{
                            input: styles.input,
                            label: styles.label,
                          }}
                          flex={1}
                          size="lg"
                          label={
                            <Text fz={14} c="#667085">
                              IBAN <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter IBAN"
                          {...form.getInputProps("destinationIBAN")}
                          errorProps={{ fz: 12 }}
                        />
                        <TextInput
                          classNames={{
                            input: styles.input,
                            label: styles.label,
                          }}
                          flex={1}
                          size="lg"
                          label={
                            <Text fz={14} c="#667085">
                              BIC <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter BIC"
                          {...form.getInputProps("destinationBIC")}
                          errorProps={{ fz: 12 }}
                        />
                      </Flex>
                    ) : (
                      <>
                        <TextInput
                          type="number"
                          classNames={{
                            input: styles.input,
                            label: styles.label,
                          }}
                          flex={1}
                          size="lg"
                          label={
                            <Text fz={14} c="#667085">
                              Account Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter Account Number"
                          {...form.getInputProps("destinationAccountNumber")}
                          onKeyDown={(e) => {
                            if (["ArrowUp", "ArrowDown", "-"].includes(e.key)) {
                              e.preventDefault();
                            }
                            const isDigit = /^\d$/.test(e.key);
                            const currentLength =
                              form.values.destinationAccountNumber.length;
                            if (isDigit && currentLength >= 8) {
                              e.preventDefault();
                              return;
                            }
                          }}
                          onWheel={(event) => event.currentTarget.blur()}
                          errorProps={{ fz: 12 }}
                        />
                        <TextInput
                          type="number"
                          classNames={{
                            input: styles.input,
                            label: styles.label,
                          }}
                          flex={1}
                          size="lg"
                          label={
                            <Text fz={14} c="#667085">
                              Sort Code <span style={{ color: "red" }}>*</span>
                            </Text>
                          }
                          placeholder="Enter Sort Code"
                          {...form.getInputProps("destinationSortCode")}
                          onKeyDown={(e) => {
                            if (["ArrowUp", "ArrowDown", "-"].includes(e.key)) {
                              e.preventDefault();
                            }
                            const isDigit = /^\d$/.test(e.key);
                            const currentLength =
                              form.values.destinationSortCode.length;
                            if (isDigit && currentLength >= 6) {
                              e.preventDefault();
                              return;
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pasted = e.clipboardData
                              .getData("Text")
                              .replace(/-/g, "");
                            const digitsOnly = pasted.replace(/\D/g, "");
                            const currentValue =
                              form.values.destinationSortCode;
                            const newValue = (currentValue + digitsOnly).slice(
                              0,
                              6
                            );
                            form.setFieldValue("destinationSortCode", newValue);
                          }}
                          onWheel={(event) => event.currentTarget.blur()}
                          errorProps={{ fz: 12 }}
                        />
                      </>
                    )}
                    {(processing || validated) && showBadge && (
                      <Group
                        justify="space-between"
                        bg="#ECFDF3"
                        w="100%"
                        px={20}
                        py={8}
                        my={switchCurrency === "EUR" ? 0 : 32}
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
                        {processing && (
                          <Loader type="oval" size={24} color="#12B76A" />
                        )}
                      </Group>
                    )}

                    {validated && (
                      <>
                        <Flex gap={20} mt={24}>
                          <TextInput
                            placeholder="Enter Bank Name"
                            classNames={{
                              input: styles.input,
                              label: styles.label,
                            }}
                            flex={1}
                            size="lg"
                            label={
                              <Text fz={14} c="#667085">
                                Bank <span style={{ color: "red" }}>*</span>
                              </Text>
                            }
                            disabled={disableBank}
                            {...form.getInputProps("destinationBank")}
                            errorProps={{ fz: 12 }}
                          />
                        </Flex>
                        <Flex gap={20} mt={24}>
                          <TextInput
                            classNames={{
                              input: styles.input,
                              label: styles.label,
                            }}
                            flex={1}
                            size="lg"
                            label={
                              <Text fz={14} c="#667085">
                                Bank Address
                              </Text>
                            }
                            placeholder="Bank Address"
                            disabled={disableAddress}
                            {...form.getInputProps("bankAddress")}
                            errorProps={{ fz: 12 }}
                          />
                        </Flex>

                        <AmountField form={form} />

                        <Flex gap={20} mt={24}>
                          <Select
                            searchable
                            placeholder="Select Country"
                            classNames={{
                              input: styles.input,
                              label: styles.label,
                            }}
                            flex={1}
                            label={
                              <Text fz={14} c="#667086">
                                Country <span style={{ color: "red" }}>*</span>
                              </Text>
                            }
                            data={countries.map((c) => c?.name)}
                            disabled={disableCountry}
                            {...form.getInputProps("destinationCountry")}
                          />
                        </Flex>

                        <DropzoneOptional form={form} />

                        <NarrationField form={form} />
                      </>
                    )}
                  </Flex>
                </>
              )}

              <Flex
                align="center"
                justify="flex-start"
                mt={24}
                direction="column"
                gap={10}
              >
                <Box p={12} bg="#F9FAFB" w="100%">
                  <Checkbox
                    color="#97AD05"
                    fz={12}
                    value="non-individual"
                    onChange={(e) => setPaymentType(e.currentTarget.value)}
                    checked={paymentType === "non-individual"}
                    label="Yes, I am making this payment on behalf of another party"
                  />
                </Box>

                <Box p={12} bg="#F9FAFB" w="100%">
                  <Checkbox
                    color="#97AD05"
                    fz={12}
                    value="individual"
                    onChange={(e) => setPaymentType(e.currentTarget.value)}
                    checked={paymentType === "individual"}
                    label="No, I am making this payment on my own behalf"
                  />
                </Box>
              </Flex>

              {switchCurrency === "EUR" ? (
                <TransactionProcessingTimes />
              ) : switchCurrency === "GHS" ? null : (
                <TransactionProcessTimeGBP />
              )}
            </ScrollArea>

            <Flex mt={24} justify="flex-end" gap={15}>
              <PrimaryBtn
                action={handleDebtorState}
                text="Continue"
                fullWidth
                fw={600}
                h={48}
              />
            </Flex>
          </Box>
        </TabsPanel>
      </>
    );
  }
);

export default Individual;
