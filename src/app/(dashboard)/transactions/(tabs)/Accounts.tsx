"use client";

import { Image, Paper } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { useUserBusinessTransactions, exportUserBusinessTransactions } from "@/lib/hooks/transactions";
import { useAvailableCurrencies } from "@/lib/hooks/accounts";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";
import { CurrencyAccount } from "../CurrencyAccount";
import EUIcon from "@/assets/EU-icon.png";
import GBPIcon from "@/assets/GB.png";
import USDIcon from "@/assets/USD.png";
import GHSIcon from "@/assets/GH.png";

dayjs.extend(advancedFormat);

const currencyIconMap: Record<string, string> = {
  EUR: EUIcon.src,
  GBP: GBPIcon.src,
  USD: USDIcon.src,
  GHS: GHSIcon.src,
};

export const AccountsTab = () => {
  const searchParams = useSearchParams();
  const { currencies } = useAvailableCurrencies();
  const router = useRouter();
  const activeCurrency = searchParams.get("currency") || "EUR";

  const [opened, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { status, date, endDate, type, recipientName, recipientIban } =
    Object.fromEntries(searchParams.entries());

  const activeFilterCount = [status, date, endDate, type, recipientName, recipientIban].filter(Boolean).length;

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const queryParams = {
    date: date || undefined,
    endDate: endDate || undefined,
    status: status?.toUpperCase(),
    recipientIban,
    recipientName,
    type: type?.toUpperCase(),
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
    currencyCode: activeCurrency,
  };

  const { transactions, loading, meta, revalidate } = useUserBusinessTransactions(queryParams);
  usePaginationReset({ queryParams, setActive });

  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    try {
      await exportUserBusinessTransactions({ ...queryParams, currencyCode: activeCurrency });
    } finally {
      setExporting(false);
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setActive(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("currency", currency);
    router.push(`?${params.toString()}`);
  };

  const currencyTabs = currencies.map((c) => ({
    currency: c,
    title: c,
    icon: currencyIconMap[c] ?? EUIcon.src,
  }));

  return (
    <main>
      <Paper>
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {currencyTabs.map((t) => {
              const isActive = activeCurrency === t.currency;
              return (
                <button
                  key={t.currency}
                  onClick={() => handleCurrencyChange(t.currency)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    backgroundColor: isActive ? "#c1dd06" : "#fbfee6",
                    color: isActive ? "#344054" : "#596603",
                    transition: "background-color 0.15s ease, color 0.15s ease",
                  }}
                >
                  <Image src={t.icon} alt="icon" h={20} w={20} />
                  {t.title}
                </button>
              );
            })}
          </div>

          <CurrencyAccount
            transactions={transactions}
            loading={loading}
            meta={meta}
            currency={activeCurrency}
            search={search}
            setSearch={setSearch}
            opened={opened}
            toggle={toggle}
            form={form}
            active={active}
            setActive={setActive}
            limit={limit}
            setLimit={setLimit}
            revalidate={revalidate}
            onExport={handleExport}
            exporting={exporting}
            filterCount={activeFilterCount}
          />
        </div>
      </Paper>
    </main>
  );
};
