import { otherDocumentSchema } from "./../schema";
import { DebitRequest } from "./requests";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";

interface IParams {
  period?: string;
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
  page?: number;
  type?: string;
}
export function useBusiness(
  customParams: IParams = {},
  reqCount: boolean = false,
  otherReq: boolean = false
) {
  const obj = useMemo(() => {
    return {
      ...(customParams.period && { period: customParams.period }),
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
    };
  }, [customParams]);

  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [stats, setStats] = useState<{ [x: string]: number }[]>([]);
  const [statsMeta, setStatsMeta] = useState<StatsMeta>();
  const [meta, setMeta] = useState<BusinessMeta>();

  const [loading, setLoading] = useState(true);

  async function fetchBusinesses() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
      ...(reqCount && { reqCount: "true" }),
      ...(otherReq && { otherReq: "true" }),
      ...(customParams.type && { type: customParams.type }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/admin/businesses?${params.toString()}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setMeta(data.meta);
      setBusinesses(data.data);
    } catch (error) {
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBusinessRegistrationStats() {
    const queryParams = {
      ...(customParams.period && { period: customParams.period }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/business-stats?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );
      setStats(data.data);
      setStatsMeta(data.meta);
    } catch (error) {
      setStats([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBusinesses();
    fetchBusinessRegistrationStats();

    return () => {
      // Any cleanup code can go here
    };
  }, [
    obj.createdAt,
    obj.limit,
    obj.period,
    obj.sort,
    obj.status,
    obj.page,
    obj.type,
  ]);

  return { loading, businesses, meta, stats, statsMeta };
}

export function useSingleBusiness(id: string) {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchBusiness() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/businesses/${id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setBusiness(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchBusiness();
  }

  useEffect(() => {
    fetchBusiness();

    return () => {
      // Any cleanup code can go here
    };
  }, [id]);

  return { loading, business, revalidate };
}

export function useUserBusiness(customParams: IParams = {}) {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [meta, setMeta] = useState<BusinessMeta>();

  const [loading, setLoading] = useState(true);

  async function fetchBusinesses() {
    const queryParams = {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/auth/company?${params.toString()}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setMeta(data.meta);
      setBusiness(data.data);
    } catch (error) {
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBusinesses();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, business, meta };
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
// export interface BusinessData {
//   id: string;
//   apiCalls: number;
//   contactEmail: string;
//   contactNumber: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: null;
//   domain: string;
//   name: string;
//   staging: string;
//   kycTrusted: boolean;
//   country: string | null;
//   address: string | null;
//   legalEntity: string | null;
//   mermat: string | null;
//   cacCertificate: string | null;
//   directors: Director[];
//   shareholders: Director[];
//   companyStatus: "ACTIVE" | "INACTIVE";
// }

export interface BusinessMeta {
  total: number;
}

export interface StatsMeta {
  monthDiff: number;
  weekCount: number;
}

export interface BusinessData {
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
  businessBio: null | string;
  directorParticular: null | string;
  operationalLicense: null | string;
  shareholderParticular: null | string;
  amlCompliance: null | string;
  directors: Director[];
  shareholders: Director[];
  companyStatus: "ACTIVE" | "INACTIVE";
  apiCalls: number;
  _count: Count;
  pricingPlanId: null | string;
  pricingPlan: PricingPlan | null;
  otherDocuments: Record<string, string>;
  Accounts: { DebitRequests: { id: string }[] }[];
  Requests: { type: string; id: string }[];
  contactFirstName: string;
  contactIdType: string;
  contactIdUrl: string;
  contactIdUrlBack: string;
  contactLastName: string;
  contactPOAType: string;
  contactPOAUrl: string;
  documents: Document[];
}

export interface Document {
  title: string;
  documentURL: string;
}

export interface OtherDocuments {
  title: string;
  documentURL: string;
}

export interface PricingPlan {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  name: string;
  cycle: string;
  cost: number;
  description: string | null;
  features: string[];
}

export interface Count {
  AccountRequests: number;
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
