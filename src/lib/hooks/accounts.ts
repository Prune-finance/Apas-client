/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useMemo } from "react";
import { IParams } from "@/lib/schema";

import createAxiosInstance from "@/lib/axios";
import useAxios from "./useAxios";
import { sanitizedQueryParams, sanitizeURL } from "../utils";

const axios = createAxiosInstance("accounts");

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
      const { data } = await axios.get(`/admin/accounts?${params}`);

      setMeta(data.meta);
      setAccounts(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => fetchAccounts();

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
      const { data } = await axios.get(`/admin/accounts/${id}`);

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate() {
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
      const { data } = await axios.get(`/admin/company/${id}/default-account`);

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate() {
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
      const { data } = await axios.get(`/admin/company/${id}/payout-account`);

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate() {
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
  const [meta, setMeta] = useState<{ total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.business && { business: customParams.business }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.search && { search: customParams.search }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, business, page, search } = obj;

  async function fetchAccount() {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(`/admin/accounts/payout?${params}`);

      setAccounts(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate() {
    fetchAccount();
  }

  useEffect(() => {
    fetchAccount();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, date, endDate, status, business, page, search]);

  return { loading, accounts, revalidate, meta };
}

export function useAccountStatistics({
  frequency,
  accountType,
}: {
  frequency: string;
  accountType: "Accounts" | "Payout" | "Company";
}) {
  const { loading, meta, queryFn } = useAxios<unknown, AccountStatsMeta>({
    baseURL: "accounts",
    endpoint: "/admin/accounts/statistics",
    params: { frequency, accountType },
    dependencies: [frequency, accountType],
  });

  return { loading, meta, revalidate: queryFn };
}

export function useUserAccounts(customParams: IParams = {}) {
  const { data, meta, loading, queryFn } = useAxios<AccountData[], AccountMeta>(
    {
      endpoint: "/accounts/dashboard",
      baseURL: "accounts",
      params: sanitizedQueryParams(customParams),
      dependencies: [sanitizeURL(customParams)],
    }
  );

  const {
    data: issuanceRequests,
    loading: statusLoading,
    queryFn: revalidateIssuance,
  } = useAxios<{ id: string; status: "PENDING" | "APPROVED" | "REJECTED" }[]>({
    endpoint: "/accounts/dashboard/requests/all",
    baseURL: "accounts",
    params: { type: "ACCOUNT_ISSUANCE" },
  });

  return {
    loading,
    accounts: data || [],
    revalidate: queryFn,
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
      const { data } = await axios.get(`/accounts/validate/dashboard`);
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
    const { data } = await axios.post(`/accounts/validate/dashboard`, {
      iban,
      bic,
    });
    return data.data;
  } catch (error) {
    return null;
  }
}
export async function validateAccountGBP({
  accountNumber,
  sortCode,
}: {
  accountNumber: string;
  sortCode: string;
}): Promise<ValidatedIban | null> {
  try {
    const { data } = await axios.post(`/accounts/validate/dashboard`, {
      accountNumber,
      sortCode,
      currency: "GBP",
    });
    return data.data;
  } catch (error) {
    return null;
  }
}

export interface ValidatedIban {
  swiftCodes: string;
  bankName: string;
  bankTown: string;
  bankAddress: string;
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

export function useSingleUserAccount(id: string, currency: string = "EUR") {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<MetaAccount | null>(null);

  async function fetchAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/accounts/${id}/dashboard?currency=${currency}`
      );

      setAccount(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate() {
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
      const { data } = await axios.get(`/admin/accounts/number/${iban}`);

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate() {
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
      const { data } = await axios.get(`/accounts/number/${iban}`);

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate() {
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
      const { data } = await axios.get(`/accounts/default`);

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

export function useUserCurrencyAccountByID(id: string, currency: string) {
  const [currencyAccount, setCurrencyAccount] = useState<DefaultAccount | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/currency-accounts/${id}?currency=${currency}`
      );
      console.log(data);
      setCurrencyAccount(data?.data);
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

  return { loading, currencyAccount, revalidate };
}

export function useAdminGetCompanyCurrencyAccountByID(id: string) {
  const [currencyAccount, setCurrencyAccount] = useState<DefaultAccount | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/currency-accounts/admin-get-account-by-id/${id}`
      );
      setCurrencyAccount(data?.data);
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

  return { loading, currencyAccount, revalidate };
}

export function useUserCurrencyAccount() {
  const [currencyAccount, setCurrencyAccount] = useState<
    CurrencyAccount[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/currency-accounts/list?type=COMPANY_ACCOUNT`
      );

      setCurrencyAccount(data?.data);
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

  return { loading, currencyAccount, revalidate };
}

export function useUserListCurrencyAccount() {
  const [listCurrency, setListCurrency] = useState<
    ListCurrencyAccount[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  async function fetchListAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/currency-accounts/requests/get-business-currency-account-request-status`
      );

      setListCurrency(data?.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListAccount();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, listCurrency };
}

export function useAdminGetCompanyCurrencyAccountsList(id: string) {
  const [currencyAccount, setCurrencyAccount] = useState<
    CurrencyAccount[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/currency-accounts/list/${id}`);

      setCurrencyAccount(data?.data);
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

  return { loading, currencyAccount, revalidate };
}

export function useUserCurrencyGBPAccount(currency: string) {
  const [account, setAccount] = useState<DefaultAccount | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/currency-accounts/get-account-by-currency/${currency}`
      );

      setAccount(data?.data);
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
export function useUserListOfBanks() {
  const [banks, setBanks] = useState<ListOfBanks[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/accounts/banks`);

      setBanks(data?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDefaultAccount();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, banks };
}

export function useUserDefaultPayoutAccount() {
  const [account, setAccount] = useState<DefaultAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // {{account-srv}}/v1/accounts/payout

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/accounts/payout`);

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => fetchDefaultAccount();

  useEffect(() => {
    fetchDefaultAccount();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, account, revalidate };
}
export function useUserDefaultPayoutAccountGBP() {
  const [account, setAccount] = useState<DefaultAccount[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDefaultAccount() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/currency-accounts/list?type=PAYOUT_ACCOUNT`
      );

      setAccount(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => fetchDefaultAccount();

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
  accountIban?: string;
  accountNumber: string;
  accountDocuments: AccountDocuments;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  accountBalance: number;
  Company: {
    name: string;
    id: string;
    issuedAccountCount?: number;
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
  walletId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  accountBalance: number;
  companyId: string;
  companyName?: string;
  status: "ACTIVE" | "INACTIVE" | "FROZEN";
  isTrusted?: boolean;
  sortCode: string;
  AccountRequests?: {
    Currency: Record<string, any>;
  };
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

export interface CurrencyAccount {
  id: string;
  firstName: string;
  lastName: string;
  isTrusted: boolean;
  accountRequestId: string;
  accountIdentifier: string;
  walletId: string;
  accountName: string;
  accountNumber: string;
  accountIban: string;
  accountType: "COMPANY_ACCOUNT" | string;
  accountBalance: number;
  accountDocuments: Record<string, any>;
  companyId: string;
  staging: "TEST" | "PRODUCTION" | string;
  status: "ACTIVE" | "PENDING" | "REJECTED" | string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  AccountRequests: {
    Currency: Record<string, any>;
  };
}

export interface ListOfBanks {
  bankCode: string;
  bankName: string;
  payoutType: "MobileMoney" | "BankTransfer" | string;
}

export interface ListCurrencyAccount {
  Currency: "GHS" | "GBP" | "NGN" | "EUR" | string;
  accountType: "PAYOUT_ACCOUNT" | "COMPANY_ACCOUNT" | string;
  companyId: "d1dfc7e9-12b7-4dff-9822-028384b302a5";
  stage: "TEST" | "PRODUCTION" | string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "ISSUED" | string;
}

export interface AccountStatsMeta {
  activeAccountCount: number;
  inactiveAccountCount: number;
  totalInflow: number;
  totalOutflow: number;
  totalNumberOfAccounts: number;
  totalAccountBalance: number;
}
