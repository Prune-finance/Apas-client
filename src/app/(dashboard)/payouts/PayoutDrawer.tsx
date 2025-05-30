"use client";

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
  Alert,
} from "@mantine/core";
import {
  IconCircleArrowDown,
  IconClockHour4,
  IconInfoCircleFilled,
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
import { useMemo, useRef, useState } from "react";
import { handlePdfDownload, parseError } from "@/lib/actions/auth";
import { AccountData, useSingleUserAccountByIBAN } from "@/lib/hooks/accounts";
import { AmountGroup } from "@/ui/components/AmountGroup";
import Transaction from "@/lib/store/transaction";
import { InquiryModal } from "./InquiryModal";
import { useDisclosure } from "@mantine/hooks";
import ModalComponent from "@/ui/components/Modal";
import useNotification from "@/lib/hooks/notification";
import { notifications } from "@mantine/notifications";
import createAxiosInstance from "@/lib/axios";
import { useReceipt } from "@/lib/hooks/receipt";

interface TransactionDrawerProps {
  revalidate?: () => void;
}

interface PayoutTransactionDrawer {
  isAdmin?: boolean;
  revalidate?: () => void;
}
export const PayoutTransactionDrawer = ({
  revalidate,
  isAdmin,
}: PayoutTransactionDrawer) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { data, close, opened, setData } = Transaction();
  const [openedModal, { open, close: closeModal }] = useDisclosure(false);
  const [openedCancel, { open: openCancel, close: closeCancel }] =
    useDisclosure(false);
  const axios = createAxiosInstance("payouts");
  const stage =
    typeof window !== "undefined" ? window.localStorage.getItem("stage") : "";

  const [inquiryType, setInquiryType] = useState<
    "recall" | "query" | "trace"
  >();
  const [cancelReason, setCancelReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const { handleError, handleSuccess, handleInfo } = useNotification();

  const { transaction, loading: loadingTransaction } = useSingleTransactions(
    data?.id ?? ""
  );

  const {
    transaction: defaultTransaction,
    loading: loadingDefaultTransaction,
  } = useSingleCompanyTransactions(data?.id ?? "");

  const { account: senderAccount, loading: loadingSenderAcct } =
    useSingleUserAccountByIBAN(data?.senderIban ?? "");

  const { details } = useReceipt({
    selectedRequest: data,
    senderAccount: senderAccount as unknown as AccountData,
  });

  const businessDetails = {
    "Business Name":
      transaction?.company?.name ?? defaultTransaction?.company?.name ?? "N/A",
    "Account Type": "Payout Account",
    IBAN: data?.recipientIban,
    BIC: "ARPYGB21XXX",
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

  const isAfter24Hours = (createdAt: Date): boolean => {
    // use dayjs
    const now = dayjs();
    const diff = now.diff(dayjs(createdAt), "hour");

    return diff > 24;
  };

  const handleCancel = async () => {
    notifications.clean();
    if (!cancelReason)
      return handleInfo(
        "Payout Transaction Cancellation Failed",
        "Please enter a reason for cancelling this payout transaction."
      );
    setProcessing(true);
    try {
      const { data: res } = await axios.patch(
        `/payout/transactions/${data?.id}/cancel`,
        { reason: cancelReason }
      );

      revalidate && revalidate();

      handleSuccess(
        "Payout Transaction Cancelled",
        "You have successfully cancelled the transaction."
      );

      setData(res.data);
      closeCancel();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const { hasQuery, hasTrace, hasRecall } = useMemo(() => {
    const hasQuery = Boolean(
      data?.Inquiries?.find((inq) => inq.type === "QUERY")
    );
    const hasTrace = Boolean(
      data?.Inquiries?.find((inq) => inq.type === "TRACE")
    );
    const hasRecall = Boolean(
      data?.Inquiries?.find((inq) => inq.type === "RECALL")
    );

    return { hasQuery, hasTrace, hasRecall };
  }, [data?.Inquiries]);

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
      <Flex direction="column" pl={28} pb={20} h="calc(100vh - 90px)">
        <ScrollArea
          // h="calc(100vh - 145px)"
          h="100%"
          flex={1}
          scrollbars="y"
          scrollbarSize={1}
          pr={28}
        >
          {data?.status === "CANCELLED" && (
            <Alert
              title="This transaction has been  cancelled. The money has been reverted"
              icon={<IconInfoCircleFilled />}
              color="#D92D20"
              variant="light"
              mb={28}
              radius={8}
              styles={{ title: { fontSize: "12px" } }}
              style={{ border: "1px solid #d92d20" }}
            ></Alert>
          )}
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

        {/* {data &&
              (isAfter24Hours(data?.createdAt) ||
                data.status === "PENDING") && (
                <></> */}

        {!isAdmin && stage === "LIVE" && (
          <Flex wrap="nowrap" gap={10} justify="space-between" mt={20} mr={28}>
            {data && data.status === "CONFIRMED" && (
              <>
                <SecondaryBtn
                  text="Query"
                  icon={hasQuery ? IconClockHour4 : IconReportSearch}
                  action={() => {
                    setInquiryType("query");
                    open();
                  }}
                  disabled={hasQuery}
                />

                <SecondaryBtn
                  text="Run Trace"
                  icon={hasTrace ? IconClockHour4 : IconReportSearch}
                  action={() => {
                    setInquiryType("trace");
                    open();
                  }}
                  disabled={hasTrace}
                />

                <SecondaryBtn
                  text="Recall"
                  icon={hasRecall ? IconClockHour4 : IconReload}
                  action={() => {
                    setInquiryType("recall");
                    open();
                  }}
                  disabled={hasRecall}
                />
              </>
            )}

            {data?.status === "PENDING" ? (
              <PrimaryBtn
                icon={IconX}
                text="Cancel"
                color="#D92D20"
                c="#fff"
                fw={600}
                fullWidth
                action={openCancel}
              />
            ) : (
              <PrimaryBtn
                icon={IconCircleArrowDown}
                text={`Download ${
                  data?.status === "CANCELLED" ? "Receipt" : ""
                }`}
                fullWidth={data?.status === "CANCELLED"}
                // fullWidth={!isAfter24Hours(data?.createdAt ?? new Date())}
                fw={600}
                action={() => handlePdfDownload(pdfRef)}
              />
            )}
          </Flex>
        )}

        {isAdmin && (
          <PrimaryBtn
            icon={IconCircleArrowDown}
            text={`Download ${
              !isAfter24Hours(data?.createdAt ?? new Date()) ? "Receipt" : ""
            }`}
            fullWidth
            fw={600}
            action={() => handlePdfDownload(pdfRef)}
          />
        )}
      </Flex>

      <InquiryModal
        pruneRef={data?.centrolinkRef ?? ""}
        opened={openedModal}
        close={closeModal}
        type={inquiryType}
        trxId={data?.id ?? ""}
        revalidate={revalidate}
      />

      <ModalComponent
        opened={openedCancel}
        close={closeCancel}
        title="Cancel This Transaction"
        text="By cancelling this transaction, the money will be reverted back to the holding account. Please give your reason below."
        addReason
        setReason={setCancelReason}
        reason={cancelReason}
        action={() => handleCancel()}
        icon={<IconX color="#D92D20" />}
        color="#FEF3F2"
        processing={processing}
        customApproveMessage="Submit"
      />

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
