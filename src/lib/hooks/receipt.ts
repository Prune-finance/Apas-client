import { BadgeFunc } from "@/ui/components/Badge";

import { ReceiptDetails } from "@/ui/components/TransactionReceipt";
import { formatNumber } from "../utils";
import { TransactionType } from "./transactions";
import { AccountData } from "./accounts";
import dayjs from "dayjs";
import getCreditTime from "../helpers/getCreditTime";

interface Props {
  selectedRequest: TransactionType | null;
  senderAccount: AccountData | null;
}
export const useReceipt = ({ selectedRequest, senderAccount }: Props) => {
  const details: ReceiptDetails[] = [
    {
      title: "Sender Details",
      value: {
        "Account Name":
          senderAccount?.accountName ?? selectedRequest?.senderName ?? "N/A",
        "Account Number":
          selectedRequest?.senderIban ??
          selectedRequest?.senderAccountNumber ??
          selectedRequest?.senderWalletId ??
          "",
        "Bank Name": "Prune Payments LTD",
        ...(selectedRequest?.currencyType === "GBP"
          ? {
              "Sort Code": selectedRequest?.senderSortCode ?? "N/A",
            }
          : selectedRequest?.currencyType === "GHS"
          ? {}
          : {
              BIC: "ARPYGB21XXX",
            }),
      },
    },
    {
      title: "Beneficiary Details",
      value: {
        "Amount Received": formatNumber(
          selectedRequest?.amount ?? 0,
          true,
          selectedRequest?.currencyType ?? "EUR"
        ),
        Name:
          selectedRequest?.recipientName ??
          selectedRequest?.beneficiaryName ??
          "N/A",

        ...(selectedRequest?.currencyType === "GBP"
          ? {
              "Account Number":
                selectedRequest?.beneficiaryAccountNumber ?? "N/A",
              "Sort Code": selectedRequest?.beneficiarySortCode ?? "N/A",
            }
          : selectedRequest?.currencyType === "GHS"
          ? {
              "Wallet ID": selectedRequest?.beneficiaryWalletId ?? "N/A",
              "Bank Name": selectedRequest?.beneficiaryInstitutionName ?? "N/A",
            }
          : selectedRequest?.currencyType === "USD"
          ? {
              "Account Number":
                selectedRequest?.beneficiaryAccountNumber ?? "N/A",
              "Sort Code": selectedRequest?.beneficiarySortCode ?? "N/A",
            }
          : {
              IBAN: selectedRequest?.recipientIban ?? "",
              "Bank Name": selectedRequest?.beneficiaryInstitutionName ?? "",
            }),

        Country: selectedRequest?.recipientBankCountry ?? "N/A",
        "Bank Address":
          selectedRequest?.beneficiaryAddress ??
          selectedRequest?.recipientBankAddress ??
          "N/A",
        Narration: selectedRequest?.narration ?? "",
      },
    },
    {
      title: "Other Details",
      value: {
        Type: selectedRequest?.type === "DEBIT" ? "Debit" : "Credit",
        "Payment Date": dayjs(selectedRequest?.createdAt).format(
          "hh:mm A Do MMM YYYY"
        ),

        "Approximate Credit Time":
          getCreditTime(selectedRequest?.createdAt as any) ?? "N/A",
        Reference: selectedRequest?.reference ?? "N/A",
        "C-L Reference": selectedRequest?.id ?? "",
        Status: BadgeFunc(selectedRequest?.status ?? ""),
      },
    },
  ];

  return { details };
};
