import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Image,
  Paper,
  Stack,
  Table,
  TableData,
  TableTbody,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";
import React, { RefObject, useState } from "react";
import PruneIcon from "@/assets/icon.png";
import EUIcon from "@/assets/eu.png";
import { TableComponent } from "@/ui/components/DownloadStatementTable";
import {
  DownloadStatementData,
  downloadStatementMeta,
} from "../SingleAccount/(tabs)/Transactions";
import { formatNumber } from "@/lib/utils";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import GBP from "@/assets/GB.png";

dayjs.extend(advancedFormat);

export const AccountTableHeaders = [
  "Date",
  "Description",
  "Money In",
  "Money Out",
  "Balance",
];

interface Props {
  receiptRef?: RefObject<HTMLDivElement>;
  data?: DownloadStatementData[];
  meta?: downloadStatementMeta | null;
  currencyType?: string;
}

function DownloadStatement({ receiptRef, data, meta, currencyType }: Props) {
  const accountDetails = {
    ...(currencyType === "EUR"
      ? {
          IBAN: meta?.accountDetails?.iban ?? "N/A",
        }
      : {
          "Account Number": meta?.accountDetails?.iban ?? "N/A",
        }),

    ...(currencyType === "GBP"
      ? {
          "Sort Code": meta?.accountDetails?.sortCode,
        }
      : {}),

    Country: meta?.accountDetails?.country ?? "N/A",
    "Account Name": meta?.accountDetails?.accountName ?? "N/A",
  };

  const inSummary = {
    "Opening Balance": formatNumber(
      meta?.summary?.openingBalance?.balance ?? 0,
      true,
      currencyType ?? "EUR"
    ),
    "Money Out": formatNumber(meta?.out ?? 0, true, currencyType ?? "EUR"),
    "Money In": formatNumber(meta?.in ?? 0, true, currencyType ?? "EUR"),
    "Closing Balance": formatNumber(
      meta?.summary?.closingBalance?.balance ?? 0,
      true,
      currencyType ?? "EUR"
    ),
  };

  const [startDate, endDate] = meta?.summary?.range
    ? meta.summary.range.split(" - ").map((date) => dayjs(date))
    : [dayjs(), dayjs()];

  return (
    <Paper withBorder bg="#fff" w="100%" ref={receiptRef}>
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        h={100}
        py={38}
        px={40}
        bg="#FBFEE6"
      >
        <Flex align="center" justify="flex-start" gap={4}>
          <Box h={35} w={36}>
            <Image
              width={36}
              height={35}
              src={PruneIcon.src}
              alt="prune icon"
              fit="contain"
            />
          </Box>
          <Text fz={20} fw={600} c="#293037">
            Prune Payments
          </Text>
        </Flex>

        <Text fz={20} fw={600} c="#344054">
          Account Statement
        </Text>
      </Flex>

      {/* Account Header Details */}
      <Flex w="100%" mt={40} align="flex-start" justify="space-between" px={40}>
        <Flex align="flex-start" direction="column" w="100%">
          <Flex align="flex-start" direction="column">
            <Text fz={28} fw={600} mb={4}>
              {meta?.accountDetails?.accountName ?? "N/A"}
            </Text>
            {meta?.summary?.address && (
              <Text fz={12} c="#475467" fw={500} mb={8}>
                {meta?.summary?.address ?? ""}
              </Text>
            )}
            <Text fz={12} c="#475467" fw={400}>
              {startDate.format("Do MMMM YYYY")} -
              {endDate.format("Do MMMM YYYY")}
            </Text>
          </Flex>

          <Card
            mt={40}
            bg="#F9FAFB"
            px={24}
            py={28}
            w={318}
            h={240}
            radius={12}
          >
            <Flex align="center" justify="flex-start" gap={4} mb={24}>
              <Box h={35} w={36}>
                <Image
                  width={36}
                  height={35}
                  src={currencyType === "EUR" ? EUIcon.src : GBP.src}
                  alt="eu-icon"
                  fit="contain"
                />
              </Box>
              <Text fz={16} fw={600} c="#1D2939">
                {currencyType === "EUR" ? "EUR" : "GBP"} Account
              </Text>
            </Flex>

            <Flex
              direction="column"
              align="flex-start"
              justify="space-between"
              gap={20}
            >
              {Object.entries(accountDetails).map(([key, value]) => (
                <Flex align="center" justify="space-between" w="100%" key={key}>
                  <Text fz={12} c="#475467" fw={500}>
                    {key}
                  </Text>
                  <Text fz={12} c="#475467" fw={400}>
                    {value}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Card>
        </Flex>

        <Flex align="flex-end" direction="column" w="100%" justify="flex-end">
          <Flex align="flex-start" justify="flex-start" gap={4} mb={14} w={318}>
            <Text fz={16} fw={600} c="#1D2939" ta="left">
              In Summary
            </Text>
          </Flex>

          <Card bg="#FBFEE6" px={24} py={28} w={318} radius={12} h={180}>
            <Flex
              direction="column"
              align="flex-start"
              justify="space-between"
              gap={20}
            >
              {Object.entries(inSummary).map(([key, value]) => (
                <Flex align="center" justify="space-between" w="100%" key={key}>
                  <Text fz={12} c="#475467" fw={500}>
                    {key}
                  </Text>
                  <Text fz={12} c="#475467" fw={400}>
                    {value}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Card>
        </Flex>
      </Flex>

      {/* Account table */}
      <Box px={40}>
        <Table
          layout="fixed"
          mt={38}
          fz={12}
          styles={{
            thead: {
              backgroundColor: "#000",
              color: "#fff",
              minWidth: "100%",
              width: "100%",
            },
            tbody: { width: "100%", minWidth: "100%" },
          }}
          data={{
            head: AccountTableHeaders,
            body: data?.map((item) => [
              dayjs(item?.createdAt).format("Do MMMM YYYY"),
              item?.description ?? item?.ref ?? "-",
              item?.type === "CREDIT"
                ? formatNumber(item?.amount ?? 0, true, currencyType ?? "EUR")
                : formatNumber(0, true, currencyType ?? "EUR"),
              item?.type === "DEBIT"
                ? formatNumber(item?.amount ?? 0, true, currencyType ?? "EUR")
                : formatNumber(0, true, currencyType ?? "EUR"),
              item?.balance
                ? formatNumber(item?.balance, true, currencyType ?? "EUR")
                : formatNumber(0, true, currencyType ?? "EUR"),
            ]),
          }}
          w="100%"
        />
      </Box>

      {/* Footer */}
      <Flex align="center" justify="center" w="100%" py={38} px={40}>
        <Text fz={10} fw={400} c="#667085" ta="center">
          Prune Payments Ltd is an Authorised Payment Institution, authorised by
          the Financial Conduct Authority under the Payment Service Regulations
          2017 (670226) and a licensed money transmitter registered with HM
          Revenue & Customs (XBML00000150442). Incorporated in England and Wales
          in 2011 (company number 07762021). Registered address: 35-37 Ludgate
          Hill, Office 7, London, EC4M 7JN, United Kingdom.
        </Text>
      </Flex>
    </Paper>
  );
}

export default DownloadStatement;
