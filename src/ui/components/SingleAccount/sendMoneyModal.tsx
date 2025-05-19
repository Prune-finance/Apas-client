"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { IconExclamationMark, IconX } from "@tabler/icons-react";
import styles from "./sendMoney.module.scss";
import SendMoneyBanner from "@/assets/sendMoney-new-bg.png";

import {
  Flex,
  Paper,
  ThemeIcon,
  Text,
  Box,
  Stack,
  Group,
  Alert,
  BackgroundImage,
  Skeleton,
} from "@mantine/core";
import { PrimaryBtn } from "../Buttons";
import { formatNumber } from "@/lib/utils";
import { DefaultAccount } from "@/lib/hooks/accounts";
import TabsComponent from "../Tabs";
import Individual from "./Individual";
import Company from "./company";
import CurrencyTab from "../CurrencyTab";
import useCurrencySwitchStore from "@/lib/store/currency-switch";

interface SendMoneyModalProps {
  account: DefaultAccount | null;
  loading?: boolean;
  close: () => void;
  openPreview: () => void;
  setRequestForm: any;
  setCompanyRequestForm: any;
  setSectionState: any;
  openDebtor: () => void;
  paymentType: string;
  setPaymentType: Dispatch<SetStateAction<string>>;
}

function SendMoneyModal({
  account,
  loading,
  close,
  openPreview,
  setRequestForm,
  setCompanyRequestForm,
  setSectionState,
  openDebtor,
  paymentType,
  setPaymentType,
}: SendMoneyModalProps) {
  const [validated, setValidated] = useState<boolean | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const { switchCurrency } = useCurrencySwitchStore();

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
                {`Unfortunately, we couldn't validate your account information.
                Please review the details to ensure it is accurate, or proceed
                without validation. `}
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

        <BackgroundImage
          src={SendMoneyBanner.src}
          h={176}
          style={{ borderRadius: "4px" }}
          mt={32}
        >
          <Flex align="center" justify="center" direction="column" h={"100%"}>
            <Text fz={14} fw={500} c="#667085" mb={0}>
              Account Balance
            </Text>

            {loading ? (
              <Skeleton h={40} w={100} />
            ) : (
              <Text fz={32} fw={600} c="#344054" mt={0} mb={16}>
                {formatNumber(
                  account?.accountBalance ?? 0,
                  true,
                  switchCurrency ?? "EUR"
                )}
              </Text>
            )}

            <CurrencyTab />
          </Flex>
        </BackgroundImage>

        <TabsComponent
          tabs={tabs}
          onChange={() => {
            setValidated(null);
            setShowBadge(false);
          }}
          mt={32}
          keepMounted={false}
        >
          <Individual
            account={account}
            close={close}
            openPreview={openPreview}
            setRequestForm={setRequestForm}
            setSectionState={setSectionState}
            validated={validated}
            setValidated={setValidated}
            showBadge={showBadge}
            setShowBadge={setShowBadge}
            openDebtor={openDebtor}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
          />
          <Company
            account={account}
            close={close}
            openPreview={openPreview}
            setCompanyRequestForm={setCompanyRequestForm}
            setSectionState={setSectionState}
            validated={validated}
            setValidated={setValidated}
            showBadge={showBadge}
            setShowBadge={setShowBadge}
            openDebtor={openDebtor}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
          />
        </TabsComponent>
      </Paper>
    </main>
  );
}

const tabs = [{ value: "To Individual" }, { value: "To A Company" }];

export default SendMoneyModal;
