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
import DropzoneComponent from "../Modal/dropzone";
import TabsComponent from "../Tabs";

interface CompanyProps {
  account: DefaultAccount | null;
  close: () => void;
}

export const sendMoneyRequest = {
  account: "",
  amount: "",
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

function Company({ account, close }: CompanyProps) {
  const form = useForm({
    initialValues: {
      ...sendMoneyRequest,
    },
  });

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
          />
        </Flex>

        <Flex gap={20} mt={24} direction="column">
          <Text fz={14} c="#667085" m={0} p={0}>
            Upload Invoice (Optional)
          </Text>
          <DropzoneComponent style={{ flex: 1 }} />
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
            // action={createDebitRequest}
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
