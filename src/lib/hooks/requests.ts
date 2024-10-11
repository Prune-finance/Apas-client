import axios from "axios";
import { useState, useEffect, useMemo } from "react";

import Cookies from "js-cookie";
import { IParams } from "../schema";

// query: string = "";

export function useRequests(customParams: IParams = {}, id: string = "") {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [meta, setMeta] = useState<RequestMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.accountName && {
        accountName: customParams.accountName,
      }),
      ...(customParams.country && { country: customParams.country }),
      ...(customParams.accountType && {
        accountType: customParams.accountType,
      }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const {
    limit,
    date,
    endDate,
    accountName,
    country,
    accountType,
    status,
    page,
  } = obj;

  async function fetchAccounts() {
    //  `${id}/requests`;: fetch all requests for a specific business
    setLoading(true);
    try {
      const path = id ? `business/${id}/requests` : "requests";
      // const status = query ? `?status=${query}` : "";
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/${path}?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [date, endDate, page, limit, accountName, country, accountType, status]);

  return { loading, requests, meta, revalidate };
}

export function useAllRequests(customParams: IParams = {}) {
  const [requests, setRequests] = useState<IUserRequest[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.type && { type: customParams.type.toUpperCase() }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.accountName && {
        accountName: customParams.accountName,
      }),
      ...(customParams.accountNumber && {
        accountNumber: customParams.accountNumber,
      }),
      ...(customParams.accountType && {
        accountType: customParams.accountType,
      }),
      ...(customParams.business && { business: customParams.business }),
    };
  }, [customParams]);

  const {
    limit,
    date,
    endDate,
    status,
    type,
    accountName,
    accountNumber,
    business,
    accountType,
    page,
  } = obj;

  async function fetchAccounts() {
    //  `${id}/requests`;: fetch all requests for a specific business
    setLoading(true);
    try {
      // const status = query ? `?status=${query}` : "";
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/requests/all?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [
    limit,
    date,
    endDate,
    status,
    type,
    accountName,
    accountNumber,
    business,
    accountType,
    page,
  ]);

  return { loading, requests, meta, revalidate };
}

export function useAllCompanyRequests(
  businessId: string,
  customParams: IParams = {}
) {
  const [requests, setRequests] = useState<IUserRequest[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.type && { type: customParams.type.toUpperCase() }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.companyId && { companyId: customParams.companyId }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    //  `${id}/requests`;: fetch all requests for a specific business
    setLoading(true);
    try {
      // const status = query ? `?status=${query}` : "";
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/business/${businessId}/requests/all?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [obj.date, obj.limit, obj.status, obj.type, obj.page, obj.companyId]);

  return { loading, requests, meta, revalidate };
}

export function usePayoutTransactionRequests(customParams: IParams = {}) {
  const [requests, setRequests] = useState<PayoutTransactionRequest[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.not && { not: customParams.not }),
      ...(customParams.destinationBank && {
        bank: customParams.destinationBank,
      }),
      ...(customParams.destinationIban && {
        recipientIban: customParams.destinationIban,
      }),
      ...(customParams.beneficiaryName && {
        recipientName: customParams.beneficiaryName,
      }),
      ...(customParams.senderIban && { senderIban: customParams.senderIban }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const {
    limit,
    status,
    not,
    recipientIban,
    recipientName,
    senderIban,
    bank,
    date,
    endDate,
    page,
  } = obj;

  async function fetchAccounts() {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/transaction/requests?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [
    limit,
    status,
    not,
    recipientIban,
    recipientName,
    senderIban,
    bank,
    date,
    endDate,
    page,
  ]);

  return { loading, requests, meta, revalidate };
}

export function useSingleRequest(id: string) {
  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchRequest() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/requests/${id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.accountName && {
        accountName: customParams.accountName,
      }),
      ...(customParams.country && { country: customParams.country }),
    };
  }, [customParams]);
  const { date, limit, accountName, country, endDate, status, type, page } =
    obj;
  async function fetchAccounts() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);
    try {
      // const status = query ? `?status=${query}` : "";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/accounts/dashboard/requests?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [date, limit, accountName, country, endDate, status, type, page]);

  return { loading, requests, meta, revalidate };
}

export function useSingleUserRequest(id: string) {
  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchRequest() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/requests/${id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.business && { business: customParams.business }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [obj.date, obj.endDate, obj.limit, obj.status]);

  return { loading, requests, revalidate };
}

export function usePayoutRequests(customParams: IDebitRequest = {}) {
  const [requests, setRequests] = useState<PayoutAccount[]>([]);
  const [meta, setMeta] = useState<RequestMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.business && { business: customParams.business }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.companyId && { companyId: customParams.companyId }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/requests/payout?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [
    obj.date,
    obj.limit,
    obj.status,
    obj.companyId,
    obj.endDate,
    obj.business,
  ]);

  return { loading, requests, revalidate, meta };
}

export function useCompanyDebitRequests(
  id: string,
  customParams: IDebitRequest = {}
) {
  const [requests, setRequests] = useState<DebitRequest[]>([]);
  const [meta, setMeta] = useState<RequestMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/${id}/requests?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setRequests(data.data);
      setMeta(data.meta as RequestMeta);
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
  }, [obj.date, obj.limit, obj.status]);

  return { loading, requests, revalidate, meta };
}

export function useLiveKeyRequests(customParams: IParams = {}) {
  const [requests, setRequests] = useState<LiveKeyRequest[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.business && { business: customParams.business }),
    };
  }, [customParams]);

  const { limit, page, date, endDate, business, status } = obj;
  async function fetchAccounts() {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data: res } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/keys/requests?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setRequests(res.data);
      setMeta(res.meta);
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
  }, [limit, page, date, endDate, business, status]);

  return { loading, requests, revalidate, meta };
}

