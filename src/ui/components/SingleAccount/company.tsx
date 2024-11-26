"use client";
import Cookies from "js-cookie";

import axios from "axios";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCheck, IconPlus } from "@tabler/icons-react";

import styles from "./sendMoney.module.scss";

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
  TabsPanel,
  ActionIcon,
  Badge,
  Loader,
  ScrollArea,
} from "@mantine/core";
import { TextInput, Select, Button, UnstyledButton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import { formatNumber } from "@/lib/utils";
import { DefaultAccount, validateAccount } from "@/lib/hooks/accounts";
import DropzoneComponent from "../Dropzone";
import TabsComponent from "../Tabs";
import { sendMoneyCompanyValidate } from "@/lib/schema";
import { countries } from "@/lib/static";
import { useDebouncedValue } from "@mantine/hooks";

interface CompanyProps {
  account: DefaultAccount | null;
  close: () => void;
  setCompanyRequestForm: any;
  openPreview: () => void;
  setSectionState: any;
  validated: boolean | null;
  setValidated: Dispatch<SetStateAction<boolean | null>>;
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

function Company({
  account,
  close,
  openPreview,
  setCompanyRequestForm,
  setSectionState,
  validated,
  setValidated,
}: CompanyProps) {
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(false);

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

    close();
    setCompanyRequestForm(form2.values);
    setSectionState("Company");
    openPreview();
  };

  const handleIbanValidation = async () => {
    setProcessing(true);
    setValidated(null);
    setDisabled(false);
    try {
      const data = await validateAccount({ iban, bic });

      if (data) {
        form2.setValues({
          bankAddress: data.address,
          destinationBank: data.bankName,
          destinationCountry: data.country,
        });

        setValidated(true);
        setDisabled(true);
      } else {
        setValidated(false);
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
  }, [bic, iban]);

  console.log({ bic, iban });

  return (
    <TabsPanel value="To A Company">
      <Box mt={20}>
        <ScrollArea h="calc(100dvh - 500px)" scrollbarSize={3} pr={20}>
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
                  IBAN
                </Text>
              }
              placeholder="Enter IBAN"
              {...form2.getInputProps("destinationIBAN")}
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
                  BIC
                </Text>
              }
              placeholder="Enter BIC"
              {...form2.getInputProps("destinationBIC")}
              errorProps={{
                fz: 12,
              }}
            />
          </Flex>

          {(processing || validated) && (
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
                  disabled={disabled}
                  {...form2.getInputProps("destinationBank")}
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
                  disabled={disabled}
                  placeholder="Bank Address"
                  {...form2.getInputProps("bankAddress")}
                  errorProps={{
                    fz: 12,
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
                  data={countries}
                  disabled={disabled}
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
                    fz: 12,
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
                    fz: 12,
                  }}
                />
              </Flex>
            </>
          )}
        </ScrollArea>

        <Flex mt={24} justify="flex-end" gap={15}>
          <SecondaryBtn
            text="Cancel"
            w={126}
            fw={600}
            action={() => {
              close();
            }}
          />
          <PrimaryBtn
            action={handlePreviewState}
            // loading={processing}
            text="Submit"
            fw={600}
            w={126}
          />
        </Flex>
      </Box>
    </TabsPanel>
  );
}

export default Company;
