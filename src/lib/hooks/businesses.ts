import axios from "axios";
import { useState, useEffect } from "react";

export function useBusiness() {
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [meta, setMeta] = useState<BusinessMeta>();

  const [loading, setLoading] = useState(true);

  async function fetchBusinesses() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/businesses`,
        { withCredentials: true }
      );

      setMeta(data.meta);
      setBusinesses(data.data);
    } catch (error) {
      console.log(error);
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

  return { loading, businesses, meta };
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