export function useSingleLiveKeyRequests(id: string) {
  const [requests, setRequests] = useState<LiveKeyRequest>();

  const [loading, setLoading] = useState(true);

  async function fetchAccounts() {
    setLoading(true);
    try {
      const { data: res } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/keys/requests/${id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setRequests(res.data);
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
  }, []);

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
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
    };
  }, [customParams]);

  async function fetchAccounts() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);

    try {
      const path = all ? "/all" : "";
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/admin/business/${id}/requests${path}?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [obj.date, obj.limit, obj.status, obj.type, obj.page]);

  return { loading, requests, revalidate, meta };
}

export interface IUserRequest {
  id: string;
  type: "FREEZE" | "UNFREEZE" | "ACTIVATE" | "DEACTIVATE" | "ACCOUNT_ISSUANCE";
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
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
  Account: Account;
}

export interface Company {
  name: string;
  id: string;
}

export interface Meta {
  total: number;
}

export function useUserDebitRequests(customParams: IParams = {}) {
  const [requests, setRequests] = useState<DebitRequest[]>([]);
  const [meta, setMeta] = useState<RequestMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.accountName && {
        accountName: customParams.accountName,
      }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, page, accountName } = obj;

  async function fetchRequests() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/payout/debit/requests?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
  }, [limit, date, endDate, status, page, accountName]);

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
  reason: string | null;
  Company: {
    name: string;
    id: string;
    country: string;
    address: string;
    legalEntity: string;
    domain: string;
  };
  documentApprovals: Record<string, any>;
  country: string;
  Account?: Account;
}

export interface DebitRequest {
  id: string;
  accountId: string;
  reason: string;
  destinationFirstName: null;
  destinationLastName: null;
  destinationIBAN: string;
  destinationBIC: string;
  destinationCountry: string;
  destinationBank: string;
  reference: string;
  createdAt: Date;
  deletedAt: null;
  updatedAt: Date;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  companyAccountId: null;
  Account: Account;
}

export interface Account {
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
  companyId: string;
  type: "USER" | "CORPORATE";
  status: string;
  accountRequestId: null;
  Company: Company;
}

export interface Company {
  name: string;
}

export interface AccountDocuments {
  idType: string;
  poaType: string;
  idFileURL: string;
  poaFileURL: string;
}

export interface Meta {
  total: number;
}

export interface UserRequestData extends BaseData {
  accountType: "USER";
  documentData: Director;
}

export interface CorporateRequestData extends BaseData {
  accountType: "CORPORATE";
  documentData: DocumentData;
}

export type RequestData = UserRequestData | CorporateRequestData;

export interface DocumentData {
  mermat: string;
  certOfInc: string;
  directors: Directors;
  shareholders: Shareholder;
}

export interface Directors {
  [key: `director_${number}`]: CorporateDirector;
}

export interface Shareholder {
  [key: `shareholder_${number}`]: CorporateDirector;
}

export interface Director {
  idFileURL: string;
  idType: string;
  poaFileURL: string;
  poaType: string;
}
export interface CorporateDirector {
  idFile: string;
  idFileBack?: string;
  idType: string;
  poaFile: string;
  poaType: string;
}

export interface RequestMeta {
  approvedRequests: number;
  pendingRequests: number;
  inactiveAccounts: number;
  total: number;
  companyName: string;
}

export interface PayoutAccount {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  companyName: string;
  documentData: PayoutDocumentData;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  companyId: string;
  Company: Company;
}

export interface PayoutDocumentData {
  directors: PayoutDirector[];
  shareholders: PayoutDirector[];
}

export interface PayoutDirector {
  name: string;
  email: string;
  identityType: string;
  proofOfAddress: string;
  identityFileUrl: string;
  proofOfAddressFileUrl: string;
}

export interface Meta {
  total: number;
}

export interface LiveKeyRequest {
  id: string;
  status: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  companyId: string;
  Company: Company;
}

export interface Company {
  id: string;
  contactEmail: string;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  domain: string;
  name: string;
  staging: string;
  kycTrusted: boolean;
  address: string;
  country: string;
  legalEntity: string;
  cacCertificate: string;
  mermat: string;
  directors: LiveKeyDirector[];
  shareholders: LiveKeyDirector[];
  companyStatus: string;
  apiCalls: number;
  amlCompliance: null | string;
  businessBio: string;
  directorParticular: string;
  operationalLicense: null | string;
  shareholderParticular: null | string;
  pricingPlanId: string;
  contactFirstName: null | string;
  contactIdType: null | string;
  contactIdUrl: null | string;
  contactIdUrlBack: null | string;
  contactLastName: null | string;
  contactPOAType: null | string;
  contactPOAUrl: null | string;
  documents: Document[];
  lastLogIn: Date;
}

export interface LiveKeyDirector {
  name: string;
  email: string;
  identityType: string;
  proofOfAddress: string;
  identityFileUrl: string;
  identityFileUrlBack: string;
  proofOfAddressFileUrl: string;
}

export interface Document {
  title?: string;
  documentURL?: string;
}

export interface PayoutTransactionRequest {
  id: string;
  beneficiaryFullName: string;
  destinationIBAN: string;
  destinationBIC: string;
  destinationCountry: string;
  destinationBank: string;
  reference: string;
  amount: number;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  PayoutAccount: {
    accountName: string;
    accountNumber: string;
  };
}
