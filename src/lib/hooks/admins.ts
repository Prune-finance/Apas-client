import axios from "axios";
import { useState, useEffect, useMemo } from "react";

interface IParams {
  period?: string;
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
  type?: string;
  page?: number;
}

interface IAdmins extends Omit<IParams, "type"> {}

export function useAdmins(customParams: IAdmins = {}) {
  const [users, setUsers] = useState<AdminData[]>([]);
  const [meta, setMeta] = useState<{ total: number }>();

  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  async function fetchUsers() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/admins?${params}`,
        { withCredentials: true }
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
  }, [obj.createdAt, obj.limit, obj.page, obj.sort, obj.status]);

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
        { withCredentials: true }
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
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.status && { status: customParams.status }),
      ...(customParams.sort && { sort: customParams.sort }),
      ...(customParams.page && { page: customParams.page }),
    };
  }, [customParams]);

  async function fetchUsers() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/users?${params}`,
        { withCredentials: true }
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
  }, [obj.createdAt, obj.limit, obj.page, obj.sort, obj.status]);

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
}
