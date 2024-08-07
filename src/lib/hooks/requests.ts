import axios, { all } from "axios";
import { useState, useEffect, useMemo } from "react";
import { AccountData } from "./accounts";

// query: string = "";

interface IParams {
  period?: string;
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
  query?: string;
  type?: string;
  page?: number;
}

export function useRequests(customParams: IParams = {}, id: string = "") {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [meta, setMeta] = useState<RequestMeta>();
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
    //  `${id}/requests`;: fetch all requests for a specific business
    try {
      const path = id ? `business/${id}/requests` : "requests";
      // const status = query ? `?status=${query}` : "";
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/${path}?${params}`,
        { withCredentials: true }
      );

      setMeta(data.meta);
      setRequests(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchAccounts();
  }

  useEffect(() => {
    fetchAccounts();

    return () => {
      // Any cleanup code can go here
    };
  }, [obj.createdAt, obj.limit, obj.sort, obj.status, obj.type, obj.page]);

  return { loading, requests, meta, revalidate };
}

export function useSingleRequest(id: string) {
  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchRequest() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/requests/${id}`,
        { withCredentials: true }
      );

      setRequest(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchRequest();
  }

  useEffect(() => {
    fetchRequest();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, request, revalidate };
}

export function useUserRequests(customParams: IParams = {}) {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [meta, setMeta] = useState<RequestMeta>();
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

    try {
      // const status = query ? `?status=${query}` : "";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/dashboard/requests?${params}`,
        { withCredentials: true }
      );

      setMeta(data.meta);
      setRequests(data.data);
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

  return { loading, requests, meta, revalidate };
}

export function useSingleUserRequest(id: string) {
  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchRequest() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/requests/${id}`,
        { withCredentials: true }
      );

      setRequest(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchRequest();
  }

  useEffect(() => {
    fetchRequest();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, request, revalidate };
}
interface IDebitRequest extends Omit<IParams, "type" | "query"> {}
export function useDebitRequests(customParams: IDebitRequest = {}) {
  const [requests, setRequests] = useState<DebitRequest[]>([]);
  // const [meta, setMeta] = useState<RequestMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests?${params}`,
        { withCredentials: true }
      );

      setRequests(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => await fetchAccounts();

  useEffect(() => {
    fetchAccounts();

    return () => {
      // Any cleanup code can go here
    };
  }, [obj.createdAt, obj.limit, obj.sort, obj.status]);

  return { loading, requests, revalidate };
}

interface ICompanyRequest extends Omit<IParams, "query"> {}
export function useCompanyRequests(
  customParams: ICompanyRequest = {},
  id: string = "",
  all: boolean = false
) {
  const [requests, setRequests] = useState<IUserRequest[]>([]);
  const [meta, setMeta] = useState<{ total: number }>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const path = all ? "/all" : "";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/business/${id}/requests${path}?${params}`,
        { withCredentials: true }
      );

      setRequests(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => await fetchAccounts();

  useEffect(() => {
    fetchAccounts();

    return () => {
      // Any cleanup code can go here
    };
  }, [obj.createdAt, obj.limit, obj.sort, obj.status, obj.type, obj.page]);

  return { loading, requests, revalidate, meta };
}

export interface IUserRequest {
  id: string;
  type: string;
  status: string;
  reason: string;
  supportingDocumentName: null | string;
  supportingDocumentUrl: null;
  adminSupportingDocumentName: null;
  adminSupportingDocumentUrl: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  companyId: string;
  accountId: string;
  Company: Company;
}

export interface Company {
  name: string;
  id: string;
}

export function useUserDebitRequests(customParams: IParams = {}) {
  const [requests, setRequests] = useState<DebitRequest[]>([]);
  const [meta, setMeta] = useState<RequestMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  async function fetchRequests() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/payout/debit/requests?${params}`,
        { withCredentials: true }
      );

      setRequests(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = async () => await fetchRequests();

  useEffect(() => {
    fetchRequests();

    return () => {
      // Any cleanup code can go here
    };
  }, [obj.createdAt, obj.limit, obj.sort, obj.status, obj.page]);

  return { loading, requests, revalidate, meta };
}

interface BaseData {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  Company: {
    name: string;
    id: string;
    country: string;
    address: string;
    legalEntity: string;
    domain: string;
  };
}

export interface DebitRequest {
  id: string;
  accountId: string;
  amount: number;
  reason: string;
  destinationIBAN: string;
  destinationBIC: string;
  destinationCountry: string;
  destinationBank: string;
  reference: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  Account: AccountData;
}

interface UserRequestData extends BaseData {
  accountType: "USER";
  documentData: Director;
}

interface CorporateRequestData extends BaseData {
  accountType: "CORPORATE";
  documentData: DocumentData;
}

export type RequestData = UserRequestData | CorporateRequestData;

export interface DocumentData {
  directors: Directors;
  shareholders: Shareholder;
}

export interface Directors {
  [key: `director_${number}`]: Director;
}

export interface Shareholder {
  [key: `shareholder_${number}`]: Director;
}

export interface Director {
  idFileUrl: string;
  idType: string;
  poaFileUrl: string;
  poaType: string;
}

export interface RequestMeta {
  approvedRequests: number;
  pendingRequests: number;
  total: number;
}
