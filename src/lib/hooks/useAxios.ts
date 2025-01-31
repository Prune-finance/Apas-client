import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance, { BASEURL } from "@/lib/axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import useNotification from "./notification";
import { parseError } from "../actions/auth";

interface Props<T, M = unknown> {
  endpoint: string;
  // method?: AxiosRequestConfig["method"];
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  dependencies?: any[];
  onSuccess?: (data: T, meta: M) => void;
  baseURL?: keyof typeof BASEURL;
  enabled?: boolean;
}

interface ResponseType<T, M = unknown> {
  data: T;
  meta: M;
  message: string;
  status: boolean;
  code: number;
}

const useAxios = <T, M = unknown>({
  endpoint,
  baseURL = "accounts",
  method = "GET",
  body = null,
  params = {},
  dependencies = [],
  onSuccess,
  enabled = false,
}: Props<T, M>) => {
  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<M | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(method === "GET");
  const { handleError } = useNotification();

  const axios = axiosInstance(baseURL);

  const memoizedDependencies = useMemo(() => {
    return dependencies;
  }, [dependencies]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { data, meta },
      }: AxiosResponse<ResponseType<T, M>> = await axios({
        url: endpoint,
        method: method,
        data: body,
        params,
      });

      setData(data);
      setMeta(meta);
      onSuccess && onSuccess(data, meta);
    } catch (error) {
      if (method !== "GET")
        return handleError("An Error occurred", parseError(error));
      setError(error as Error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, params, onSuccess]);

  useEffect(() => {
    if (method === "GET" && !enabled) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...memoizedDependencies]);

  return { data, error, loading, meta, queryFn: fetchData };
};

export default useAxios;
