"use client";

import { usePayoutCurrencyTransactions } from "@/lib/hooks/transactions";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { PayoutTransactionTableRows } from "@/ui/components/TableRows";
import { PayoutTableHeaders } from "@/lib/static";
import { calculateTotalPages } from "@/lib/utils";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";
import { Group, Image } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import EUIcon from "@/assets/EU-icon.png";
import GBPIcon from "@/assets/GB.png";
import USDIcon from "@/assets/USD.png";
import GHSIcon from "@/assets/GH.png";

dayjs.extend(advancedFormat);

type Currency = "EUR" | "GBP" | "USD" | "GHS";

const currencyTabs = [
  { title: "EUR", currency: "EUR" as Currency, icon: EUIcon.src },
  { title: "GBP", currency: "GBP" as Currency, icon: GBPIcon.src },
  { title: "USD", currency: "USD" as Currency, icon: USDIcon.src },
  { title: "GHS", currency: "GHS" as Currency, icon: GHSIcon.src },
];

export const PayoutsTab = () => {
  const searchParams = useSearchParams();
  const [activeCurrency, setActiveCurrency] = useState<Currency>("EUR");
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [opened, { toggle }] = useDisclosure(false);

  const { status, date, endDate, type, recipientName, recipientIban, senderName } =
    Object.fromEntries(searchParams.entries());

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
    senderName,
    type: type?.toUpperCase(),
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
    currencyCode: activeCurrency,
  };

  const { transactions, loading, meta } = usePayoutCurrencyTransactions(queryParams);
  usePaginationReset({ queryParams, setActive });

  const handleCurrencyChange = (currency: Currency) => {
    setActiveCurrency(currency);
    setActive(1);
  };

  const infoDetails = [
    { title: "Total Balance", value: meta?.totalAmount || 0, formatted: true, currency: activeCurrency },
    { title: "Money In", value: meta?.in || 0, formatted: true, currency: activeCurrency },
    { title: "Money Out", value: meta?.out || 0, formatted: true, currency: activeCurrency },
    { title: "Total Transactions", value: meta?.total || 0 },
  ];

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, marginTop: 32 }}>
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

      <InfoCards details={infoDetails} title="Overview" />

      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />
        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} fw={600} />
      </Group>

      <Filter<FilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        approvalStatus
        customStatusOption={["Confirmed", "Pending", "Failed", "Rejected", "Cancelled"]}
      >
        <TextBox placeholder="Sender Name" {...form.getInputProps("senderName")} />
        <TextBox placeholder="Beneficiary Name" {...form.getInputProps("recipientName")} />
        <TextBox placeholder="Beneficiary IBAN" {...form.getInputProps("recipientIban")} />
        <SelectBox
          placeholder="Type"
          {...form.getInputProps("type")}
          data={["Debit", "Credit"]}
          clearable
        />
      </Filter>

      <TableComponent
        rows={<PayoutTransactionTableRows data={transactions} isUser />}
        loading={loading}
        head={PayoutTableHeaders}
      />

      <EmptyTable
        rows={transactions}
        loading={loading}
        title="There are no transactions"
        text="When a transaction is made, it will appear here"
      />

      <PaginationComponent
        total={calculateTotalPages(limit, meta?.total)}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};
