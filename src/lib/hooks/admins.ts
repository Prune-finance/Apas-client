/* eslint-disable react-hooks/exhaustive-deps */
// import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect, useMemo } from "react";
import { IParams } from "../schema";
import createAxiosInstance from "@/lib/axios";
import { Permission, Role } from "./roles";
import { sanitizeURL } from "../utils";

const axios = createAxiosInstance("auth");

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
      ...(customParams.search && { search: customParams.search }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  const params = sanitizeURL(customParams as Record<string, string>);
  console.log(params);

  const {
    limit,
    date,
    endDate,
    status,
    firstName,
    lastName,
    email,
    page,
    search,
  } = obj;

  async function fetchUsers() {
    // const params = new URLSearchParams(obj as Record<string, string>);

    setLoading(true);
    try {
      const { data } = await axios.get("/admin/admins", {
        params,
      });

      console.log(data);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, users, revalidate, meta };
}

export function useSingleAdmin(id: string) {
  const [user, setUser] = useState<AdminData>();

  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/admins/${id}`);

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
    const params = new URLSearchParams(obj as Record<string, string>);

    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/businesses/${id}/users`, {
        params,
      });

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
        `/admin/businesses/${businessId}/users/${userId}`
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
    const params = new URLSearchParams(obj as Record<string, string>);

    setLoading(true);
    try {
      const { data } = await axios.get(`/auth/users`, { params });

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
  lastLogin: Date | null;
  lastLogIn: Date | null;
  status: "ACTIVE" | "INACTIVE" | "INVITE_PENDING";
  role: "USER" | "INITIATOR";
  roles: Role[];
  permissions: Permission[];
  company?: { name: string; id: string };
  companyId?: string;
}
