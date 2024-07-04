import axios from "axios";
import { useState, useEffect } from "react";

export function useAdmins() {
  const [users, setUsers] = useState<AdminData[]>([]);
  // const [meta, setMeta] = useState<BusinessMeta>();

  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/admins`,
        { withCredentials: true }
      );

      setUsers(data.data);
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

  return { loading, users, revalidate };
}

export function useUsers() {
  const [users, setUsers] = useState<AdminData[]>([]);
  // const [meta, setMeta] = useState<BusinessMeta>();

  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/users`,
        { withCredentials: true }
      );

      setUsers(data.data);
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

  return { loading, users, revalidate };
}

export interface AdminData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
}
