import axios from "axios";
import { useState, useEffect } from "react";

export function useTransactions(id: string = "") {
  const [transactions, setTransactions] = useState<TrxData[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    try {
      const path = id ? `${id}/transactions` : "/transactions";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${path}`,
        { withCredentials: true }
      );

      setTransactions(data.data);
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

  return { loading, transactions, revalidate };
}

export function useUserTransactions(id: string = "") {
  const [transactions, setTransactions] = useState<TrxData[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTrx() {
    try {
      const path = id ? `${id}/transactions` : "/transactions";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${path}`,
        { withCredentials: true }
      );

      setTransactions(data.data);
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

  return { loading, transactions, revalidate };
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
}
