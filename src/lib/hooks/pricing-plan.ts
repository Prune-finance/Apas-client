/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import createAxiosInstance from "@/lib/axios";
import { IParams } from "../schema";

const axios = createAxiosInstance("auth");

export function usePricingPlan(customParams: IParams = {}) {
  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
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
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
      ...(customParams.type && { type: customParams.type }),
    };

    const params = new URLSearchParams(queryParams as Record<string, string>);

    try {
      setLoading(true);

      const { data } = await axios.get(`/admin/pricing-plans`, {
        params,
      });

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
  }, [obj.date, obj.limit, obj.status, obj.page, obj.type]);

  return { loading, pricingPlan, meta };
}

export function useSinglePricingPlan(id: string) {
  const [pricingPlan, setPricingPlan] = useState<PricingPlan | null>(null);
  //   const [meta, setMeta] = useState<Meta>();

  const [loading, setLoading] = useState(true);

  async function fetchPlan() {
    try {
      setLoading(true);

      const { data } = await axios.get(`/admin/pricing-plans/${id}`);

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
