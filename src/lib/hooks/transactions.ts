import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";

interface IParams {
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
  page?: number;
}

export function useTransactions(id: string = "", customParams: IParams = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
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
    customParams.createdAt,
    customParams.limit,
    customParams.status,
    customParams.sort,
    customParams.page,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function useBusinessTransactions(
  id: string = "",
  customParams: IParams = {}
) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<BusinessTrxMeta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);
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
    customParams.createdAt,
    customParams.limit,
    customParams.status,
    customParams.sort,
    customParams.page,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function usePayoutTransactions(customParams: IParams = {}) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<BusinessTrxMeta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
    };

    // {{account-srv}}/v1/admin/accounts/payout/trx
    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/payout/trx?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setTransactions(data.data.data);
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
    customParams.createdAt,
    customParams.limit,
    customParams.status,
    customParams.sort,
    customParams.page,
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
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
    };
  }, [customParams]);

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
  }, [id]);

  return { loading, transactions, meta, revalidate };
}

export function useUserDefaultTransactions(customParams: ITrx = {}) {
  const [transactions, setTransactions] = useState<TrxData[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
    };
  }, [customParams]);

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
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
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
}

export interface TransactionType {
  id: string;
  senderIban: string;
  recipientIban: string;
  recipientBic: string;
  recipientBankAddress: string;
  recipientBankCountry: string;
  recipientName: string;
  amount: number;
  reference: string;
  centrolinkRef: string;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
  destinationFirstName: string;
  destinationLastName: string;
  intermediary?: string;
  type: "DEBIT" | "CREDIT";
}
