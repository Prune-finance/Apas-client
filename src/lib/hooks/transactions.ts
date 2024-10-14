import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { BusinessData } from "./businesses";
import { IParams } from "../schema";

export function useTransactions(id: string = "", customParams: IParams = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.senderName && { senderName: customParams.senderName }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      setLoading(true);
      const path = id ? `${id}/transactions` : "transactions";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${path}?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [
    customParams.date,
    customParams.limit,
    customParams.status,
    customParams.endDate,
    customParams.type,
    customParams.senderName,
    customParams.recipientName,
    customParams.recipientIban,
    customParams.page,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function useSingleTransactions(
  id: string = "",
  customParams: IParams = {}
) {
  const [transaction, setTransaction] = useState<TransactionType | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      setLoading(true);
      const path = id ? `${id}/transactions` : "transactions";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/transactions/${id}/data?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransaction(data.data);
      setMeta(data.meta);
    } catch (error) {
      setTransaction(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [id]);

  return { loading, transaction, meta, revalidate };
}

export function useSingleCompanyTransactions(
  trxId: string = "",
  customParams: IParams = {}
) {
  const [transaction, setTransaction] = useState<TransactionType | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/businesses/transactions/${trxId}/data?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransaction(data.data);
      setMeta(data.meta);
    } catch (error) {
      setTransaction(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [trxId]);

  return { loading, transaction, meta, revalidate };
}

export function useBusinessTransactions(
  id: string = "",
  customParams: IParams = {}
) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<BusinessTrxMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.not && { not: customParams.not }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),
      ...(customParams.senderName && { senderName: customParams.senderName }),
    };
  }, [customParams]);

  const {
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
    not,
  } = obj;

  async function fetchTrx() {
    const params = new URLSearchParams(obj as Record<string, string>);
    try {
      setLoading(true);
      const path = id ? `` : "transactions";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/business/${id}/transactions?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
    not,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function useDefaultAccountTransactions(customParams: IParams = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.not && { not: customParams.not }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),
      ...(customParams.senderName && { senderName: customParams.senderName }),
    };
  }, [customParams]);

  const {
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
    not,
  } = obj;

  async function fetchTrx() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.senderName && { senderName: customParams.senderName }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
    };

    // {{account-srv}}/v1/admin/accounts/payout/trx
    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/businesses/transactions?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
    not,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function usePayoutTransactions(customParams: IParams = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.not && { not: customParams.not }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),
      ...(customParams.senderName && { senderName: customParams.senderName }),
    };
  }, [customParams]);

  const {
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
    not,
  } = obj;

  async function fetchTrx() {
    // {{account-srv}}/v1/admin/accounts/payout/trx
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/payout/trx?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
    not,
  ]);

  return { loading, transactions, meta, revalidate };
}

export interface BusinessTrxMeta {
  out: number;
  total: number;
  in: number;
  hva: Hva;
}

export interface Hva {
  accountName: string;
  amount: number;
}

interface ITrx extends IParams {
  id?: string;
}

export function useUserTransactions(id: string = "", customParams: ITrx = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),
      ...(customParams.senderName && { senderName: customParams.senderName }),
    };
  }, [customParams]);

  const {
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
  } = obj;

  async function fetchTrx() {
    setLoading(true);
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const path = id ? `${id}/transactions` : "transactions";
      const { data: res } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${path}?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [
    id,
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function useUserDefaultTransactions(customParams: ITrx = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),
      ...(customParams.senderName && {
        senderName: customParams.senderName,
      }),
    };
  }, [customParams]);

  const {
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
  } = obj;

  async function fetchTrx() {
    setLoading(true);
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/company/transactions?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function useUserPayoutTransactions(customParams: ITrx = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.not && { not: customParams.not }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.recipientIban && {
        recipientIban: customParams.recipientIban,
      }),
      ...(customParams.recipientName && {
        recipientName: customParams.recipientName,
      }),

      ...(customParams.senderName && { senderName: customParams.senderName }),
    };
  }, [customParams]);

  const {
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
    not,
  } = obj;
  async function fetchTrx() {
    setLoading(true);
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    // {{payout-srv}}/v1/payout/transactions

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/payout/transactions?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, [
    limit,
    page,
    date,
    endDate,
    status,
    type,
    recipientIban,
    recipientName,
    senderName,
    not,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function useTransactionsByIBAN(iban: string, customParams: ITrx = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
    };
  }, [customParams]);

  async function fetchTrx() {
    setLoading(true);
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/number/${iban}/transactions?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, transactions, meta, revalidate };
}

export function useUserTransactionsByIBAN(
  iban: string,
  customParams: ITrx = {}
) {
  const [transactions, setTransactions] = useState<TrxData[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
    };
  }, [customParams]);

  async function fetchTrx() {
    setLoading(true);
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/number/${iban}/transactions?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchTrx();

  useEffect(() => {
    fetchTrx();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, transactions, meta, revalidate };
}

export interface TrxData {
  id: string;
  type: "DEBIT" | "CREDIT";
  senderIban: string;
  recipientIban: string;
  recipientBic: string;
  recipientBankAddress: string;
  recipientBankCountry: string;
  amount: number;
  reference: string;
  centrolinkRef: string;
  status: "PENDING";
  createdAt: Date;
}

export interface Untitled1 {
  transactions: TransactionType[];
  meta: Meta;
}

export interface Meta {
  out: number;
  total: number;
  in: number;
  totalAmount: number;
}

export interface TransactionType {
  id: string;
  senderIban: string;
  senderName: string;
  senderBic: string;
  recipientIban: string;
  recipientBic: string;
  recipientBankAddress: string;
  recipientBankCountry: string;
  recipientName: string;
  amount: number;
  reference: string;
  centrolinkRef: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  destinationFirstName: string;
  destinationLastName: string;
  intermediary?: string;
  type: "DEBIT" | "CREDIT";
  company: BusinessData;
  narration?: string;
}
