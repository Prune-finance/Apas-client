"use client";

import { DownloadStatementData } from "@/ui/components/SingleAccount/(tabs)/Transactions";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";
import * as XLSX from "xlsx";

export function parseError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const res = error.response?.data;
    return res.message || error.message || "";
  }
  const err = error as { message: string };
  return err.message || "Something went wrong while processing your request";
}

export const handlePdfDownload = async (
  pdfRef: RefObject<HTMLDivElement>,
  pdfName?: string
) => {
  const input = pdfRef.current;
  if (!input) return;
  input.style.backgroundColor = "#ffffff";
  // Capture the HTML element as a canvas
  const canvas = await html2canvas(input, {
    scale: 2,
    backgroundColor: null,
  });
  const imgData = canvas.toDataURL("image/png");

  // setProcessing(true);
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px", // Set the unit to points
      format: "a6", // Set the page format to A4
      // compress: true, // Compress the PDF file
      putOnlyUsedFonts: true, // Only include used fonts
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const imgX = 0;
    // const imgX = (pdfWidth - imgWidth * ratio) / 2;
    let imgY = 0;

    pdf.setFillColor(255, 255, 255);
    // pdf.setFillColor(0, 0, 0);
    pdf.addImage(
      imgData,
      "SVG",
      imgX,
      imgY,
      pdfWidth, // Force the image to the width of the PDF
      pdfHeight
      // imgWidth * ratio,
      // imgHeight * ratio
    );

    // Save the PDF with a filename that includes the current timestamp
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    pdf.save(pdfName || `Transaction_Receipt_${timestamp}.pdf`);
  } finally {
    // Clean up the canvas and image data
    canvas.remove();
    // setProcessing(false);
  }
};

export const handleCsvDownload = (csvData: DownloadStatementData[], csvName?: string, currency?: string, isStatement?: boolean) => {
  console.log("CSV Data:", csvData);
  try {
    const data = csvData.map((row) => ({
      createdAt: row.createdAt,
      amount: row.amount,
      ...(isStatement ? { balance: row.balance } : {}),
      narration: row.description || row.narration,
      reference: row.reference,
      status: row.status,
      type: row.type,
      ...(row.accessRef ? { accessRef: row.accessRef } : {}),
      ...(currency === "GHS" ? { senderWalletId: row.senderWalletId, beneficiaryWalletId: row.beneficiaryWalletId, beneficiaryName: row.beneficiaryName } : {}),
      ...(currency === "GBP" ? { senderName: row.senderName, beneficiaryAccountNumber: row.beneficiaryAccountNumber, beneficiarySortCode: row.beneficiarySortCode } : {})
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const downloadCSV = async (csvData: string) => {
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        csvName || `transaction_statement_${Math.floor(Date.now() / 1000)
          .toString(36)
          .substring(2, 15)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    downloadCSV(csv);
  } catch (error) {
    throw "Error downloading CSV file";
  } finally {
    return;
  }
}

export const handlePdfStatement = async (
  pdfRef: RefObject<HTMLDivElement>,
  pdfName?: string
) => {
  const input = pdfRef.current;
  const pdfPages = document.querySelectorAll(".pdf-page") as NodeListOf<HTMLDivElement>;
  if (!input) return;
  input.style.backgroundColor = "#ffffff";
  try {
    // Position the image at the center of the PDF page
    const imgX = 0; // Keep X at 0 to start from the left
    const imgY = 0;

    const getCanvasData = (element: HTMLElement) => {
      return new Promise((resolve, reject) => {
        html2canvas(element, { scale: 2, logging: true })
          .then(function(canvas) {
            resolve(canvas.toDataURL("image/jpeg"));
          })
          .catch(function(error) {
            reject(
              "Error while creating canvas for element with ID: " + element.id
            );
          });
      });
    };

    const printPagesPromise = () => {
      var pdf = new jsPDF({
        orientation: "portrait",
        unit: "px", // Set the unit to points
        format: "a4", // Set the page format to A4
        compress: true,
        putOnlyUsedFonts: true, // Only include used fonts
      });

      let promises: Promise<unknown>[] = [];
      const pagesToProcess = pdfPages?.length > 0 ? pdfPages : [input];
      pagesToProcess.forEach(page => {promises.push(getCanvasData(page))});

      Promise.all(promises).then((images) => {
        images.forEach((imgData, index) => {
          if (index > 0) {
            pdf.addPage();
          }

          pdf.addImage(
            imgData as string,
            "JPEG",
            imgX,
            imgY,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
          );
        });
        const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
        pdf.save(pdfName || `Account_Statement_${timestamp}.pdf`);
      });
    };

    printPagesPromise();
  } finally {
    // Clean up the canvas and image data
    // setProcessing(false);
  }
};
