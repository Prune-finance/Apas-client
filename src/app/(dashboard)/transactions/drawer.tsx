import { TransactionType, TrxData } from "@/lib/hooks/transactions";
import { formatNumber } from "@/lib/utils";
import {
  Drawer,
  Flex,
  Box,
  Divider,
  Text,
  Badge,
  Stack,
  Group,
  Skeleton,
} from "@mantine/core";
import {
  IconX,
  IconArrowUpRight,
  IconPointFilled,
  IconCircleArrowDown,
} from "@tabler/icons-react";
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
import { useSingleUserAccountByIBAN } from "@/lib/hooks/accounts";
import { send } from "process";

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
  console.log(selectedRequest);
  const pdfRef = useRef<HTMLDivElement>(null);

  const { account: senderAccount, loading: loadingSenderAcct } =
    useSingleUserAccountByIBAN(selectedRequest?.senderIban ?? "");

  const beneficiaryDetails = {
    "Account Name": selectedRequest?.recipientName || "N/A",
    IBAN: selectedRequest?.recipientIban,
    BIC: selectedRequest?.recipientBic,
    "Bank Name": selectedRequest?.recipientBankAddress,
    "Bank Address": "N/A",
    Country: selectedRequest?.recipientBankCountry,
  };

  const senderDetails = {
    "Account Name": loadingSenderAcct ? (
      <Skeleton h={10} w={100} />
    ) : (
      senderAccount?.accountName ?? "N/A"
    ),
    IBAN: selectedRequest?.senderIban,
    BIC: "ARPYGB21XXX",
  };

  const otherDetails = {
    "Alert Type": (
      <Badge
        leftSection={<IconArrowUpRight size={14} />}
        color="var(--prune-warning)"
        variant="transparent"
        tt="capitalize"
      >
        Debit
      </Badge>
    ),
    "Date and Time": dayjs(selectedRequest?.createdAt).format(
      "Do MMMM, YYYY - HH:mma"
    ),
    "Transaction ID": selectedRequest?.id,
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
    "Account Name": senderAccount?.accountName ?? "N/A",
    "Account Number": selectedRequest?.senderIban ?? "",
    "Bank Name": "Prune Payments LTD",
    BIC: "ARPYGB21XXX",
  };

  const OtherDetails = {
    Type: "Debit",
    "Payment Date": dayjs(selectedRequest?.createdAt).format(
      "hh:mm A Do MMM YYYY"
    ),
    Reference: selectedRequest?.reference ?? "N/A",
    "Transaction ID": selectedRequest?.id ?? "",
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
      onClose={close}
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
      <Box px={28} pb={28}>
        <Flex direction="column">
          <Text c="#8B8B8B" fz={12}>
            Amount Sent
          </Text>

          <Text c="#97AD05" fz={32} fw={600}>
            {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
          </Text>
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

        <PrimaryBtn
          icon={IconCircleArrowDown}
          text="Download Receipt"
          fullWidth
          fw={600}
          action={() => handlePdfDownload(pdfRef)}
        />
      </Box>

      <Box pos="absolute" left={-9999} bottom={700} w="45vw" m={0} p={0}>
        <TransactionReceipt
          amount={selectedRequest?.amount ?? 0}
          amountType="Amount Sent"
          details={details}
          receiptRef={pdfRef}
        />
      </Box>
    </Drawer>
  );
};
