import { ReactNode } from "react";
import { z } from "zod";

// .refine((data) => data.accountBalance < data.amount, {
//   message: "Account balance must be greater than or equal to amount",
//   path: ["accountBalance"],
// })

export const FilterValues = {
  createdAt: [null, null] as [Date | null, Date | null] | null,
  status: null,
  contactEmail: "",
  name: "",
  email: "",
  accountName: "",
  accountNumber: "",
  type: null,
  accountType: null,
  country: "",
  senderName: "",
  senderIban: "",
  recipientName: "",
  recipientIban: "",
  amount: null,
  business: "",
  bank: "",
  beneficiaryName: "",
  destinationIban: "",
  destinationBank: "",
  firstName: "",
  lastName: "",
};

export const FilterSchema = z.object({
  createdAt: z.tuple([z.date().nullable(), z.date().nullable()]).nullable(),
  status: z.string().nullable(),
  contactEmail: z.string().nullable(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  accountName: z.string().nullable(),
  accountNumber: z.string().nullable(),
  type: z.string().nullable(),
  accountType: z.string().nullable(),
  country: z.string().nullable(),
  senderName: z.string().nullable(),
  senderIban: z.string().nullable(),
  recipientName: z.string().nullable(),
  recipientIban: z.string().nullable(),
  amount: z.number().nullable(),
  business: z.string().nullable(),
  bank: z.string().nullable(),
  beneficiaryName: z.string().nullable(),
  destinationIban: z.string().nullable(),
  destinationBank: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

export type FilterType = z.infer<typeof FilterSchema>;

export interface IParams {
  limit?: number;
  date?: string | null;
  endDate?: string | null;
  status?: string;
  search?: string;
  business?: string;
  email?: string;
  name?: string;
  period?: string;
  accountName?: string;
  accountNumber?: string;
  accountType?: string;
  country?: string;
  senderName?: string;
  senderIban?: string;
  recipientName?: string;
  recipientIban?: string;
  amount?: number;
  type?: string;
  page?: number;
  companyId?: string;
  not?: string;
  currency?: string;
  currencyType?: string;
  query?: string;
  bank?: string;
  beneficiaryName?: string;
  beneficiaryAccountNumber?: string;
  destinationIban?: string;
  destinationBank?: string;
  firstName?: string;
  lastName?: string;
  reqCount?: string;
  otherReq?: string;
}

export interface Tab {
  title?: string | ReactNode;
  value: string;
  icon?: JSX.Element;
}
