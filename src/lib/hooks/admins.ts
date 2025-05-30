/* eslint-disable react-hooks/exhaustive-deps */
// import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { IParams } from "@/lib/schema";
import createAxiosInstance from "@/lib/axios";
import { Permission, Role } from "./roles";
import { sanitizedQueryParams, sanitizeURL } from "../utils";
import useAxios from "./useAxios";

const axios = createAxiosInstance("auth");

export function useAdmins(customParams: IParams = {}) {
  const [users, setUsers] = useState<AdminData[]>([]);
  const [meta, setMeta] = useState<{ total: number }>();

  const [loading, setLoading] = useState(true);

  const params = sanitizeURL(customParams as Record<string, string>);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/admins?${params}`);

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
  }, [params]);

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

  const params = sanitizeURL(customParams);

  async function fetchUsers() {
    // const params = new URLSearchParams(obj as Record<string, string>);

    setLoading(true);
    try {
      const { data } = await axios.get(
        `/admin/businesses/${id}/users?${params}`
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
  }, [params]);

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
  const {
    data,
    meta,
    loading,
    queryFn: revalidate,
  } = useAxios<AdminData[], { total: number }>({
    endpoint: `/auth/users`,
    baseURL: "auth",
    params: sanitizedQueryParams(customParams),
    dependencies: [sanitizeURL(customParams)],
  });

  return { loading, users: data || [], revalidate, meta };
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

export interface UserData {
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
  roles: string[];
  permissions: string[];
  company?: { name: string; id: string };
  companyId?: string;
}
