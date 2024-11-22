import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { IParams } from "../schema";

import createAxiosInstance from "@/lib/axios";

const axios = createAxiosInstance("payouts");

export function useInquiries(customParams: IParams = {}) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [meta, setMeta] = useState<{ total: number }>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.business && { business: customParams.business }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, business, type, page } = obj;

  async function fetchInquiries() {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(`/admin/inquiries?${params}`);

      setMeta(data.meta);
      setInquiries(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchInquiries();
  }

  useEffect(() => {
    fetchInquiries();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, date, endDate, status, business, type, page]);

  return { loading, inquiries, meta, revalidate };
}

export function useUserInquiries(customParams: IParams = {}) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [meta, setMeta] = useState<{ total: number }>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, type, page } = obj;

  async function fetchInquiries() {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(`/payout/inquiries?${params}`);

      setMeta(data.meta);
      setInquiries(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchInquiries();
  }

  useEffect(() => {
    fetchInquiries();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, date, endDate, status, type, page]);

  return { loading, inquiries, meta, revalidate };
}

export function useSingleInquiry(id: string) {
  const [inquiry, setInquiry] = useState<Inquiry>();
  const [loading, setLoading] = useState(true);

  async function fetchInquiries() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/inquiries/${id}`);

      setInquiry(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchInquiries();
  }

  useEffect(() => {
    fetchInquiries();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, inquiry, revalidate };
}

export function useUserSingleInquiry(id: string) {
  const [inquiry, setInquiry] = useState<Inquiry>();
  const [loading, setLoading] = useState(true);

  async function fetchInquiries() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/payout/inquiries/${id}`);

      setInquiry(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchInquiries();
  }

  useEffect(() => {
    fetchInquiries();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, inquiry, revalidate };
}

export interface Inquiry {
  id: string;
  status: "PROCESSING" | "CLOSED";
  type: "QUERY" | "TRACE" | "RECALL";
  companyId: string;
  userId: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Inquiry {
  id: string;
  status: "PROCESSING" | "CLOSED";
  type: "QUERY" | "TRACE" | "RECALL";
  reason: string;
  supportingDocument: string;
  companyId: string;
  userId: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  Transaction: Transaction;
  Messages: Message[];
  Company: Company;
  pruneRef: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  senderIban: string;
  senderName: string;
  senderBic: string;
  recipientIban: string;
  recipientName: string;
  recipientBic: string;
  recipientBankAddress: string;
  recipientBankCountry: string;
  amount: number;
  reference: string;
  type: string;
  centrolinkRef: string;
  status: string;
  dpsId: number;
  documents: Documents;
  narration: null;
  accountId: null;
  companyAccountId: null;
  payoutAccountId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

export interface Documents {}

type SenderType = "user" | "admin";

export interface MessageBase {
  id: string;
  senderType: SenderType;
  isEdited: boolean;
  inquiryId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}

interface TextMessage extends MessageBase {
  type: "text";
  text: string;
}

interface FileMessage extends MessageBase {
  type: "file";
  file: string;
  extension: string;
}

interface FileTextMessage extends MessageBase {
  type: "text-file";
  text: string;
  file: string;
  extension: string;
}

export type Message = TextMessage | FileMessage | FileTextMessage;
