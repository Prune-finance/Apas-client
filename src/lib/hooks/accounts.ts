import axios from "axios";
import { useState, useEffect } from "react";

export function useAccounts() {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [meta, setMeta] = useState<AccountMeta>();
  const [loading, setLoading] = useState(true);

  async function fetchAccounts() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts`,
        { withCredentials: true }
      );

      setMeta(data.meta);
      setAccounts(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchAccounts();

  useEffect(() => {
    fetchAccounts();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, accounts, revalidate, meta };
}

export function useSingleAccount(id: string) {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}`,
        { withCredentials: true }
      );

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchAccount();
  }

  useEffect(() => {
    fetchAccount();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, account, revalidate };
}

export function useUserAccounts() {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [meta, setMeta] = useState<AccountMeta>();
  const [loading, setLoading] = useState(true);

  async function fetchAccounts() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/dashboard`,
        { withCredentials: true }
      );

      setMeta(data.meta);
      setAccounts(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchAccounts();

  useEffect(() => {
    fetchAccounts();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, accounts, revalidate, meta };
}

export function useSingleUserAccount(id: string) {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${id}/dashboard`,
        { withCredentials: true }
      );

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchAccount();
  }

  useEffect(() => {
    fetchAccount();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, account, revalidate };
}

export interface AccountMeta {
  active: number;
  inactive: number;
  total: number;
}

export interface AccountData {
  id: string;
  firstName: string;
  lastName: string;
  accountId: number;
  accountName: string;
  accountNumber: string;
  accountDocuments: AccountDocuments;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  accountBalance: number;
  Company: {
    name: string;
    id: string;
  };
  type: string;
  status: "ACTIVE" | "INACTIVE" | "FROZEN";
}

export interface AccountDocuments {
  idType: string;
  poaType: string;
  idFileURL: string;
  poaFileURL: string;
}
