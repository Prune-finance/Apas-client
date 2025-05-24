import { useMemo } from "react";
import { Meta } from "./transactions";

export const useInfoDetails = (meta: Meta | null, currencyType?: string) => {
  const infoDetails = useMemo(() => {
    const arr = [
      {
        title: "Total Balance",
        value: meta?.totalAmount || 0,
        formatted: true,
        currency: currencyType ?? "EUR",
        locale: "en-GB",
      },
      {
        title: "Money In",
        value: meta?.in || 0,
        formatted: true,
        currency: currencyType ?? "EUR",
        locale: "en-GB",
      },
      {
        title: "Money Out",
        value: meta?.out || 0,
        formatted: true,
        currency: currencyType ?? "EUR",
        locale: "en-GB",
      },
      {
        title: "Total Transactions",
        value: meta?.total || 0,
      },
    ];

    return arr;
  }, [meta, currencyType]);

  return { infoDetails };
};
