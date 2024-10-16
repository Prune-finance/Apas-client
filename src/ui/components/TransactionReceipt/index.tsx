import {
  Container,
  Group,
  Text,
  Paper,
  Box,
  BackgroundImage,
  Stack,
  Divider,
  Flex,
  Image,
} from "@mantine/core";

import PruneIcon from "@/assets/icon.png";
import ReceiptIcon from "@/assets/receipt-bg.svg";
import { formatNumber } from "@/lib/utils";

import { Fragment, ReactNode, RefObject } from "react";

export interface ReceiptDetails {
  title: string;
  value: Record<string, string | ReactNode>;
}

interface Props {
  amount: number;
  amountType: string;
  details: ReceiptDetails[];
  receiptRef: RefObject<HTMLDivElement>;
}

export const TransactionReceipt = ({
  amount,
  amountType,
  details,
  receiptRef,
}: Props) => {
  return (
    <Paper withBorder ref={receiptRef} bg="#fff" w="100%">
      <Group h={40} bg="#fbfee6" justify="space-between" px={32} w="100%">
        <Image w={29} h={29} src={PruneIcon.src} alt="prune icon" />

        <Text c="var(--prune-text-gray-900)" fw={900} fz={12}>
          Trade Summary
        </Text>
      </Group>
      <Paper shadow="md" pb={10} w="100%">
        <Box py={32} px={69}>
          <BackgroundImage
            src={ReceiptIcon.src}
            h={95}
            bgsz="cover"
            bgr={"no-repeat"}
            radius={0}
          >
            <Stack justify="center" align="center" gap={0} h="100%">
              <Text c="var(--prune-text-gray-700)" fw={400} fz={14}>
                {amountType}
              </Text>
              <Text c="var(--prune-text-gray-800)" fw={900} fz={28}>
                {formatNumber(amount, true, "EUR")}
              </Text>
            </Stack>
          </BackgroundImage>

          {details.map(({ title, value }, index) => (
            <Fragment key={title}>
              <Text
                fz={10}
                mt={44}
                tt="uppercase"
                c="var(--prune-text-gray-800)"
                fw={600}
              >
                {title}
              </Text>
              <Divider mb={16} mt={8} />

              <Flex direction="column" gap={16}>
                {Object.entries(value).map(([key, value]) => (
                  <Flex justify="space-between" key={key}>
                    <Text fz={10} c="var(--prune-text-gray-600)">
                      {`${key}:`}
                    </Text>

                    <Text fz={10} c="var(--prune-text-gray-800)" fw={600}>
                      {value}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Fragment>
          ))}
        </Box>

        <Text px={32} fz={7} c="var(--prune-text-gray-600)" my={20}>
          Prune Payments Ltd is an Authorised Payment Institution, authorised by
          the Financial Conduct Authority under the Payment Service Regulations
          2017 (670226) and a licensed money transmitter registered with HM
          Revenue & Customs (XBML00000150442). Incorporated in England and Wales
          in 2011 (company number 07762021). Registered address: 35-37 Ludgate
          Hill, Office 7, London, EC4M 7JN, United Kingdom.
        </Text>
      </Paper>
    </Paper>
  );
};
