import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { IParams } from "../schema";

export function useAdminNotifications(customParams: IParams = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meta, setMeta] = useState<Meta>();
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
  const [meta, setMeta] = useState<Meta>();
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

export interface Meta {
  total: number;
  page: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  companyId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  readAt: Date | null;
}
