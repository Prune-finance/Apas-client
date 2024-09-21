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
import {
  IconCircleArrowDown,
  IconReload,
  IconReportSearch,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import styles from "./styles.module.scss";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import {
  ReceiptDetails,
  TransactionReceipt,
} from "@/ui/components/TransactionReceipt";
import { useRef } from "react";
import { handlePdfDownload } from "@/lib/actions/auth";
import { useSingleUserAccountByIBAN } from "@/lib/hooks/accounts";
import { AmountGroup } from "@/ui/components/AmountGroup";
import Transaction from "@/lib/store/transaction";

interface TransactionDrawerProps {
  data: TransactionType | null;
  close: () => void;
  opened: boolean;
}

export const PayoutTransactionDrawer = () => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { data, close, opened, clearData } = Transaction();

  const { transaction, loading: loadingTransaction } = useSingleTransactions(
    data?.id ?? ""
  );

  const {
    transaction: defaultTransaction,
    loading: loadingDefaultTransaction,
  } = useSingleCompanyTransactions(data?.id ?? "");

  const { account: senderAccount, loading: loadingSenderAcct } =
    useSingleUserAccountByIBAN(data?.senderIban ?? "");

  const businessDetails = {
    "Business Name":
      transaction?.company?.name ?? defaultTransaction?.company?.name ?? "N/A",
    "Account Type": "Payout Account",
    IBAN: data?.recipientIban,
    BIC: data?.recipientBic,
  };

  const beneficiaryDetails = {
    "Account Name": data?.recipientName || "N/A",
    IBAN: data?.recipientIban,
    BIC: data?.recipientBic,
    "Bank Name": data?.recipientBankAddress,
    "Bank Address": data?.recipientBankAddress,
    Country: data?.recipientBankCountry,
    "Transaction Reference": data?.reference ?? "N/A",
  };

  const senderDetails = {
    "Account Name": loadingSenderAcct ? (
      <Skeleton h={10} w={100} />
    ) : (
      data?.senderName
    ),
    IBAN: data?.senderIban,
    BIC: data?.senderBic,
    Bank: data?.type === "DEBIT" ? "Prune Payments LTD" : "Prune Payments LTD",
    "Bank Address":
      data?.type === "DEBIT"
        ? "Office 7 35-37 Ludgate Hill, London"
        : "Office 7 35-37 Ludgate Hill, London",
    Country: data?.type === "DEBIT" ? "United Kingdom" : "United Kingdom",
  };

  const otherDetails = {
    "Prune Reference": data?.centrolinkRef ?? "N/A",
    "C-L Reference": data?.id,
    Narration: data?.narration ?? "No Narration",
    "Date & Time": dayjs(data?.createdAt).format("Do MMMM, YYYY - HH:mma"),
    "Status:": <BadgeComponent status={data?.status ?? ""} />,
  };

  const BeneficiaryDetails = {
    "Amount Received": formatNumber(data?.amount ?? 0, true, "EUR"),
    // "First Name": data?.destinationFirstName ?? "N/A",
    // "Last Name": data?.destinationLastName ?? "N/A",
    Name: data?.recipientName || "N/A",
    IBAN: data?.recipientIban ?? "",
    "Bank Name": data?.recipientBankAddress ?? "",
    Country: data?.recipientBankCountry ?? "",
    "Bank Address": "N/A",
  };

  const SenderDetails = {
    "Account Name": senderAccount?.accountName ?? data?.senderName ?? "N/A",
    "Account Number": data?.senderIban ?? "",
    "Bank Name": "Prune Payments LTD",
    BIC: "ARPYGB21XXX",
  };

  const OtherDetails = {
    Type: data?.type === "DEBIT" ? "Debit" : "Credit",
    "Payment Date": dayjs(data?.createdAt).format("hh:mm A Do MMM YYYY"),
    Reference: data?.reference ?? "N/A",
    "C-L Reference": data?.id ?? "",
  };
  const details: ReceiptDetails[] = [
    {
      title: "Sender Details",
      value: SenderDetails,
    },
    { title: "Beneficiary Details", value: BeneficiaryDetails },
    { title: "Other Details", value: OtherDetails },
  ];

  const isAfter24Hours = (createdAt: Date): boolean => {
    // use dayjs
    const now = dayjs();
    const diff = now.diff(dayjs(createdAt), "hour");

    return diff > 24;

    // const now = new Date();
    // const diff = now.getTime() - createdAt.getTime();
    // const hours = Math.floor(diff / (1000 * 60 * 60));
    // return hours > 12;
  };

  console.log(isAfter24Hours(data?.createdAt ?? new Date()));

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
      size="35%"
      //   size="30%"
      padding={0}
    >
      <Divider mb={20} />
      <Box px={28} pb={28}>
        <ScrollArea h="calc(100vh - 145px)" scrollbars="y" scrollbarSize={1}>
          <Flex align="center" justify="space-between">
            <Flex direction="column">
              <Text c="var(--prune-text-gray-500)" fz={12}>
                {data?.type === "DEBIT" ? "Amount Sent" : "Amount Received"}
              </Text>

              <Text c="#97AD05" fz={32} fw={600}>
                {formatNumber(data?.amount || 0, true, "EUR")}
              </Text>
            </Flex>

            <AmountGroup
              type={data?.type as "DEBIT" | "CREDIT"}
              colored
              fz={12}
            />
          </Flex>

          {data?.type === "DEBIT" && (
            <>
              <Divider mt={30} mb={20} />

              <Text
                fz={16}
                mb={24}
                tt="uppercase"
                c="var(--prune-text-gray-800)"
                fw={600}
              >
                Holding Account
              </Text>

              <Stack gap={24}>
                {Object.entries(businessDetails).map(([key, value]) => (
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
            </>
          )}

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

        <Flex wrap="nowrap" gap={10} justify="space-between">
          {data && isAfter24Hours(data?.createdAt) && (
            <>
              <SecondaryBtn text="Query" icon={IconReportSearch} />

              <SecondaryBtn text="Run Trace" icon={IconReportSearch} />

              <SecondaryBtn text="Recall" icon={IconReload} />
            </>
          )}

          {data?.status === "PENDING" ? (
            <PrimaryBtn
              icon={IconX}
              text="Cancel"
              color="#D92D20"
              c="#fff"
              fw={600}
              action={() => handlePdfDownload(pdfRef)}
            />
          ) : (
            <PrimaryBtn
              icon={IconCircleArrowDown}
              text={`Download ${
                !isAfter24Hours(data?.createdAt ?? new Date()) ? "Receipt" : ""
              }`}
              fullWidth={!isAfter24Hours(data?.createdAt ?? new Date())}
              fw={600}
              action={() => handlePdfDownload(pdfRef)}
            />
          )}
        </Flex>
      </Box>

      <Box pos="absolute" left={-9999} bottom={700} w="45vw" m={0} p={0}>
        <TransactionReceipt
          amount={data?.amount ?? 0}
          amountType="Amount Sent"
          details={details}
          receiptRef={pdfRef}
        />
      </Box>
    </Drawer>
  );
};
