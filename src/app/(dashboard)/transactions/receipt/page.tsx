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

export default function Receipt() {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [processing, setProcessing] = useState(false);
  const beneficiaryDetails = {
    "Amount Received": formatNumber(123445, true, "EUR"),
    "First Name": "John",
    "Last Name": "Doe",
    IBAN: "GBE89370400440532013000",
    "Bank Name": "Prune Holdings",
    Country: "United Kingdom",
    "Bank Address": "Prune Holdings, 123 Main Street, London, UK",
  };

  const senderDetails = {
    "Account Name": "John Doe",
    "Account Number": "GBE89370400440532013000",
    "Bank Name": "Prune Holdings",
    BIC: "GBE8937",
  };

  const otherDetails = {
    Type: "Debit",
    "Payment Date": dayjs().format("hh:mm A Do MMM YYYY"),
    Reference: "1234567890",
    "Transaction ID": "1234567890",
  };
  const details: ReceiptDetails[] = [
    {
      title: "Sender Details",
      value: senderDetails,
    },
    { title: "Beneficiary Details", value: beneficiaryDetails },
    { title: "Other Details", value: otherDetails },
  ];

  // const handlePdfDownload = async () => {
  //   const input = receiptRef.current;
  //   if (!input) return;
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "px", "a4", true);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  //     const imgX = (pdfWidth - imgWidth * ratio) / 2;
  //     const imgY = 30;
  //     pdf.addImage(
  //       imgData,
  //       "PNG",
  //       imgX,
  //       imgY,
  //       imgWidth * ratio,
  //       imgHeight * ratio
  //     );
  //     pdf.save(`${Math.floor(Date.now() / 1000)}.pdf`);
  //   });
  // };

  // const handlePdfDownload = async () => {
  //   const input = receiptRef.current;
  //   if (!input) return;

  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "px", "a4", true);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  //     const imgX = (pdfWidth - imgWidth * ratio) / 2;
  //     let imgY = 30;
  //     let remainingHeight = imgHeight * ratio;

  //     while (remainingHeight > 0) {
  //       if (remainingHeight < pdfHeight - imgY) {
  //         pdf.addImage(
  //           imgData,
  //           "PNG",
  //           imgX,
  //           imgY,
  //           imgWidth * ratio,
  //           remainingHeight
  //         );
  //         break;
  //       } else {
  //         pdf.addImage(
  //           imgData,
  //           "PNG",
  //           imgX,
  //           imgY,
  //           imgWidth * ratio,
  //           pdfHeight - imgY
  //         );
  //         pdf.addPage();
  //         remainingHeight -= pdfHeight - imgY;
  //         imgY = 0; // Reset Y position for new page
  //       }
  //     }

  //     pdf.save(`${Math.floor(Date.now() / 10000)}.pdf`);
  //   });
  // };

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
          amount={123445}
          amountType="Amount Sent"
          details={details}
          receiptRef={receiptRef}
        />
      </Box>
    </Box>
  );
}
