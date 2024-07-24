import axios from "axios";
import { useState, useEffect, useMemo } from "react";

interface IParams {
  period?: string;
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
}
export function useBusiness(customParams: IParams = {}) {
  console.log(customParams);
  const obj = useMemo(() => {
    return {
      ...(customParams.period && { period: customParams.period }),
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
    };
  }, [customParams]);

  console.log(obj);

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
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);

    try {
      const { data } = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/admin/businesses?${params.toString()}`,
        { withCredentials: true }
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
        { withCredentials: true }
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
  }, [obj.createdAt, obj.limit, obj.period, obj.sort, obj.status]);

  return { loading, businesses, meta, stats, statsMeta };
}

export function useSingleBusiness(id: string) {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchBusiness() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/businesses/${id}`,
        { withCredentials: true }
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
  }, []);

  return { loading, business, revalidate };
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
export interface BusinessData {
  id: string;
  contactEmail: string;
  contactNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  domain: string;
  name: string;
  staging: string;
  kycTrusted: boolean;
  country: string | null;
  address: string | null;
  legalEntity: string | null;
  mermat: string | null;
  cacCertificate: string | null;
  directors: Director[];
  shareholders: Director[];
  companyStatus: "ACTIVE" | "INACTIVE";
}

export interface BusinessMeta {
  total: number;
}

export interface StatsMeta {
  monthDiff: number;
  weekCount: number;
}
