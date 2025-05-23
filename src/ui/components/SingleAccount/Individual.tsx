"use client";

import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useState,
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
} from "@mantine/core";
import { TextInput, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { PrimaryBtn } from "../Buttons";
import {
  DefaultAccount,
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
  bankAddress: "",
  destinationCountry: "",
  amount: "",
  invoice: "",
  narration: "",
  currency: "",
};

<<<<<<< HEAD
function Individual({
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
}: IndividualProps) {
  const [processing, setProcessing] = useState(false);
  const [disableBank, setDisableBank] = useState(false);
  const [disableAddress, setDisableAddress] = useState(false);
  const [disableCountry, setDisableCountry] = useState(false);
  const { switchCurrency } = useCurrencySwitchStore();

  const form = useForm({
    initialValues: {
      ...sendMoneyIndividualRequest,
    },
    validate: zodResolver(sendMoneyIndividualValidate),
  });

  const [{ bic, iban }] = useDebouncedValue(
    { iban: form.values.destinationIBAN, bic: form.values.destinationBIC },
    2000
  );

<<<<<<< HEAD
    useEffect(() => {
      form.setFieldValue("currency", switchCurrency);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [switchCurrency]);

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
=======
  const handleIbanValidation = async () => {
    setProcessing(true);
    setValidated(null);
    setDisableAddress(false);
    setDisableBank(false);
    setDisableCountry(false);
    setShowBadge(true);
    try {
      const data = await validateAccount({
        iban: removeWhitespace(iban),
        bic: removeWhitespace(bic),
      });

      if (data) {
        form.setValues({
          bankAddress: data.address || data.city,
          destinationBank: data.bankName,
          destinationCountry: data.country,
>>>>>>> 4938c1b (Revert "Emma/gbp account implementation")
=======
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
    const [processing, setProcessing] = useState(false);
    const [disableBank, setDisableBank] = useState(false);
    const [disableAddress, setDisableAddress] = useState(false);
    const [disableCountry, setDisableCountry] = useState(false);
    const { switchCurrency } = useCurrencySwitchStore();

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
>>>>>>> 793ca31 (refactor: restructure Individual and Company components for improved readability and maintainability)
        });

        if (data) {
          form.setValues({
            bankAddress: data.address || data.city,
            destinationBank: data.bankName,
            destinationCountry: data.country,
          });

<<<<<<< HEAD
  useEffect(() => {
    if (iban && bic) {
      handleIbanValidation();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bic, iban]);

<<<<<<< HEAD
    useEffect(() => {
      if (accountNumber && sortCode) {
        handleIbanValidation();
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

<<<<<<< HEAD
=======
  const handleDebtorState = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;
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

>>>>>>> 4938c1b (Revert "Emma/gbp account implementation")
  return (
    <>
      <TabsPanel value="To Individual">
        <Box mt={20}>
          <ScrollArea
            h={validated ? "calc(100dvh - 500px)" : "100%"}
            scrollbarSize={3}
            // pr={20}
          >
            <Flex gap={20}>
              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                size="lg"
                label={
                  <Text fz={14} c="#667085">
                    First Name
                  </Text>
                }
                placeholder="Enter first name"
                {...form.getInputProps("firstName")}
                errorProps={{
                  fz: 0,
                }}
              />
<<<<<<< HEAD

              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                size="lg"
                label={
                  <Text fz={14} c="#667085">
                    Last Name
                  </Text>
                }
                placeholder="Enter last name"
                {...form.getInputProps("lastName")}
                errorProps={{
                  fz: 0,
                }}
              />
            </Flex>

            <Flex gap={20} mt={24}>
              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                size="lg"
                label={
                  <Text fz={14} c="#667085">
                    {switchCurrency === "EUR" ? "IBAN" : "Account Number"}
                  </Text>
                }
                placeholder={
                  switchCurrency === "EUR"
                    ? "Enter IBAN"
                    : "Enter Account Number"
                }
                {...form.getInputProps("destinationIBAN")}
                errorProps={{
                  fz: 0,
                }}
              />

              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                size="lg"
                label={
                  <Text fz={14} c="#667085">
                    {switchCurrency === "EUR" ? "BIC" : "Sort Code"}
                  </Text>
                }
                placeholder={
                  switchCurrency === "EUR" ? "Enter BIC" : "Enter Sort Code"
                }
                {...form.getInputProps("destinationBIC")}
                errorProps={{
                  fz: 0,
                }}
              />
            </Flex>
=======
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

    return (
      <>
        <TabsPanel value="To Individual">
          <Box mt={20}>
            <ScrollArea
              h={validated ? "calc(100dvh - 500px)" : "100%"}
              scrollbarSize={3}
              // pr={20}
            >
              <Flex gap={20}>
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
                  errorProps={{
                    fz: 12,
                  }}
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
                  errorProps={{
                    fz: 12,
                  }}
                />
              </Flex>

              <Flex gap={20} mt={24}>
                {switchCurrency === "EUR" ? (
                  <>
                    <TextInput
                      classNames={{ input: styles.input, label: styles.label }}
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
                      classNames={{ input: styles.input, label: styles.label }}
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
                  </>
                ) : (
                  <>
                    <TextInput
                      type="number"
                      classNames={{ input: styles.input, label: styles.label }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          Account Number <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="Enter Account Number"
                      {...form.getInputProps("destinationAccountNumber")}
                      onKeyDown={(e) => {
                        if (["ArrowUp", "ArrowDown", "-"].includes(e.key)) {
                          e.preventDefault(); // Prevent increment/decrement via arrow keys
                        }

                        const isDigit = /^\d$/.test(e.key);
                        const currentLength =
                          form.values.destinationAccountNumber.length;

                        if (isDigit && currentLength >= 8) {
                          e.preventDefault(); // stop more digits from being typed
                          return;
                        }
                      }}
                      onWheel={(event) => event.currentTarget.blur()}
                      errorProps={{ fz: 12 }}
                    />
                    <TextInput
                      type="number"
                      classNames={{ input: styles.input, label: styles.label }}
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
                          e.preventDefault(); // Prevent increment/decrement via arrow keys
                        }

                        const isDigit = /^\d$/.test(e.key);
                        const currentLength =
                          form.values.destinationSortCode.length;

                        if (isDigit && currentLength >= 6) {
                          e.preventDefault(); // stop more digits from being typed
                          return;
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData
                          .getData("Text")
                          .replace(/-/g, ""); // remove dashes
                        const digitsOnly = pasted.replace(/\D/g, ""); // keep only digits

                        const currentValue = form.values.destinationSortCode;
                        const newValue = (currentValue + digitsOnly).slice(
                          0,
                          6
                        ); // limit to 6 digits

                        form.setFieldValue("destinationSortCode", newValue);
                      }}
                      onWheel={(event) => event.currentTarget.blur()}
                      errorProps={{ fz: 12 }}
                    />
                  </>
                )}
              </Flex>

              {(processing || validated) && showBadge && (
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

                  {processing && (
                    <Loader type="oval" size={24} color="#12B76A" />
                  )}
                </Group>
              )}

              {validated && (
                <>
                  {" "}
                  <Flex gap={20} mt={24}>
                    <TextInput
                      placeholder="Enter Bank Name"
                      classNames={{ input: styles.input, label: styles.label }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          Bank <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      disabled={disableBank}
                      {...form.getInputProps("destinationBank")}
                      errorProps={{
                        fz: 12,
                      }}
                    />
                  </Flex>
                  <Flex gap={20} mt={24}>
                    <TextInput
                      classNames={{ input: styles.input, label: styles.label }}
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
                      errorProps={{
                        fz: 12,
                      }}
                    />
                  </Flex>
                  <Flex gap={20} mt={24}>
                    <NumberInput
                      flex={1}
                      classNames={{ input: styles.input, label: styles.label }}
                      description={
                        <Text fz={12}>
                          {Number(form.values.amount) >
                          Number(account?.accountBalance)
                            ? `Insufficient Balance`
                            : ""}
                        </Text>
                      }
                      styles={{
                        description: {
                          color: "var(--prune-warning)",
                        },
                        input: {
                          border:
                            Number(form.values.amount) >
                            Number(account?.accountBalance)
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
                      errorProps={{
                        fz: 12,
                      }}
                      // error={account?.accountBalance < form.values.amount}
                    />
                  </Flex>
                  <Flex gap={20} mt={24}>
                    <Select
                      searchable
                      placeholder="Select Country"
                      classNames={{ input: styles.input, label: styles.label }}
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
                  <Flex gap={20} mt={24}>
                    <Textarea
                      flex={1}
                      autosize
                      minRows={3}
                      size="lg"
                      classNames={{
                        input: styles.textarea,
                        label: styles.label,
                      }}
                      label={
                        <Text fz={14} c="#667085">
                          Narration <span style={{ color: "red" }}>*</span>
                        </Text>
                      }
                      placeholder="Enter narration"
                      {...form.getInputProps("narration")}
                      errorProps={{
                        fz: 12,
                      }}
                    />
                  </Flex>
                </>
              )}
>>>>>>> 793ca31 (refactor: restructure Individual and Company components for improved readability and maintainability)

              <Flex
                align="center"
                justify="flex-start"
                mt={24}
                direction="column"
                gap={10}
              >
<<<<<<< HEAD
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

                {processing && <Loader type="oval" size={24} color="#12B76A" />}
              </Group>
            )}

            {validated && (
              <>
                {" "}
                <Flex gap={20} mt={24}>
                  <TextInput
                    placeholder="Enter Bank Name"
                    classNames={{ input: styles.input, label: styles.label }}
                    flex={1}
                    size="lg"
                    label={
                      <Text fz={14} c="#667085">
                        Bank
                      </Text>
                    }
                    disabled={disableBank}
                    {...form.getInputProps("destinationBank")}
                    errorProps={{
                      fz: 0,
                    }}
                  />
                </Flex>
                <Flex gap={20} mt={24}>
                  <TextInput
                    classNames={{ input: styles.input, label: styles.label }}
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
                    errorProps={{
                      fz: 0,
                    }}
                  />
                </Flex>
                <Flex gap={20} mt={24}>
                  <NumberInput
                    flex={1}
                    classNames={{ input: styles.input, label: styles.label }}
                    description={
                      <Text fz={12}>
                        {Number(form.values.amount) >
                        Number(account?.accountBalance)
                          ? `Insufficient Balance`
                          : ""}
                      </Text>
                    }
                    styles={{
                      description: {
                        color: "var(--prune-warning)",
                      },
                      input: {
                        border:
                          Number(form.values.amount) >
                          Number(account?.accountBalance)
                            ? "1px solid red"
                            : "1px solid #eaecf0",
                      },
                    }}
                    label={
                      <Text fz={14} c="#667085">
                        Amount
                      </Text>
                    }
                    hideControls
                    size="lg"
                    placeholder="Enter amount"
                    {...form.getInputProps("amount")}
                    errorProps={{
                      fz: 0,
                    }}
                    // error={account?.accountBalance < form.values.amount}
                  />
                </Flex>
                <Flex gap={20} mt={24}>
                  <Select
                    searchable
                    placeholder="Select Country"
                    classNames={{ input: styles.input, label: styles.label }}
                    flex={1}
                    label="Country"
                    data={countries.map((c) => ({
                      label: c?.name,
                      value: c?.code,
                    }))}
                    disabled={disableCountry}
                    {...form.getInputProps("destinationCountry")}
                  />
                </Flex>
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
                <Flex gap={20} mt={24}>
                  <Textarea
                    flex={1}
                    autosize
                    minRows={3}
                    size="lg"
                    classNames={{ input: styles.textarea, label: styles.label }}
                    label={
                      <Text fz={14} c="#667085">
                        Narration
                      </Text>
                    }
                    placeholder="Enter narration"
                    {...form.getInputProps("narration")}
                    errorProps={{
                      fz: 0,
                    }}
                  />
                </Flex>
              </>
            )}

            <Flex
              align="center"
              justify="flex-start"
              mt={24}
              direction="column"
              gap={10}
=======
    return (
      <>
        <TabsPanel value="To Individual">
          <Box mt={20}>
            <ScrollArea
              h={validated ? "calc(100dvh - 500px)" : "100%"}
              scrollbarSize={3}
              // pr={20}
>>>>>>> 72da6d8 (fix(Individual, Company, SendMoneyModal): refactor component structure and improve loading state handling)
            >
              <Flex gap={20}>
                <TextInput
                  classNames={{ input: styles.input, label: styles.label }}
                  flex={1}
                  size="lg"
                  label={
                    <Text fz={14} c="#667085">
                      First Name
                    </Text>
                  }
                  placeholder="Enter first name"
                  {...form.getInputProps("firstName")}
                  errorProps={{
                    fz: 12,
                  }}
                />

                <TextInput
                  classNames={{ input: styles.input, label: styles.label }}
                  flex={1}
                  size="lg"
                  label={
                    <Text fz={14} c="#667085">
                      Last Name
                    </Text>
                  }
                  placeholder="Enter last name"
                  {...form.getInputProps("lastName")}
                  errorProps={{
                    fz: 12,
                  }}
                />
              </Flex>

              <Flex gap={20} mt={24}>
                {switchCurrency === "EUR" ? (
                  <>
                    <TextInput
                      classNames={{ input: styles.input, label: styles.label }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          IBAN
                        </Text>
                      }
                      placeholder="Enter IBAN"
                      {...form.getInputProps("destinationIBAN")}
                      errorProps={{ fz: 12 }}
                    />
                    <TextInput
                      classNames={{ input: styles.input, label: styles.label }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          BIC
                        </Text>
                      }
                      placeholder="Enter BIC"
                      {...form.getInputProps("destinationBIC")}
                      errorProps={{ fz: 12 }}
                    />
                  </>
                ) : (
                  <>
                    <TextInput
                      classNames={{ input: styles.input, label: styles.label }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          Account Number
                        </Text>
                      }
                      placeholder="Enter Account Number"
                      {...form.getInputProps("destinationAccountNumber")}
                      errorProps={{ fz: 12 }}
                    />
                    <TextInput
                      classNames={{ input: styles.input, label: styles.label }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          Sort Code
                        </Text>
                      }
                      placeholder="Enter Sort Code"
                      {...form.getInputProps("destinationSortCode")}
                      errorProps={{ fz: 12 }}
                    />
                  </>
                )}
              </Flex>

              {(processing || validated) && showBadge && (
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

                  {processing && (
                    <Loader type="oval" size={24} color="#12B76A" />
                  )}
                </Group>
              )}

              {validated && (
                <>
                  {" "}
                  <Flex gap={20} mt={24}>
                    <TextInput
                      placeholder="Enter Bank Name"
                      classNames={{ input: styles.input, label: styles.label }}
                      flex={1}
                      size="lg"
                      label={
                        <Text fz={14} c="#667085">
                          Bank
                        </Text>
                      }
                      disabled={disableBank}
                      {...form.getInputProps("destinationBank")}
                      errorProps={{
                        fz: 12,
                      }}
                    />
                  </Flex>
                  <Flex gap={20} mt={24}>
                    <TextInput
                      classNames={{ input: styles.input, label: styles.label }}
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
                      errorProps={{
                        fz: 12,
                      }}
                    />
                  </Flex>
                  <Flex gap={20} mt={24}>
                    <NumberInput
                      flex={1}
                      classNames={{ input: styles.input, label: styles.label }}
                      description={
                        <Text fz={12}>
                          {Number(form.values.amount) >
                          Number(account?.accountBalance)
                            ? `Insufficient Balance`
                            : ""}
                        </Text>
                      }
                      styles={{
                        description: {
                          color: "var(--prune-warning)",
                        },
                        input: {
                          border:
                            Number(form.values.amount) >
                            Number(account?.accountBalance)
                              ? "1px solid red"
                              : "1px solid #eaecf0",
                        },
                      }}
                      label={
                        <Text fz={14} c="#667085">
                          Amount
                        </Text>
                      }
                      hideControls
                      size="lg"
                      placeholder="Enter amount"
                      {...form.getInputProps("amount")}
                      errorProps={{
                        fz: 12,
                      }}
                      // error={account?.accountBalance < form.values.amount}
                    />
                  </Flex>
                  <Flex gap={20} mt={24}>
                    <Select
                      searchable
                      placeholder="Select Country"
                      classNames={{ input: styles.input, label: styles.label }}
                      flex={1}
                      label="Country"
                      data={countries.map((c) => c?.name)}
                      disabled={disableCountry}
                      {...form.getInputProps("destinationCountry")}
                    />
                  </Flex>
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
                  <Flex gap={20} mt={24}>
                    <Textarea
                      flex={1}
                      autosize
                      minRows={3}
                      size="lg"
                      classNames={{
                        input: styles.textarea,
                        label: styles.label,
                      }}
                      label={
                        <Text fz={14} c="#667085">
                          Narration
                        </Text>
                      }
                      placeholder="Enter narration"
                      {...form.getInputProps("narration")}
                      errorProps={{
                        fz: 12,
                      }}
                    />
                  </Flex>
                </>
              )}

              <Flex
                align="center"
                justify="flex-start"
                mt={24}
                direction="column"
                gap={10}
=======

              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                size="lg"
                label={
                  <Text fz={14} c="#667085">
                    Last Name
                  </Text>
                }
                placeholder="Enter last name"
                {...form.getInputProps("lastName")}
                errorProps={{
                  fz: 0,
                }}
              />
            </Flex>

            <Flex gap={20} mt={24}>
              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                size="lg"
                label={
                  <Text fz={14} c="#667085">
                    {switchCurrency === "EUR" ? "IBAN" : "Account Number"}
                  </Text>
                }
                placeholder={
                  switchCurrency === "EUR"
                    ? "Enter IBAN"
                    : "Enter Account Number"
                }
                {...form.getInputProps("destinationIBAN")}
                errorProps={{
                  fz: 0,
                }}
              />

              <TextInput
                classNames={{ input: styles.input, label: styles.label }}
                flex={1}
                size="lg"
                label={
                  <Text fz={14} c="#667085">
                    {switchCurrency === "EUR" ? "BIC" : "Sort Code"}
                  </Text>
                }
                placeholder={
                  switchCurrency === "EUR" ? "Enter BIC" : "Enter Sort Code"
                }
                {...form.getInputProps("destinationBIC")}
                errorProps={{
                  fz: 0,
                }}
              />
            </Flex>

            {(processing || validated) && showBadge && (
              <Group
                justify="space-between"
                bg="#ECFDF3"
                w="100%"
                px={20}
                py={8}
                my={32}
>>>>>>> 4938c1b (Revert "Emma/gbp account implementation")
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

                {processing && <Loader type="oval" size={24} color="#12B76A" />}
              </Group>
            )}

            {validated && (
              <>
                {" "}
                <Flex gap={20} mt={24}>
                  <TextInput
                    placeholder="Enter Bank Name"
                    classNames={{ input: styles.input, label: styles.label }}
                    flex={1}
                    size="lg"
                    label={
                      <Text fz={14} c="#667085">
                        Bank
                      </Text>
                    }
                    disabled={disableBank}
                    {...form.getInputProps("destinationBank")}
                    errorProps={{
                      fz: 0,
                    }}
                  />
                </Flex>
                <Flex gap={20} mt={24}>
                  <TextInput
                    classNames={{ input: styles.input, label: styles.label }}
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
                    errorProps={{
                      fz: 0,
                    }}
                  />
                </Flex>
                <Flex gap={20} mt={24}>
                  <NumberInput
                    flex={1}
                    classNames={{ input: styles.input, label: styles.label }}
                    description={
                      <Text fz={12}>
                        {Number(form.values.amount) >
                        Number(account?.accountBalance)
                          ? `Insufficient Balance`
                          : ""}
                      </Text>
                    }
                    styles={{
                      description: {
                        color: "var(--prune-warning)",
                      },
                      input: {
                        border:
                          Number(form.values.amount) >
                          Number(account?.accountBalance)
                            ? "1px solid red"
                            : "1px solid #eaecf0",
                      },
                    }}
                    label={
                      <Text fz={14} c="#667085">
                        Amount
                      </Text>
                    }
                    hideControls
                    size="lg"
                    placeholder="Enter amount"
                    {...form.getInputProps("amount")}
                    errorProps={{
                      fz: 0,
                    }}
                    // error={account?.accountBalance < form.values.amount}
                  />
                </Flex>
                <Flex gap={20} mt={24}>
                  <Select
                    searchable
                    placeholder="Select Country"
                    classNames={{ input: styles.input, label: styles.label }}
                    flex={1}
                    label="Country"
                    data={countries.map((c) => c?.name)}
                    disabled={disableCountry}
                    {...form.getInputProps("destinationCountry")}
                  />
                </Flex>
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
                <Flex gap={20} mt={24}>
                  <Textarea
                    flex={1}
                    autosize
                    minRows={3}
                    size="lg"
                    classNames={{ input: styles.textarea, label: styles.label }}
                    label={
                      <Text fz={14} c="#667085">
                        Narration
                      </Text>
                    }
                    placeholder="Enter narration"
                    {...form.getInputProps("narration")}
                    errorProps={{
                      fz: 0,
                    }}
                  />
                </Flex>
              </>
            )}
=======
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
>>>>>>> 793ca31 (refactor: restructure Individual and Company components for improved readability and maintainability)

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
              ) : (
                <TransactionProcessTimeGBP />
              )}
            </ScrollArea>

            <Flex mt={24} justify="flex-end" gap={15}>
              {/* <SecondaryBtn
              text="Cancel"
              w={126}
              fw={600}
              action={() => {
                close();
              }}
            /> */}
              <PrimaryBtn
                // action={handlePreviewState}
                action={handleDebtorState}
                // loading={processing}
                text="Continue"
                fullWidth
                fw={600}
                h={48}
                // w={126}
              />
            </Flex>
          </Box>
        </TabsPanel>
      </>
    );
  }
);

export default Individual;
