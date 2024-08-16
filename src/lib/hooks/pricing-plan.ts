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
export function usePricingPlan(customParams: IParams = {}) {
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

  const [pricingPlan, setPricingPlan] = useState<PricingPlan[]>([]);
  const [meta, setMeta] = useState<Meta>();

  const [loading, setLoading] = useState(true);

  async function fetchPricingPlans() {
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
        }/admin/pricing-plans?${params.toString()}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setMeta(data.meta);
      setPricingPlan(data.data);
    } catch (error) {
      setPricingPlan([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPricingPlans();

    return () => {
      // Any cleanup code can go here
    };
  }, [obj.createdAt, obj.limit, obj.sort, obj.status, obj.page, obj.type]);

  return { loading, pricingPlan, meta };
}

export function useSinglePricingPlan(id: string) {
  const [pricingPlan, setPricingPlan] = useState<PricingPlan | null>(null);
  //   const [meta, setMeta] = useState<Meta>();

  const [loading, setLoading] = useState(true);

  async function fetchPlan() {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/pricing-plans/${id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setPricingPlan(data.data);
    } catch (error) {
      setPricingPlan(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlan();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, pricingPlan };
}

export interface PricingPlan {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  name: string;
  cycle: string;
  cost: number;
  description: string;
  features: string[];
}

export interface Meta {
  total: number;
}
