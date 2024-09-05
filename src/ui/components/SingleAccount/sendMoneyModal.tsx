"use client";
import Cookies from "js-cookie";

import axios from "axios";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconPlus, IconX } from "@tabler/icons-react";

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
} from "@mantine/core";
import { TextInput, Select, Button, UnstyledButton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import { formatNumber } from "@/lib/utils";
import { DefaultAccount } from "@/lib/hooks/accounts";
import DropzoneComponent from "../Modal/dropzone";
import TabsComponent from "../Tabs";
import Individual from "./Individual";
import Company from "./company";

interface SendMoneyModalProps {
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

function SendMoneyModal({ account, close }: SendMoneyModalProps) {
  const form = useForm({
    initialValues: {
      ...sendMoneyRequest,
    },
  });

  return (
    <main className={styles.main}>
      <Paper className={styles.form__container} px={30} pt={0} pb={10}>
        <Flex gap={10} align="center" justify="space-between" w="100%">
          <Text
            className={styles.form__container__hdrText}
            fz={24}
            fw={600}
            c="#1d2939"
          >
            Send Money
          </Text>

          <Flex
            bg="#f9f9f9"
            align="center"
            justify="center"
            w={32}
            h={32}
            style={{ borderRadius: "100%", cursor: "pointer" }}
          >
            <IconX color="#344054" size={16} onClick={close} />
          </Flex>
        </Flex>
        <Box h={111} bg="#fafafa" style={{ borderRadius: "4px" }} mt={32}>
          <Flex align="center" justify="center" direction="column" h={"100%"}>
            <Text fz={14} fw={500} c="#667085" mb={0}>
              Account Balance
            </Text>
            <Text fz={32} fw={600} c="#344054" mt={0}>
              {formatNumber(account?.accountBalance ?? 0, true, "EUR")}
            </Text>
          </Flex>
        </Box>

        <TabsComponent tabs={tabs} mt={32}>
          <Individual account={account} close={close} />
          <Company account={account} close={close} />
        </TabsComponent>
      </Paper>
    </main>
  );
}

const tabs = [{ value: "To Individual" }, { value: "To A Company" }];

export default SendMoneyModal;
