"use client";

import { formatNumber } from "@/lib/utils";
import {
  ReceiptDetails,
  TransactionReceipt,
} from "@/ui/components/TransactionReceipt";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRef, useState } from "react";
dayjs.extend(advancedFormat);
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Box } from "@mantine/core";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { handlePdfDownload } from "@/lib/actions/auth";
import { useReceipt } from "@/lib/hooks/receipt";
import { TransactionType } from "@/lib/hooks/transactions";

export default function Receipt() {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [processing, setProcessing] = useState(false);

  const trx = {
    id: "d444bac1-1cfc-44a8-bff2-c74679c8f363",
    createdAt: new Date("2024-12-17T08:03:32.234Z"),
    updatedAt: new Date("2024-12-17T08:03:32.234Z"),
    deletedAt: null,
    dpsId: 746,
    destinationFirstName: "",
    destinationLastName: "",
    narration: "Salary 5 payments",
    centrolinkRef: "ARPY746",
    recipientBankAddress: "Prune Payments LTD",
    recipientBankCountry: "United Kingdom",
    recipientBic: "ARPYGB21XXX",
    recipientIban: "GB12045505050505341",
    recipientName: "Alize Breitenberg",
    reference: "faf1e0ba-0c5d-44be-8097-89ce78c68ced",
    senderBic: "",
    senderIban: "GB1204550505050598",
    senderName: "C80 Limited",
    status: "PENDING",
    type: "DEBIT",
    amount: 100,
    accountId: null,
    companyAccountId: "209b8ed0-4649-4e95-a040-a756747bd722",
    payoutAccountId: null,
    staging: "TEST",
  };

  const { details } = useReceipt({
    selectedRequest: trx as TransactionType,
    senderAccount: null,
  });

  return (
    <Box>
      <PrimaryBtn
        text="Download Receipt"
        action={() => handlePdfDownload(receiptRef)}
        fw={600}
        loading={processing}
      />

      <Box pos="absolute" left={-9999} bottom={700} w="45vw" m={0} p={0}>
        <TransactionReceipt
          amount={trx.amount}
          amountType="Amount Sent"
          details={details}
          receiptRef={receiptRef}
        />
      </Box>
    </Box>
  );
}
