import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { string } from "zod";
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
}

export function useRequests(customParams: IParams = {}) {
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
    };
  }, [customParams]);

  async function fetchAccounts() {
    try {
      // const status = query ? `?status=${query}` : "";
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/requests?${params}`,
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

  useEffect(() => {
    fetchAccounts();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, requests, meta };
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

export function useUserRequests(query: string = "") {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [meta, setMeta] = useState<RequestMeta>();
  const [loading, setLoading] = useState(true);

  async function fetchAccounts() {
    try {
      const status = query ? `?status=${query}` : "";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/dashboard/requests${status}`,
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
  }, []);

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
interface IDebitRequest extends Omit<IParams, "type"> {}
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

export function useUserDebitRequests() {
  const [requests, setRequests] = useState<DebitRequest[]>([]);
  // const [meta, setMeta] = useState<RequestMeta>();
  const [loading, setLoading] = useState(true);

  async function fetchRequests() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/payout/debit/requests`,
        { withCredentials: true }
      );

      setRequests(data.data);
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
  }, []);

  return { loading, requests, revalidate };
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
  idFile: string;
  idType: string;
  poaFile: string;
  poaType: string;
}

export interface RequestMeta {
  approvedRequests: number;
  pendingRequests: number;
}
