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
  ActionIcon,
  Badge,
  Loader,
  ScrollArea,
  Checkbox,
} from "@mantine/core";
import { TextInput, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import { DefaultAccount, validateAccount } from "@/lib/hooks/accounts";
import DropzoneComponent from "../Dropzone";
import { sendMoneyCompanyValidate } from "@/lib/schema";
// import { countries } from "@/lib/static";
import { useDebouncedValue } from "@mantine/hooks";
import { removeWhitespace } from "@/lib/utils";
import countries from "@/assets/countries.json";
import TransactionProcessingTimes from "./TransactionProcessingTimes";
import useCurrencySwitchStore from "@/lib/store/currency-switch";

interface CompanyProps {
  account: DefaultAccount | null;
  close: () => void;
  setCompanyRequestForm: any;
  openPreview: () => void;
  setSectionState: any;
  validated: boolean | null;
  setValidated: Dispatch<SetStateAction<boolean | null>>;
  showBadge: boolean;
  setShowBadge: Dispatch<SetStateAction<boolean>>;
  openDebtor: () => void;
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;
}

export const sendMoneyRequest = {
  amount: "",
  companyName: "",
  destinationIBAN: "",
  destinationBIC: "",
  destinationBank: "",
  bankAddress: "",
  destinationCountry: "",
  invoice: "",
  reference: crypto.randomUUID(),
  narration: "",
};

const Company = forwardRef<HTMLDivElement, CompanyProps>(function Company(
  {
    account,
    close,
    openPreview,
    setCompanyRequestForm,
    setSectionState,
    validated,
    setValidated,
    showBadge,
    setShowBadge,
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

  const form2 = useForm({
    initialValues: {
      ...sendMoneyRequest,
    },
    validate: zodResolver(sendMoneyCompanyValidate),
  });

  const [{ bic, iban }] = useDebouncedValue(
    { iban: form2.values.destinationIBAN, bic: form2.values.destinationBIC },
    2000
  );

  const handlePreviewState = () => {
    const { hasErrors } = form2.validate();
    if (hasErrors) return;
    if (
      account?.accountBalance &&
      account?.accountBalance < Number(form2.values.amount)
    )
      return form2.setFieldError(
        "amount",
        `Insufficient funds: The amount entered exceeds your balance`
      );

    // close();
    setCompanyRequestForm(form2.values);
    setSectionState("Company");
    openDebtor();
    // openPreview();
  };

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
        form2.setValues({
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
        // Scroll to top of container
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
      console.log({ bic, iban });
      handleIbanValidation();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bic, iban]);

  return (
    <TabsPanel value="To A Company">
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
                  Company Name
                </Text>
              }
              placeholder="Enter company Name"
              {...form2.getInputProps("companyName")}
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
                switchCurrency === "EUR" ? "Enter IBAN" : "Enter Account Number"
              }
              {...form2.getInputProps("destinationIBAN")}
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
              {...form2.getInputProps("destinationBIC")}
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
                  {...form2.getInputProps("destinationBank")}
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
                  disabled={disableAddress}
                  placeholder="Bank Address"
                  {...form2.getInputProps("bankAddress")}
                  errorProps={{
                    fz: 0,
                  }}
                />
              </Flex>

              <Flex gap={20} mt={24}>
                <Select
                  searchable
                  placeholder="Select Country"
                  classNames={{ input: styles.input, label: styles.label }}
                  flex={1}
                  label="Country"
                  data={countries.map((c) => c.name)}
                  disabled={disableCountry}
                  {...form2.getInputProps("destinationCountry")}
                />
              </Flex>

              <Flex gap={20} mt={24}>
                <NumberInput
                  flex={1}
                  classNames={{ input: styles.input, label: styles.label }}
                  description={
                    <Text fz={12}>
                      {Number(form2.values.amount) >
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
                        Number(form2.values.amount) >
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
                  {...form2.getInputProps("amount")}
                  errorProps={{
                    fz: 0,
                  }}
                />
              </Flex>

              <Flex gap={20} mt={24} direction="column">
                <Text fz={14} c="#667085" m={0} p={0}>
                  Upload supporting document (Optional)
                </Text>
                <DropzoneComponent<typeof sendMoneyRequest>
                  style={{ flex: 1 }}
                  otherForm={form2}
                  formKey="invoice"
                  uploadedFileUrl={form2.values.invoice}
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
                  {...form2.getInputProps("narration")}
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

          <TransactionProcessingTimes />
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
            action={handlePreviewState}
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
  );
});

export default Company;
