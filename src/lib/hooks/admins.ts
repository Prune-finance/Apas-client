import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect, useMemo } from "react";
import { IParams } from "../schema";

export function useAdmins(customParams: IParams = {}) {
  const [users, setUsers] = useState<AdminData[]>([]);
  const [meta, setMeta] = useState<{ total: number }>();

  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.firstName && { firstName: customParams.firstName }),
      ...(customParams.lastName && { lastName: customParams.lastName }),
      ...(customParams.email && { email: customParams.email }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, firstName, lastName, email, page } =
    obj;

  async function fetchUsers() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/admins?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setUsers(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchUsers();

  useEffect(() => {
    fetchUsers();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, date, endDate, status, firstName, lastName, email, page]);

  return { loading, users, revalidate, meta };
}

export function useSingleAdmin(id: string) {
  const [user, setUser] = useState<AdminData>();

  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/admins/${id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setUser(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchUsers();

  useEffect(() => {
    fetchUsers();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, user, revalidate };
}

export function useBusinessUsers(customParams: IParams = {}, id: string) {
  const [users, setUsers] = useState<AdminData[]>([]);
  const [meta, setMeta] = useState<{ total: number }>();

  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.firstName && { firstName: customParams.firstName }),
      ...(customParams.lastName && { lastName: customParams.lastName }),
      ...(customParams.email && { email: customParams.email }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, date, endDate, status, firstName, lastName, email, page } =
    obj;

  async function fetchUsers() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/businesses/${id}/users?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setUsers(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchUsers();

  useEffect(() => {
    fetchUsers();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, date, endDate, status, firstName, lastName, email, page]);

  return { loading, users, revalidate, meta };
}

export function useSingleBusinessUser(businessId: string, userId: string) {
  const [user, setUser] = useState<AdminData>();

  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/businesses/${businessId}/users/${userId}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setUser(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchUsers();

  useEffect(() => {
    fetchUsers();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, user, revalidate };
}

export function useUsers(customParams: IParams = {}) {
  const [users, setUsers] = useState<AdminData[]>([]);
  const [meta, setMeta] = useState<{ total: number }>();

  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.date && { date: customParams.date }),
      ...(customParams.endDate && { endDate: customParams.endDate }),
      ...(customParams.email && { email: customParams.email }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const { limit, page, date, endDate, status, email } = obj;

  async function fetchUsers() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/users?${params}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      setUsers(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchUsers();

  useEffect(() => {
    fetchUsers();

    return () => {
      // Any cleanup code can go here
    };
  }, [limit, page, date, endDate, status, email]);

  return { loading, users, revalidate, meta };
}

export interface AdminData {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  firstName: string;
  lastName: string;
  role: string;
  lastLogIn: Date | null;
  status: "ACTIVE" | "INACTIVE" | "INVITE_PENDING";
}
