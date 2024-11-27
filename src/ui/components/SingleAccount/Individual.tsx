"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
} from "@mantine/core";
import { TextInput, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import { DefaultAccount, validateAccount } from "@/lib/hooks/accounts";
import { countries } from "@/lib/static";
import DropzoneComponent from "../Dropzone";
import { useDebouncedValue } from "@mantine/hooks";
import { sendMoneyIndividualValidate } from "@/lib/schema";

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
}

export const sendMoneyIndividualRequest = {
  firstName: "",
  lastName: "",
  destinationIBAN: "",
  destinationBIC: "",
  destinationBank: "",
  bankAddress: "",
  destinationCountry: "",
  amount: "",
  invoice: "",
  narration: "",
};

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
}: IndividualProps) {
  const [processing, setProcessing] = useState(false);
  const [disableBank, setDisableBank] = useState(false);
  const [disableAddress, setDisableAddress] = useState(false);
  const [disableCountry, setDisableCountry] = useState(false);

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

  const handleIbanValidation = async () => {
    setProcessing(true);
    setValidated(null);
    setDisableAddress(false);
    setDisableBank(false);
    setDisableCountry(false);
    setShowBadge(true);
    try {
      const data = await validateAccount({ iban, bic });

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
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (iban && bic) {
      handleIbanValidation();
    }
  }, [bic, iban]);

  const handlePreviewState = () => {
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

    close();
    setRequestForm(form.values);
    setSectionState("Individual");
    openPreview();
  };

  return (
    <>
      <TabsPanel value="To Individual">
        <Box mt={20}>
          <ScrollArea h="calc(100dvh - 500px)" scrollbarSize={3} pr={20}>
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
                {...form.getInputProps("destinationBIC")}
                errorProps={{
                  fz: 12,
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
                    data={countries}
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
    </>
  );
}

export default Individual;
