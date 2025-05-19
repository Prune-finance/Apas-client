import { useState, useEffect, useMemo } from "react";
import createAxiosInstance from "@/lib/axios";
import { BusinessData } from "./businesses";
import { IParams } from "@/lib/schema";
import useAxios from "./useAxios";
import { sanitizedQueryParams, sanitizeURL } from "../utils";

const axios = createAxiosInstance("accounts");
const payoutAxiosInstance = createAxiosInstance("payouts");

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
      ...(customParams.search && {
        search: customParams.search,
      }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      setLoading(true);
      const path = id ? `${id}/transactions` : "transactions";

      const { data } = await axios.get(`/admin/accounts/${path}`, {
        params,
      });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    customParams.search,
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

      const { data } = await axios.get(`/admin/transactions/${id}/data`, {
        params,
      });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        `/admin/accounts/businesses/transactions/${trxId}/data`,
        {
          params,
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        `/admin/accounts/business/${id}/transactions`,
        {
          params,
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export function useBusinessAccountTransactions(
  id: string = "",
  customParams: IParams = {}
) {
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
      ...(customParams.search && { search: customParams.search }),
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
    search,
  } = obj;

  async function fetchTrx() {
    const params = new URLSearchParams(obj as Record<string, string>);
    try {
      setLoading(true);
      const path = id ? `` : "transactions";

      const { data } = await axios.get(
        `/admin/accounts/business/company-account/${id}/transactions`,
        { params }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    id,
    search,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function usePayoutAccountTransactions(
  id: string = "",
  customParams: IParams = {}
) {
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
      ...(customParams.search && { search: customParams.search }),
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
    search,
  } = obj;

  async function fetchTrx() {
    const params = new URLSearchParams(obj as Record<string, string>);
    try {
      setLoading(true);
      const path = id ? `` : "transactions";

      const { data } = await axios.get(
        `/admin/accounts/business/payout-account/${id}/transactions`,
        { params }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    id,
    search,
  ]);

  return { loading, transactions, meta, revalidate };
}

export function useDefaultAccountTransactions(customParams: IParams = {}) {
  console.log({ param: customParams });
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  // const obj = useMemo(() => {
  //   return {
  //     ...(customParams.limit && { limit: customParams.limit }),
  //     ...(customParams.not && { not: customParams.not }),
  //     ...(customParams.page && { page: customParams.page }),
  //     ...(customParams.date && { date: customParams.date }),
  //     ...(customParams.endDate && { endDate: customParams.endDate }),
  //     ...(customParams.status && { status: customParams.status }),
  //     ...(customParams.endDate && { endDate: customParams.endDate }),
  //     ...(customParams.type && { type: customParams.type }),
  //     ...(customParams.recipientIban && {
  //       recipientIban: customParams.recipientIban,
  //     }),
  //     ...(customParams.recipientName && {
  //       recipientName: customParams.recipientName,
  //     }),
  //     ...(customParams.senderName && { senderName: customParams.senderName }),
  //     ...(customParams.search && { search: customParams.search }),
  //   };
  // }, [customParams]);

  // const {
  //   limit,
  //   page,
  //   date,
  //   endDate,
  //   status,
  //   type,
  //   recipientIban,
  //   recipientName,
  //   senderName,
  //   not,
  //   search,
  // } = obj;

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
      ...(customParams.search && { search: customParams.search }),
    };

    // {{account-srv}}/v1/admin/accounts/payout/trx

    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/admin/accounts/businesses/transactions`,
        { params }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    customParams.limit,
    customParams.page,
    customParams.date,
    customParams.endDate,
    customParams.status,
    customParams.type,
    customParams.recipientIban,
    customParams.recipientName,
    customParams.senderName,
    customParams.not,
    customParams.search,
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
      ...(customParams.search && { search: customParams.search }),
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
    search,
  } = obj;

  async function fetchTrx() {
    // {{account-srv}}/v1/admin/accounts/payout/trx
    const params = new URLSearchParams(obj as Record<string, string>);

    try {
      setLoading(true);

      const { data } = await payoutAxiosInstance.get(`/admin/transactions`, {
        params,
      });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    search,
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

export function useUserTransactions(
  id: string = "",
  customParams: IParams = {}
) {
  const path = id ? `${id}/transactions` : "transactions";
  const {
    data,
    meta,
    loading,
    queryFn: revalidate,
  } = useAxios<TransactionType[], Meta>({
    endpoint: `/accounts/${path}`,
    baseURL: "accounts",
    params: sanitizedQueryParams(customParams),
    dependencies: [sanitizeURL(customParams)],
  });

  return { loading, transactions: data || [], meta, revalidate };
}

export function useUserDefaultTransactions(customParams: ITrx = {}) {
  const {
    data,
    meta,
    loading,
    queryFn: revalidate,
  } = useAxios<TransactionType[], Meta>({
    endpoint: "/accounts/company/transactions",
    baseURL: "accounts",
    params: sanitizedQueryParams(customParams),
    dependencies: [sanitizeURL(customParams)],
  });

  return { loading, transactions: data || [], meta, revalidate };
}

export function useUserCurrencyTransactions(customParams: ITrx = {}) {
  const {
    data,
    meta,
    loading,
    queryFn: revalidate,
  } = useAxios<TransactionType[], Meta>({
    endpoint:
      "currency-accounts/transactions/get-company-currency-account-transactions/GBP",
    baseURL: "accounts",
    params: sanitizedQueryParams(customParams),
    dependencies: [sanitizeURL(customParams)],
  });

  return { loading, transactions: data || [], meta, revalidate };
}

export function useUserPayoutTransactions(customParams: ITrx = {}) {
  const { data, meta, loading, queryFn } = useAxios<TransactionType[], Meta>({
    endpoint: "/payout/transactions",
    baseURL: "payouts",
    params: sanitizedQueryParams(customParams),
    dependencies: [sanitizeURL(customParams)],
  });

  return { loading, transactions: data || [], meta, revalidate: queryFn };
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
    const params = new URLSearchParams(obj as Record<string, string>);

    try {
      const { data } = await axios.get(
        `/admin/accounts/number/${iban}/transactions`,
        { params }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const params = new URLSearchParams(obj as Record<string, string>);

    try {
      const { data } = await axios.get(
        `/accounts/number/${iban}/transactions`,
        { params }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export interface Inquiry {
  id: string;
  type: "QUERY" | "RECALL" | "TRACE";
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
  deletedAt: Date | null;
  dpsId: number;
  destinationFirstName: string;
  destinationLastName: string;
  intermediary?: string;
  type: "DEBIT" | "CREDIT";
  company: BusinessData;
  narration?: string;
  Inquiries?: Inquiry[];
  accountId: string | null;
  companyAccountId: string | null;
  payoutAccountId: string | null;
  staging: "TEST" | "LIVE";
}
