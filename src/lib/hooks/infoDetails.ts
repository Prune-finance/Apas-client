import { useMemo } from "react";
import { Meta } from "./transactions";

export const useInfoDetails = (meta: Meta | null) => {
  const infoDetails = useMemo(() => {
    const arr = [
      {
        title: "Total Balance",
        value: meta?.totalAmount || 0,
        formatted: true,
        currency: "EUR",
        locale: "en-GB",
      },
      {
        title: "Money In",
        value: meta?.in || 0,
        formatted: true,
        currency: "EUR",
        locale: "en-GB",
      },
      {
        title: "Money Out",
        value: meta?.out || 0,
        formatted: true,
        currency: "EUR",
        locale: "en-GB",
      },
      {
        title: "Total Transactions",
        value: meta?.total || 0,
      },
    ];

    return arr;
  }, [meta]);

  return { infoDetails };
};
