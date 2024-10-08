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
} from "@mantine/core";
import { TextInput, Select, Button, UnstyledButton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import { formatNumber } from "@/lib/utils";
import { DefaultAccount } from "@/lib/hooks/accounts";
import DropzoneComponent from "../Dropzone";
import TabsComponent from "../Tabs";
import { sendMoneyCompanyValidate } from "@/lib/schema";
import { countries } from "@/lib/static";

interface CompanyProps {
  account: DefaultAccount | null;
  close: () => void;
  setCompanyRequestForm: any;
  openPreview: () => void;
  setSectionState: any;
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
}: CompanyProps) {
  const form2 = useForm({
    initialValues: {
      ...sendMoneyRequest,
    },
    validate: zodResolver(sendMoneyCompanyValidate),
  });

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

  return (
    <TabsPanel value="To A Company">
      <Box mt={20}>
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
            {...form2.getInputProps("destinationCountry")}
          />
        </Flex>

        <Flex gap={20} mt={24}>
          <NumberInput
            flex={1}
            classNames={{ input: styles.input, label: styles.label }}
            description={
              <Text fz={12}>
                {Number(form2.values.amount) > Number(account?.accountBalance)
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
                  Number(form2.values.amount) > Number(account?.accountBalance)
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
