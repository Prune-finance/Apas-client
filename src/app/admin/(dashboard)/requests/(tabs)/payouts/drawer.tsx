import {
  TransactionType,
  useSingleCompanyTransactions,
  useSingleTransactions,
} from "@/lib/hooks/transactions";
import { formatNumber } from "@/lib/utils";
import {
  Drawer,
  Flex,
  Box,
  Divider,
  Text,
  Stack,
  Group,
  Skeleton,
  ScrollArea,
} from "@mantine/core";
import { IconCheck, IconCircleArrowDown } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import {
  ReceiptDetails,
  TransactionReceipt,
} from "@/ui/components/TransactionReceipt";
import { ReactNode, useRef } from "react";
import { handlePdfDownload } from "@/lib/actions/auth";
import { useSingleUserAccountByIBAN } from "@/lib/hooks/accounts";
import { AmountGroup } from "@/ui/components/AmountGroup";
import Transaction from "@/lib/store/transaction";

interface TransactionDrawerProps {
  selectedRequest: TransactionType | null;
  close: () => void;
  opened: boolean;
  children?: ReactNode;
}

export const PayoutTransactionRequestDrawer = ({
  selectedRequest,
  close,
  opened,
  children,
}: TransactionDrawerProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const { transaction, loading: loadingTransaction } = useSingleTransactions(
    selectedRequest?.id ?? ""
  );

  const {
    transaction: defaultTransaction,
    loading: loadingDefaultTransaction,
  } = useSingleCompanyTransactions(selectedRequest?.id ?? "");

  const { account: senderAccount, loading: loadingSenderAcct } =
    useSingleUserAccountByIBAN(selectedRequest?.senderIban ?? "");

  const businessDetails = {
    "Business Name":
      transaction?.company?.name ?? defaultTransaction?.company?.name ?? "N/A",
    "Account Type": "N/A",
    IBAN: selectedRequest?.recipientIban,
    BIC: selectedRequest?.recipientBic,
  };

  const beneficiaryDetails = {
    "Account Name": selectedRequest?.recipientName || "N/A",
    IBAN: selectedRequest?.recipientIban,
    BIC: selectedRequest?.recipientBic,
    "Bank Name": selectedRequest?.recipientBankAddress,
    // "Bank Address": selectedRequest?.recipientBankAddress,
    Country: selectedRequest?.recipientBankCountry,
    "Transaction Reference": selectedRequest?.reference ?? "N/A",
  };

  const senderDetails = {
    "Account Name": selectedRequest?.senderName,
    IBAN: selectedRequest?.senderIban,
    // BIC: selectedRequest?.senderBic,
    Bank:
      selectedRequest?.type === "DEBIT"
        ? "Prune Payments LTD"
        : "Prune Payments LTD",
    "Bank Address":
      selectedRequest?.type === "DEBIT"
        ? "Office 7 35-37 Ludgate Hill, London"
        : "Office 7 35-37 Ludgate Hill, London",
    Country:
      selectedRequest?.type === "DEBIT" ? "United Kingdom" : "United Kingdom",
  };

  const otherDetails = {
    // "Prune Reference": selectedRequest?.centrolinkRef ?? "N/A",
    "C-L Reference": selectedRequest?.id,
    "Date & Time": dayjs(selectedRequest?.createdAt).format(
      "Do MMMM, YYYY - HH:mma"
    ),
    "Status:": <BadgeComponent status={selectedRequest?.status ?? ""} />,
  };

  const BeneficiaryDetails = {
    "Amount Received": formatNumber(selectedRequest?.amount ?? 0, true, "EUR"),
    // "First Name": selectedRequest?.destinationFirstName ?? "N/A",
    // "Last Name": selectedRequest?.destinationLastName ?? "N/A",
    Name: selectedRequest?.recipientName || "N/A",
    IBAN: selectedRequest?.recipientIban ?? "",
    "Bank Name": selectedRequest?.recipientBankAddress ?? "",
    Country: selectedRequest?.recipientBankCountry ?? "",
    "Bank Address": "N/A",
  };

  const SenderDetails = {
    "Account Name":
      senderAccount?.accountName ?? selectedRequest?.senderName ?? "N/A",
    "Account Number": selectedRequest?.senderIban ?? "",
    "Bank Name": "Prune Payments LTD",
    BIC: "ARPYGB21XXX",
  };

  const OtherDetails = {
    Type: selectedRequest?.type === "DEBIT" ? "Debit" : "Credit",
    "Payment Date": dayjs(selectedRequest?.createdAt).format(
      "hh:mm A Do MMM YYYY"
    ),
    Reference: selectedRequest?.reference ?? "N/A",
    "C-L Reference": selectedRequest?.id ?? "",
  };
  const details: ReceiptDetails[] = [
    {
      title: "Sender Details",
      value: SenderDetails,
    },
    { title: "Beneficiary Details", value: BeneficiaryDetails },
    { title: "Other Details", value: OtherDetails },
  ];

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        close();
        // clearData();
      }}
      position="right"
      title={
        <Text fz={18} fw={600} c="#1D2939" ml={28}>
          Transaction Details
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
      size="30%"
      padding={0}
    >
      <Divider mb={20} />
      <Flex direction="column" pl={28} pb={20} h="calc(100vh - 90px)">
        <ScrollArea
          //   h="calc(100vh - 145px)"
          h="100%"
          scrollbars="y"
          scrollbarSize={1}
          pr={28}
          flex={1}
        >
          <Flex align="center" justify="space-between">
            <Flex direction="column">
              <Text c="var(--prune-text-gray-500)" fz={12}>
                {selectedRequest?.type === "DEBIT"
                  ? "Amount Sent"
                  : "Amount Received"}
              </Text>

              <Text c="#97AD05" fz={32} fw={600}>
                {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
              </Text>
            </Flex>

            {/* <AmountGroup
              type={selectedRequest?.type as "DEBIT" | "CREDIT"}
              colored
              fz={12}
            /> */}
          </Flex>

          <Divider mt={30} mb={20} />

          <Text
            fz={16}
            mb={24}
            tt="uppercase"
            c="var(--prune-text-gray-800)"
            fw={600}
          >
            Sender Details
          </Text>

          <Stack gap={24}>
            {Object.entries(senderDetails).map(([key, value]) => (
              <Group justify="space-between" key={key}>
                <Text fz={12} c="var(--prune-text-gray-500)">
                  {key}:
                </Text>

                <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                  {value}
                </Text>
              </Group>
            ))}
          </Stack>

          <Divider mt={30} mb={20} />

          <Text
            fz={16}
            mb={24}
            tt="uppercase"
            c="var(--prune-text-gray-800)"
            fw={600}
          >
            Beneficiary Details
          </Text>

          <Stack gap={24}>
            {Object.entries(beneficiaryDetails).map(([key, value]) => (
              <Group justify="space-between" key={key}>
                <Text fz={12} c="var(--prune-text-gray-500)">
                  {key}:
                </Text>

                <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                  {value}
                </Text>
              </Group>
            ))}
          </Stack>

          <Divider mt={30} mb={20} />

          <Text
            fz={16}
            mb={24}
            tt="uppercase"
            c="var(--prune-text-gray-800)"
            fw={600}
          >
            Other Details
          </Text>

          <Stack gap={24}>
            {Object.entries(otherDetails).map(([key, value]) => (
              <Group justify="space-between" key={key}>
                <Text fz={12} c="var(--prune-text-gray-500)">
                  {key}:
                </Text>

                <Text fz={12} c="var(--prune-text-gray-700)" fw={600}>
                  {value}
                </Text>
              </Group>
            ))}
          </Stack>

          <Divider mt={30} mb={20} />
        </ScrollArea>

        {children && children}
      </Flex>
    </Drawer>
  );
};
