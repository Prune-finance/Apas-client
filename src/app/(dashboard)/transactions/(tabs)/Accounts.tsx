"use client";

import { Image, Paper } from "@mantine/core";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { useOwnerAccountTransactions } from "@/lib/hooks/transactions";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";
import { CurrencyAccount } from "../CurrencyAccount";
import EUIcon from "@/assets/EU-icon.png";
import GBPIcon from "@/assets/GB.png";
import USDIcon from "@/assets/USD.png";

dayjs.extend(advancedFormat);

type Currency = "EUR" | "GBP" | "USD";

const tabs = [
  { title: "EUR", value: "eur-account", currency: "EUR" as Currency, icon: EUIcon.src },
  { title: "GBP", value: "gbp-accounts", currency: "GBP" as Currency, icon: GBPIcon.src },
  { title: "USD", value: "usd-accounts", currency: "USD" as Currency, icon: USDIcon.src },
];

export const AccountsTab = () => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tab = searchParam.get("tab");
  const activeTab =
    tabs.find((t) => t.value.toLowerCase() === tab?.toLowerCase()) ?? tabs[0];

  const [opened, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { status, date, endDate, type, recipientName, recipientIban } =
    Object.fromEntries(searchParam.entries());

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
    status: status?.toUpperCase(),
    recipientIban,
    recipientName,
    type: type?.toUpperCase(),
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
    currencyCode: activeTab.currency,
  };

  const { transactions, loading, meta } = useOwnerAccountTransactions(queryParams);

  usePaginationReset({ queryParams, setActive });

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParam.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
    setActive(1);
  };

  return (
    <main>
      <Paper>
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {tabs.map((t) => {
              const isActive = activeTab.value === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => handleTabChange(t.value)}
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
            currency={activeTab.currency}
            search={search}
            setSearch={setSearch}
            opened={opened}
            toggle={toggle}
            form={form}
            active={active}
            setActive={setActive}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </Paper>
    </main>
  );
};
