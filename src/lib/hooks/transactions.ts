import axios from "axios";
import { useState, useEffect, useMemo } from "react";

interface IParams {
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
}

export function useTransactions(id: string = "") {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    try {
      const path = id ? `${id}/transactions` : "transactions";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${path}`,
        { withCredentials: true }
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

interface ITrx extends IParams {
  id?: string;
}

export function useUserTransactions(id: string = "", customParams: ITrx = {}) {
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
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const path = id ? `${id}/transactions` : "/transactions";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${path}?${params}`,
        { withCredentials: true }
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
  amount: number;
  reference: string;
  centrolinkRef: string;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}
