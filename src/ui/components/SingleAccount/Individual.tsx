"use client";
import Cookies from "js-cookie";

import axios from "axios";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";

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
  Modal,
} from "@mantine/core";
import { TextInput, Select, Button, UnstyledButton } from "@mantine/core";
import { useForm, UseFormReturnType, zodResolver } from "@mantine/form";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import { formatNumber } from "@/lib/utils";
import { DefaultAccount } from "@/lib/hooks/accounts";
import TabsComponent from "../Tabs";
import useNotification from "@/lib/hooks/notification";
import { countries } from "@/lib/static";
import DropzoneComponent from "../Dropzone";
import { parseError } from "@/lib/actions/auth";
import { useDisclosure, useTimeout } from "@mantine/hooks";
import { set } from "zod";
import { sendMoneyIndividualValidate } from "@/lib/schema";
import { FaZ } from "react-icons/fa6";

interface IndividualProps {
  account: DefaultAccount | null;
  close: () => void;
  openPreview: () => void;
  setRequestForm: any;
  setSectionState: any;
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
}: IndividualProps) {
  const form = useForm({
    initialValues: {
      ...sendMoneyIndividualRequest,
    },
    validate: zodResolver(sendMoneyIndividualValidate),
  });

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
                  {Number(form.values.amount) > Number(account?.accountBalance)
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
                    Number(form.values.amount) > Number(account?.accountBalance)
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
