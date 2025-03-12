import { Box, Flex, Modal, Text, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";
import styles from "./sendMoney.module.scss";
import { DefaultAccount } from "@/lib/hooks/accounts";
import TabsComponent from "../Tabs";
import DebtorModalIndividual from "./DebtorModalIndividual";
import DebtorModalCompany from "./DebtorModalCompany";
import DebtorModalForm from "./DebtorModalForm";
import { RequestForm } from "./(tabs)/SendMoney";

interface DebtorModal {
  openedDebtor: boolean;
  closeDebtor: () => void;
  openPreview: () => void;
  openDebtor: () => void;
  openSendMoney: () => void;
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
}

function DebtorModal({
  openedDebtor,
  closeDebtor,
  openPreview,
  openSendMoney,
  paymentType,
  setPaymentType,
}: DebtorModal) {
  const [validated, setValidated] = useState<boolean | null>(null);
  const [showBadge, setShowBadge] = useState(false);

  const handlePreviewState = () => {
    closeDebtor();
    openPreview();
  };

  return (
    <Modal
      opened={openedDebtor}
      onClose={() => {
        closeDebtor();
      }}
      size={630}
      centered
      withCloseButton={false}
    >
      <Box
        h={
          paymentType === "individual"
            ? "calc(100dvh - 300px)"
            : "calc(100dvh - 250px)"
        }
        px={30}
        pb={10}
      >
        <Flex gap={10} align="center" justify="space-between" w="100%">
          <Text
            className={styles.form__container__hdrText}
            fz={24}
            fw={600}
            c="#1d2939"
          >
            Ultimate Debtor Details
            <Text
              className={styles.form__container__hdrText}
              fz={14}
              fw={500}
              c="#1d2939"
            >
              Below contains your information as the ultimate debtor
            </Text>
          </Text>

          <Flex
            bg="#f9f9f9"
            align="center"
            justify="center"
            w={32}
            h={32}
            style={{ borderRadius: "100%", cursor: "pointer" }}
          >
            <IconX
              color="#344054"
              size={16}
              onClick={() => {
                closeDebtor();
              }}
            />
          </Flex>
        </Flex>

        {paymentType === "individual" ? (
          <DebtorModalForm
            closeDebtor={closeDebtor}
            openSendMoney={openSendMoney}
            handlePreviewState={handlePreviewState}
          />
        ) : (
          <>
            <TabsComponent
              tabs={tabs}
              onChange={() => {
                setValidated(null);
                setShowBadge(false);
              }}
              mt={32}
              keepMounted={false}
            >
              <DebtorModalIndividual
                closeDebtor={closeDebtor}
                openSendMoney={openSendMoney}
                handlePreviewState={handlePreviewState}
              />
              <DebtorModalCompany
                closeDebtor={closeDebtor}
                openSendMoney={openSendMoney}
                handlePreviewState={handlePreviewState}
              />
            </TabsComponent>
          </>
        )}
      </Box>
    </Modal>
  );
}

const tabs = [{ value: "To Individual" }, { value: "To A Company" }];

export default DebtorModal;
