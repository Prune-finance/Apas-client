import axios from "axios";
import Cookies from "js-cookie";

const BASEURL = {
  auth: process.env.NEXT_PUBLIC_SERVER_URL,
  accounts: process.env.NEXT_PUBLIC_ACCOUNTS_URL,
  payouts: process.env.NEXT_PUBLIC_PAYOUT_URL,
};

const createAxiosInstance = (baseURL: keyof typeof BASEURL) => {
  const axiosInstance = axios.create({
    baseURL: BASEURL[baseURL],
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = Cookies.get("auth");
      const stage =
        typeof window !== "undefined"
          ? window.localStorage.getItem("stage") || "TEST"
          : "TEST";

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers["X-APP-STAGE"] = stage;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;

// src/hooks/useUserAccounts.ts
// import { useState, useEffect } from 'react';
// import createAxiosInstance from '@/lib/createAxiosInstance';

// const axiosInstance = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_URL_1);

// export const useUserAccounts = ({ limit }: { limit: number }) => {
//   const [accounts, setAccounts] = useState<AccountData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const response = await axiosInstance.get(`/accounts?limit=${limit}`);
//         setAccounts(response.data);
//       } catch (error) {
//         console.error('Failed to fetch accounts', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, [limit]);

//   return { accounts, loading };
// };
