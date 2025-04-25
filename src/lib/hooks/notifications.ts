/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { IParams } from "@/lib/schema";

import createAxiosInstance from "@/lib/axios";

const axios = createAxiosInstance("auth");

export function useAdminNotifications(customParams: IParams = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meta, setMeta] = useState<NotificationMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.business && { business: customParams.business }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, business, type, page } = obj;

  async function fetchNotifications(limit?: number) {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `/admin/notifications?${params}${
          !params && limit ? `limit=${limit}` : ""
        }`
      );

      setMeta(data.meta);
      setNotifications(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate(limit?: number) {
    fetchNotifications(limit);
  }

  useEffect(() => {
    fetchNotifications();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, date, endDate, status, business, type, page]);

  return { loading, notifications, meta, revalidate };
}

export function useUserNotifications(customParams: IParams = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meta, setMeta] = useState<NotificationMeta>();
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.business && { business: customParams.business }),
      ...(customParams.type && { type: customParams.type }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, business, type, page } = obj;

  async function fetchNotifications(limit?: number) {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `/notifications?${params}${!params && limit ? `limit=${limit}` : ""}`
      );

      setMeta(data.meta);
      setNotifications(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function revalidate(limit?: number) {
    fetchNotifications(limit);
  }

  useEffect(() => {
    fetchNotifications();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, date, endDate, status, business, type, page]);

  return { loading, notifications, meta, revalidate };
}

const NotificationType = [
  "PAYOUTS",
  "TRANSACTIONS",
  "DEBIT_REQUEST",
  "DEBIT_REQUETS",
  "ACCOUNT_REQUESTS",
  "USER_ACTIVATION",
  "USER_DEACTIVATION",
  "PAYOUT_REQUEST",
  "PAYOUT_PROCESSING",
  "PAYOUT_TRANSACTION",
  "BUSINESS_TRANSACTION",
] as const;

export type NotificationType = (typeof NotificationType)[number] | null;

export interface Notification {
  id: string;
  title: string;
  description: string;
  companyId: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  readAt: Date | null;
  type: NotificationType;
  referenceId: string;
}

export interface NotificationMeta {
  total: number;
  page: number;
  countByGroup: CountByGroup[];
}

export interface CountByGroup {
  type: NotificationType;
  count: number;
}
