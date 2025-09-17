import React from "react";
import { Box, Flex, Image, Stack, Text } from "@mantine/core";
import UnActiveMobileMoney from "@/assets/un-active-mm.png";
import UnActiveBankTransfer from "@/assets/un-active-bt.png";
import ActiveBankTransfer from "@/assets/active-bt.png";
import ActiveMobileMoney from "@/assets/active-mm.png";
import useTransferCurrencySwitchStore from "@/lib/store/transfer-currency-type";

const SelectTypeOfTransfer = () => {
  const { transferCurrency, setTransferCurrency } =
    useTransferCurrencySwitchStore();

  const handleTransferCurrencyChange = (
    currency: "BankTransfer" | "MobileMoney"
  ) => {
    setTransferCurrency(currency);
  };

  const style = {
    borderRadius: 8,
    cursor: "pointer",
  };

  return (
    <Flex align="center" justify="space-between" gap={16} mb={20}>
      <Flex
        style={style}
        align="center"
        justify="flex-start"
        bd={`1px solid ${
          transferCurrency === "BankTransfer" ? "#C1DD06" : "#EEF0F2"
        }`}
        p={12}
        gap={8}
        w="100%"
        bg={transferCurrency === "BankTransfer" ? "#F2F5DE" : "transparent"}
        onClick={() => handleTransferCurrencyChange("BankTransfer")}
      >
        <Image
          src={
            transferCurrency === "BankTransfer"
              ? ActiveBankTransfer.src
              : UnActiveBankTransfer.src
          }
          alt="Active Mobile Money"
          w={32}
          h={32}
        />
        <Stack gap={0}>
          <Text fz={14} c="#1D2939">
            Bank Transfer
          </Text>
          <Text fz={12} c="#475467">
            Send Directly to bank account
          </Text>
        </Stack>
      </Flex>

      <Flex
        style={style}
        onClick={() => handleTransferCurrencyChange("MobileMoney")}
        align="center"
        justify="flex-start"
        bd={`1px solid ${
          transferCurrency === "MobileMoney" ? "#C1DD06" : "#EEF0F2"
        }`}
        gap={8}
        p={12}
        bg={transferCurrency === "MobileMoney" ? "#F2F5DE" : "transparent"}
        w="100%"
      >
        <Image
          src={
            transferCurrency === "MobileMoney"
              ? ActiveMobileMoney.src
              : UnActiveMobileMoney.src
          }
          alt="Active Mobile Money"
          w={32}
          h={32}
        />
        <Stack gap={0}>
          <Text fz={14} c="#1D2939">
            Bank Transfer
          </Text>
          <Text fz={12} c="#475467">
            Send Directly to bank account
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default SelectTypeOfTransfer;
