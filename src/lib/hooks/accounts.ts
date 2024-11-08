import { Meta } from "./transactions";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect, useMemo } from "react";
import { IParams } from "../schema";
import { custom } from "zod";

export function useAccounts(customParams: IParams = {}) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [meta, setMeta] = useState<AccountMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.accountName && {
        accountName: customParams.accountName,
      }),
      ...(customParams.accountNumber && {
        accountNumber: customParams.accountNumber,
      }),
    };
  }, [customParams]);

  const {
    limit,
    date,
    endDate,
    status,
    type,
    page,
    accountName,
    accountNumber,
  } = obj;

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
  }, [date, limit, status, type, page, accountName, accountNumber, endDate]);

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

export function useBusinessPayoutAccount(id: string) {
  const [account, setAccount] = useState<DefaultAccount | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/company/${id}/payout-account`,
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

export function usePayoutAccount(customParams: IParams = {}) {
  const [accounts, setAccounts] = useState<AccountData[] | null>(null);
  const [meta, setMeta] = useState<AccountMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.business && { business: customParams.business }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, business, page } = obj;

  async function fetchAccount() {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/payout?${params}`,
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
  }, [limit, date, endDate, status, business, page]);

  return { loading, accounts, revalidate, meta };
}

export function useUserAccounts(customParams: IParams = {}) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [meta, setMeta] = useState<AccountMeta>();
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [issuanceRequests, setIssuanceRequests] = useState<
    { id: string; status: "PENDING" | "APPROVED" | "REJECTED" }[]
  >([]);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.accountName && {
        accountName: customParams.accountName,
      }),
      ...(customParams.accountNumber && {
        accountNumber: customParams.accountNumber,
      }),
    };
  }, [customParams]);

  const {
    limit,
    status,
    date,
    endDate,
    accountName,
    type,
    accountNumber,
    page,
  } = obj;

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

  const handleCheckRequestAccess = async () => {
    setStatusLoading(true);
    // &status=PENDING
    try {
      const { data: res } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/dashboard/requests/all?type=ACCOUNT_ISSUANCE`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setIssuanceRequests(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setStatusLoading(false);
    }
  };

  const revalidate = () => fetchAccounts();
  const revalidateIssuance = () => handleCheckRequestAccess();

  useEffect(() => {
    fetchAccounts();
    handleCheckRequestAccess();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, status, date, endDate, accountName, type, accountNumber, page]);

  return {
    loading,
    accounts,
    revalidate,
    revalidateIssuance,
    meta,
    statusLoading,
    issuanceRequests,
  };
}

export function useValidateAccount({
  iban,
  bic,
}: {
  iban: string;
  bic: string;
}) {
  const [validateDetails, setValidatedDetails] = useState<ValidatedIban | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  async function validateAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/validate/dashboard`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
      setValidatedDetails(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    validateAccount();

    return () => {
      // Any cleanup code can go here
    };
  }, [iban, bic]);

  return {
    loading,
    validateDetails,
  };
}

export async function validateAccount({
  iban,
  bic,
}: {
  iban: string;
  bic: string;
}): Promise<ValidatedIban | null> {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/validate/dashboard`,
      { iban, bic },
      { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
    );
    return data.data;
  } catch (error) {
    return null;
  }
}

export interface ValidatedIban {
  swiftCodes: string;
  bankName: string;
  bankBranch: string;
  address: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  zipCode: string;
  supportPaymentMethod: string;
}

interface MetaAccount {
  hasPendingActivate: boolean;
  hasPendingDeactivate: boolean;
  hasPendingFreeze: boolean;
}

export function useSingleUserAccount(id: string) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<MetaAccount | null>(null);

  async function fetchAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/${id}/dashboard`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setAccount(data.data);
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

  return { loading, account, meta, revalidate };
}

export function useSingleAccountByIBAN(iban: string) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAccount() {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/accounts/number/${iban}`,
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
  staging: "TEST" | "LIVE";
  type: "USER" | "CORPORATE";
  status: "ACTIVE" | "INACTIVE" | "FROZEN";
  isTrusted?: boolean;
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
  isTrusted?: boolean;
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
