import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { AdminData } from "./admins";

interface IParams {
  limit?: number;
  createdAt?: string | null;
  status?: string;
  sort?: string;
  type?: string;
}

interface ILogs extends Omit<IParams, "type" | "status"> {}

export function useLogs(customParams: ILogs = {}) {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  const obj = useMemo(() => {
    return {
      ...(customParams.limit && { limit: customParams.limit }),
      ...(customParams.createdAt && { createdAt: customParams.createdAt }),
      ...(customParams.sort && { sort: customParams.sort }),
    };
  }, [customParams]);

  async function fetchLogs() {
    const params = new URLSearchParams(
      obj as Record<string, string>
    ).toString();

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/logs/all?${params}`,
        { withCredentials: true }
      );
      setLogs(data.data);
    } catch (error) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  const revalidate = () => fetchLogs();

  useEffect(() => {
    fetchLogs();

    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return { loading, logs, revalidate };
}

export interface LogData {
  id: string;
  activity: string;
  admin: AdminData;
  ip: string;
  createdAt: Date;
}
