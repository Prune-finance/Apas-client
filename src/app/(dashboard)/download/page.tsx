"use client";

import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Paper,
  Stack,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import PruneIcon from "@/assets/icon.png";
import Image from "next/image";
import EUIcon from "@/assets/eu.png";
import { TableComponent } from "@/ui/components/DownloadStatementTable";

const accountDetails = {
  IBAN: "1234567890",
  Country: "Nigeria",
  "Account Name": "1234567890",
};

const inSummary = {
  "Opening Balance": "€0.00",
  "Closing Balance": "€0.00",
  "Money Out": "€0.00",
  "Money In": "€0.00",
};

export const AccountTableHeaders = [
  "Date",
  "Description",
  "Money In",
  "Money Out",
  "Balance",
];

function DownloadStatement() {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Paper withBorder bg="#fff" w="100%">
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
          <Image width={36} height={35} src={PruneIcon} alt="prune icon" />
          <Text fz={20} fw={600} c="#293037">
            Prune Payments
          </Text>
        </Flex>

        <Text fz={20} fw={600} c="#344054">
          Account Statement
        </Text>
      </Flex>

      {/* Account Header Details */}
      <Flex
        w="100%"
        mt={40}
        align="flex-start"
        justify="space-between"
        px={40}
        mb={67}
      >
        <Flex align="flex-start" direction="column" w="100%">
          <Flex align="flex-start" direction="column">
            <Text fz={28} fw={600} mb={12}>
              The Purple Place
            </Text>
            <Text fz={14} c="#475467" fw={500} mb={8}>
              55 Nelson Crescent, Nigeria.
            </Text>
            <Text fz={14} c="#475467" fw={400}>
              22nd August 2024 - 23rd August 2024
            </Text>
          </Flex>

          <Card
            mt={40}
            bg="#F9FAFB"
            px={24}
            py={28}
            w={318}
            h={200}
            radius={12}
          >
            <Flex align="center" justify="flex-start" gap={4} mb={24}>
              <Image width={36} height={35} src={EUIcon} alt="eu-icon" />
              <Text fz={16} fw={600} c="#1D2939">
                EUR Account
              </Text>
            </Flex>

            <Flex
              direction="column"
              align="flex-start"
              justify="space-between"
              gap={20}
            >
              {Object.entries(accountDetails).map(([key, value]) => (
                <Flex align="center" justify="space-between" w="100%">
                  <Text fz={14} c="#475467" fw={500}>
                    {key}
                  </Text>
                  <Text fz={14} c="#475467" fw={400}>
                    {value}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Card>
        </Flex>

        <Flex align="flex-end" direction="column" w="100%" justify="flex-end">
          <Flex align="flex-start" justify="flex-start" gap={4} mb={24} w={318}>
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
                <Flex align="center" justify="space-between" w="100%">
                  <Text fz={14} c="#475467" fw={500}>
                    {key}
                  </Text>
                  <Text fz={14} c="#475467" fw={400}>
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
        <TableComponent
          rows={<AccountTableRow data={AccountData} />}
          loading={loading}
          head={AccountTableHeaders}
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

const AccountTableRow = ({ data }: { data: any }) => {
  return (
    <>
      {data?.map((item: any, index: number) => (
        <TableTr key={index} style={{ cursor: "pointer" }}>
          <TableTd>
            <Stack gap={0}>
              <Text fz={12} fw={400}>
                <Text>Hello</Text>
              </Text>
              <Text fz={10} fw={400}>
                <Text>Hello</Text>
              </Text>
            </Stack>
          </TableTd>

          <TableTd w="15%">
            <Text>Hello</Text>
          </TableTd>

          <TableTd>
            <Text>Hello</Text>
          </TableTd>

          <TableTd>
            <Text>Hello</Text>
          </TableTd>

          <TableTd w="15%">
            <Text>Hello</Text>
          </TableTd>
        </TableTr>
      ))}
    </>
  );
};

const AccountData = [
  {
    date: "2024-10-16",
    description: "Transaction 1",
    moneyIn: "€699.21",
    moneyOut: "€202.77",
    Balance: "€496.44",
  },
  {
    date: "2024-10-15",
    description: "Transaction 2",
    moneyIn: "€156.82",
    moneyOut: "€211.86",
    Balance: "€441.4",
  },
  {
    date: "2024-10-14",
    description: "Transaction 3",
    moneyIn: "€257.68",
    moneyOut: "€66.38",
    Balance: "€632.7",
  },
  {
    date: "2024-10-13",
    description: "Transaction 4",
    moneyIn: "€425.68",
    moneyOut: "€17.12",
    Balance: "€1041.26",
  },
  {
    date: "2024-10-12",
    description: "Transaction 5",
    moneyIn: "€476.43",
    moneyOut: "€19.99",
    Balance: "€1497.7",
  },
  {
    date: "2024-10-11",
    description: "Transaction 6",
    moneyIn: "€744.57",
    moneyOut: "€36.15",
    Balance: "€2206.12",
  },
  {
    date: "2024-10-10",
    description: "Transaction 7",
    moneyIn: "€403.8",
    moneyOut: "€261.81",
    Balance: "€2348.11",
  },
  {
    date: "2024-10-09",
    description: "Transaction 8",
    moneyIn: "€979.72",
    moneyOut: "€182.35",
    Balance: "€3145.48",
  },
  {
    date: "2024-10-08",
    description: "Transaction 9",
    moneyIn: "€747.36",
    moneyOut: "€253.69",
    Balance: "€3639.15",
  },
  {
    date: "2024-10-07",
    description: "Transaction 10",
    moneyIn: "€373.02",
    moneyOut: "€110.86",
    Balance: "€3901.31",
  },
  {
    date: "2024-10-06",
    description: "Transaction 11",
    moneyIn: "€79.43",
    moneyOut: "€175.33",
    Balance: "€3805.41",
  },
  {
    date: "2024-10-05",
    description: "Transaction 12",
    moneyIn: "€223.2",
    moneyOut: "€24.19",
    Balance: "€4004.42",
  },
  {
    date: "2024-10-04",
    description: "Transaction 13",
    moneyIn: "€620.54",
    moneyOut: "€420.31",
    Balance: "€4204.65",
  },
  {
    date: "2024-10-03",
    description: "Transaction 14",
    moneyIn: "€92.86",
    moneyOut: "€471.02",
    Balance: "€3826.49",
  },
  {
    date: "2024-10-02",
    description: "Transaction 15",
    moneyIn: "€131.67",
    moneyOut: "€82.93",
    Balance: "€3875.23",
  },
  {
    date: "2024-10-01",
    description: "Transaction 16",
    moneyIn: "€289.95",
    moneyOut: "€343.27",
    Balance: "€3821.91",
  },
  {
    date: "2024-09-30",
    description: "Transaction 17",
    moneyIn: "€791.27",
    moneyOut: "€253.78",
    Balance: "€4359.4",
  },
  {
    date: "2024-09-29",
    description: "Transaction 18",
    moneyIn: "€389.09",
    moneyOut: "€228.51",
    Balance: "€4519.98",
  },
  {
    date: "2024-09-28",
    description: "Transaction 19",
    moneyIn: "€197.6",
    moneyOut: "€489.73",
    Balance: "€4227.85",
  },
  {
    date: "2024-09-27",
    description: "Transaction 20",
    moneyIn: "€688.37",
    moneyOut: "€60.74",
    Balance: "€4855.48",
  },
  {
    date: "2024-09-26",
    description: "Transaction 21",
    moneyIn: "€394.75",
    moneyOut: "€4.83",
    Balance: "€5245.4",
  },
  {
    date: "2024-09-25",
    description: "Transaction 22",
    moneyIn: "€9.44",
    moneyOut: "€277.07",
    Balance: "€4977.77",
  },
  {
    date: "2024-09-24",
    description: "Transaction 23",
    moneyIn: "€969.46",
    moneyOut: "€150.99",
    Balance: "€5796.24",
  },
  {
    date: "2024-09-23",
    description: "Transaction 24",
    moneyIn: "€951.88",
    moneyOut: "€251.04",
    Balance: "€6497.08",
  },
  {
    date: "2024-09-22",
    description: "Transaction 25",
    moneyIn: "€450.44",
    moneyOut: "€182.74",
    Balance: "€6764.78",
  },
  {
    date: "2024-09-21",
    description: "Transaction 26",
    moneyIn: "€817.29",
    moneyOut: "€314.4",
    Balance: "€7267.67",
  },
  {
    date: "2024-09-20",
    description: "Transaction 27",
    moneyIn: "€404.56",
    moneyOut: "€58.31",
    Balance: "€7613.92",
  },
  {
    date: "2024-09-19",
    description: "Transaction 28",
    moneyIn: "€281.94",
    moneyOut: "€447.6",
    Balance: "€7448.26",
  },
  {
    date: "2024-09-18",
    description: "Transaction 29",
    moneyIn: "€55.76",
    moneyOut: "€340.46",
    Balance: "€7163.56",
  },
  {
    date: "2024-09-17",
    description: "Transaction 30",
    moneyIn: "€111.46",
    moneyOut: "€109.48",
    Balance: "€7165.54",
  },
];

export default DownloadStatement;
