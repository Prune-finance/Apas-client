import { Meta } from "./transactions";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect, useMemo } from "react";

interface IParams {
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
  type?: string;
  page?: number;
}

export function useAccounts(customParams: IParams = {}) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [meta, setMeta] = useState<AccountMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    setLoading(true);
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts?${params}`,
        // { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [obj.createdAt, obj.limit, obj.sort, obj.status, obj.type, obj.page]);

  return { loading, accounts, revalidate, meta };
}

export function useSingleAccount(id: string) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/${id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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

export function useBusinessDefaultAccount(id: string) {
  const [account, setAccount] = useState<DefaultAccount | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/company/${id}/default-account`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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

export function usePayoutAccount() {
  const [accounts, setAccounts] = useState<AccountData[] | null>(null);
  const [meta, setMeta] = useState<AccountMeta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/payout`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setAccounts(data.data);
      setMeta(data.meta);
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

  return { loading, accounts, revalidate, meta };
}

export function useUserAccounts(customParams: IParams = {}) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [meta, setMeta] = useState<AccountMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/dashboard?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [obj.createdAt, obj.limit, obj.sort, obj.status, obj.type, obj.page]);

  return { loading, accounts, revalidate, meta };
}

export function useSingleUserAccount(id: string) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${id}/dashboard`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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

export function useSingleUserAccountByIBAN(iban: string) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/number/${iban}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [iban]);

  return { loading, account, revalidate };
}

export function useUserDefaultAccount() {
  const [account, setAccount] = useState<DefaultAccount | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/default`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchDefaultAccount();

  useEffect(() => {
    fetchDefaultAccount();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, account, revalidate };
}

export function useUserDefaultPayoutAccount() {
  const [account, setAccount] = useState<DefaultAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // {{account-srv}}/v1/accounts/payout

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/payout`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchDefaultAccount();

  useEffect(() => {
    fetchDefaultAccount();

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
  frozen: number;
  deactivated: number;
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

type DocumentType = "passport" | "driverLicense" | "nationalID" | string;
type POAType = "bankStatement" | "utilityBill" | "leaseAgreement" | string;

export interface PersonDocuments {
  idFile: string;
  idType: DocumentType;
  poaFile: string;
  poaType: POAType;
}

export interface CorporateAccountDocuments {
  directors: {
    [key: string]: PersonDocuments;
  };
  shareholders: {
    [key: string]: PersonDocuments;
  };
}

export interface BaseAccount {
  id: string;
  firstName: string;
  lastName: string;
  accountId: number;
  accountName: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  accountBalance: number;
  companyId: string;
  companyName?: string;
  status: "ACTIVE" | "INACTIVE" | "FROZEN";
}

export interface UserAccount extends BaseAccount {
  accountDocuments: AccountDocuments;
  type: "USER";
}

export interface CorporateAccount extends BaseAccount {
  accountDocuments: CorporateAccountDocuments;
  type: "CORPORATE";
}

export interface DefaultAccountDocuments {
  directors: Director[];
  shareholders: Director[];
}

export interface DefaultCorporateAccount extends BaseAccount {
  accountDocuments: DefaultAccountDocuments;
  type: "CORPORATE";
}

export interface Director {
  name: string;
  email: string;
  identityType: string;
  proofOfAddress: string;
  identityFileUrl: string;
  identityFileUrlBack: string;
  proofOfAddressFileUrl: string;
}

export type Account = UserAccount | CorporateAccount;

export type DefaultAccount = UserAccount | DefaultCorporateAccount;
