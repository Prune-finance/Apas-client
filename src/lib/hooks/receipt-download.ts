"use client";

import { RefObject, useRef, useState } from "react";
import { handlePdfDownload, parseError } from "../actions/auth";
import useNotification from "./notification";

export const useReceiptDownload = (receiptRef: RefObject<HTMLDivElement>) => {
  const downloadInProgress = useRef(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const { handleError } = useNotification();

  const downloadReceipt = async () => {
    if (downloadInProgress.current) return;

    downloadInProgress.current = true;
    setDownloadingReceipt(true);
    try {
      if (!receiptRef.current) {
        throw new Error("The receipt is not ready. Please try again.");
      }
      await handlePdfDownload(receiptRef);
    } catch (error) {
      handleError("Receipt download failed", parseError(error));
    } finally {
      downloadInProgress.current = false;
      setDownloadingReceipt(false);
    }
  };

  return { downloadReceipt, downloadingReceipt };
};
