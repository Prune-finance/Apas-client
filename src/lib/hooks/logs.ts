import axios from "axios";
import { useState, useEffect } from "react";
import { AdminData } from "./admins";

export function useLogs() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/logs/all`,
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
