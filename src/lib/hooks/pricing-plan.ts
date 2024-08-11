import axios from "axios";
import { useState, useEffect, useMemo } from "react";

interface IParams {
  period?: string;
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
  page?: number;
  type?: string;
}
export function usePricingPlan(
  customParams: IParams = {},
  reqCount: boolean = false,
  otherReq: boolean = false
) {
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
        }/admin/pricing-plans?${params.toString()}`,
        { withCredentials: true }
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
    fetchBusinesses();

    return () => {
      // Any cleanup code can go here
    };
  }, [obj.createdAt, obj.limit, obj.sort, obj.status, obj.page, obj.type]);

  return { loading, pricingPlan, meta };
}

export interface PricingPlan {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  name: string;
  cycle: string;
  cost: number;
}

export interface Meta {
  total: number;
}
