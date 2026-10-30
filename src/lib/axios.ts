import axios from "axios";
import Cookies from "js-cookie";

export const BASEURL = {
  auth: process.env.NEXT_PUBLIC_SERVER_URL,
  accounts: process.env.NEXT_PUBLIC_ACCOUNTS_URL,
  questionnaire: process.env.NEXT_PUBLIC_QUESTIONNAIRE_URL,
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
      config.headers["X-App-Stage"] = stage;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  if (baseURL === "questionnaire") {
    let isRefreshing = false;
    let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

    const processQueue = (error: unknown, token: string | null = null) => {
      failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
      failedQueue = [];
    };

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config as typeof error.config & { _retry?: boolean };

        // Only auto-refresh for user onboarding endpoints, not admin
        const isUserEndpoint = !original?.url?.includes("/admin/");

        if (error.response?.status === 401 && isUserEndpoint && !original._retry) {
          if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              original.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(original);
            });
          }

          original._retry = true;
          isRefreshing = true;

          try {
            const { data } = await axios.post(
              `${BASEURL.questionnaire}/business/onboarding/auth/refresh`,
              {},
              { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
            );
            const newToken: string = data.data.accessToken;
            const expiresIn: number = data.data.expiresIn ?? 3600;
            Cookies.set("auth", newToken, { expires: expiresIn / 86400 });
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            original.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            return axiosInstance(original);
          } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

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
