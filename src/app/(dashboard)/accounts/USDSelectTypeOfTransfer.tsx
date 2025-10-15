import React from "react";
import { Flex, Image, Stack, Text } from "@mantine/core";
import USAIcon from "@/assets/USD.png";
import EarthIcon from "@/assets/earth.png";
import ActiveMobileMoney from "@/assets/active-mm.png";
import USDuseTransferCurrencySwitchStore from "@/lib/store/usd-transfer-currency-type";

const USDSelectTypeOfTransfer = () => {
  const { transferCurrency, setTransferCurrency } =
    USDuseTransferCurrencySwitchStore();

  const handleTransferCurrencyChange = (
    currency: "WithinUSA" | "OutsideUSA"
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
          transferCurrency === "WithinUSA" ? "#C1DD06" : "#EEF0F2"
        }`}
        p={12}
        gap={8}
        w="100%"
        bg={transferCurrency === "WithinUSA" ? "#F2F5DE" : "transparent"}
        onClick={() => handleTransferCurrencyChange("WithinUSA")}
      >
        <Image src={USAIcon.src} alt="Within US" w={32} h={32} />
        <Stack gap={0}>
          <Text fz={14} c="#1D2939">
            Within the US
          </Text>
          <Text fz={12} c="#475467">
            I&apos;m Sending within the US
          </Text>
        </Stack>
      </Flex>

      <Flex
        style={style}
        onClick={() => handleTransferCurrencyChange("OutsideUSA")}
        align="center"
        justify="flex-start"
        bd={`1px solid ${
          transferCurrency === "OutsideUSA" ? "#C1DD06" : "#EEF0F2"
        }`}
        gap={8}
        p={12}
        bg={transferCurrency === "OutsideUSA" ? "#F2F5DE" : "transparent"}
        w="100%"
      >
        <Image src={EarthIcon.src} alt="Outside US" w={32} h={32} />
        <Stack gap={0}>
          <Text fz={14} c="#1D2939">
            Outside the US
          </Text>
          <Text fz={12} c="#475467">
            I&apos;m Sending outside the US
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default USDSelectTypeOfTransfer;
