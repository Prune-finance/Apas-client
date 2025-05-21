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
import { IconCircleArrowDown } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import styles from "./styles.module.scss";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import {
  ReceiptDetails,
  TransactionReceipt,
} from "@/ui/components/TransactionReceipt";
import { useRef } from "react";
import { handlePdfDownload } from "@/lib/actions/auth";
import { AccountData, useSingleUserAccountByIBAN } from "@/lib/hooks/accounts";
import { AmountGroup } from "@/ui/components/AmountGroup";
import Transaction from "@/lib/store/transaction";
import { useReceipt } from "@/lib/hooks/receipt";

interface TransactionDrawerProps {
  selectedRequest: TransactionType | null;
  close: () => void;
  opened: boolean;
}

export const TransactionDrawer = ({
  selectedRequest,
  close,
  opened,
}: TransactionDrawerProps) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const { transaction, loading: loadingTransaction } = useSingleTransactions(
    selectedRequest?.id ?? ""
  );

  const { clearData } = Transaction();

  const {
    transaction: defaultTransaction,
    loading: loadingDefaultTransaction,
  } = useSingleCompanyTransactions(selectedRequest?.id ?? "");

  const { account: senderAccount, loading: loadingSenderAcct } =
    useSingleUserAccountByIBAN(selectedRequest?.senderIban ?? "");

  const { details } = useReceipt({
    selectedRequest,
    senderAccount: senderAccount as unknown as AccountData,
  });

  const businessDetails = {
    "Business Name":
      transaction?.company?.name ?? defaultTransaction?.company?.name ?? "N/A",
    "Account Type": "N/A",
    IBAN: selectedRequest?.recipientIban,
    BIC: selectedRequest?.recipientBic,
  };

  const beneficiaryDetails = {
    "Account Name":
      selectedRequest?.recipientName ??
      selectedRequest?.beneficiaryName ??
      "N/A",
    ...(selectedRequest?.currencyType === "GBP"
      ? {
          "Account Number": selectedRequest?.beneficiaryAccountNumber,
          "Sort Code": selectedRequest?.beneficiarySortCode,
        }
      : {
          IBAN: selectedRequest?.recipientIban,
          BIC: selectedRequest?.recipientBic,
        }),
    "Bank Name":
      selectedRequest?.recipientBankAddress ??
      selectedRequest?.beneficiaryInstitutionName ??
      "N/A",
    "Bank Address":
      selectedRequest?.recipientBankAddress ??
      selectedRequest?.beneficiaryAddress ??
      "N/A",
    Country: selectedRequest?.recipientBankCountry ?? "N/A",
    "Transaction Reference": selectedRequest?.reference ?? "N/A",
  };

  const senderDetails = {
    "Account Name": loadingSenderAcct ? (
      <Skeleton h={10} w={100} />
    ) : (
      selectedRequest?.senderName
    ),
    ...(selectedRequest?.currencyType === "GBP"
      ? {
          "Account Number": selectedRequest?.senderAccountNumber ?? "N/A",
          "Sort Code": selectedRequest?.senderSortCode ?? "N/A",
        }
      : {
          IBAN: selectedRequest?.recipientIban,
          BIC: selectedRequest?.recipientBic,
        }),
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
    "Prune Reference": selectedRequest?.centrolinkRef ?? "N/A",
    "C-L Reference": selectedRequest?.id,
    "Date & Time": dayjs(selectedRequest?.createdAt).format(
      "Do MMMM, YYYY - HH:mma"
    ),
    "Status:": <BadgeComponent status={selectedRequest?.status ?? ""} />,
  };

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
          // h="calc(100vh - 145px)"
          h="100%"
          flex={1}
          scrollbars="y"
          scrollbarSize={1}
          pr={28}
        >
          <Flex align="center" justify="space-between">
            <Flex direction="column">
              <Text c="var(--prune-text-gray-500)" fz={12}>
                {selectedRequest?.type === "DEBIT"
                  ? "Amount Sent"
                  : "Amount Received"}
              </Text>

              <Text c="#97AD05" fz={32} fw={600}>
                {formatNumber(
                  selectedRequest?.amount || 0,
                  true,
                  selectedRequest?.currencyType ?? "EUR"
                )}
              </Text>
            </Flex>

            <AmountGroup
              type={selectedRequest?.type as "DEBIT" | "CREDIT"}
              colored
              fz={12}
            />
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

        <Box mr={28}>
          <PrimaryBtn
            icon={IconCircleArrowDown}
            text="Download Receipt"
            fullWidth
            fw={600}
            action={() => handlePdfDownload(pdfRef)}
            mt={20}
          />
        </Box>
      </Flex>

      <Box pos="absolute" left={-9999} bottom={700} w="45vw" m={0} p={0}>
        <TransactionReceipt
          amount={selectedRequest?.amount ?? 0}
          amountType={
            selectedRequest?.type === "DEBIT"
              ? "Amount Sent"
              : "Amount Received"
          }
          details={details}
          receiptRef={pdfRef}
        />
      </Box>
    </Drawer>
  );
};
