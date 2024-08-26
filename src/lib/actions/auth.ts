"use client";

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";

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
