import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { IParams } from "../schema";

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

  async function fetchNotifications() {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/notifications?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setMeta(data.meta);
      setNotifications(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchNotifications();
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

  async function fetchNotifications() {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        obj as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setMeta(data.meta);
      setNotifications(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function revalidate() {
    fetchNotifications();
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
