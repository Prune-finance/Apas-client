"use client";

import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { PayoutTableHeaders } from "@/lib/static";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, TextBox, SelectBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { PayoutTransactionTableRows } from "@/ui/components/TableRows";
import { Box, Flex, Image, LoadingOverlay, TabsPanel } from "@mantine/core";
import {
  IconListTree,
  IconCircleArrowDown,
  IconFileExport,
  IconRefresh,
} from "@tabler/icons-react";
import { useState } from "react";
import {
  usePayoutCurrencyTransactions,
  exportPayoutTransactions,
} from "@/lib/hooks/transactions";
import { useInfoDetails } from "@/lib/hooks/infoDetails";
import { useParam } from "@/lib/hooks/param";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import { calculateTotalPages } from "@/lib/utils";
import EUIcon from "@/assets/EU-icon.png";
import GBPIcon from "@/assets/GB.png";
import USDIcon from "@/assets/USD.png";
import GHSIcon from "@/assets/GH.png";

type Currency = "EUR" | "GBP" | "USD" | "GHS";

const currencyTabs = [
  { title: "EUR", currency: "EUR" as Currency, icon: EUIcon.src },
  { title: "GBP", currency: "GBP" as Currency, icon: GBPIcon.src },
  { title: "USD", currency: "USD" as Currency, icon: USDIcon.src },
  { title: "GHS", currency: "GHS" as Currency, icon: GHSIcon.src },
];

interface Props {
  panelValue: string;
  customStatusOption: string[];
}

export const PayoutAccountTransactions = ({
  panelValue,
  customStatusOption,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState(1);
  const activeCurrency = (searchParams.get("currency") as Currency) || "EUR";
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const [opened, { toggle }] = useDisclosure(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterType>(FilterValues);

  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const { param } = useParam({
    status: appliedFilters.status ?? undefined,
    date: appliedFilters.createdAt?.[0] ? toLocalDateStr(appliedFilters.createdAt[0]) : undefined,
    endDate: appliedFilters.createdAt?.[1] ? toLocalDateStr(appliedFilters.createdAt[1]) : undefined,
    type: appliedFilters.type ?? undefined,
    senderName: appliedFilters.senderName ?? undefined,
    recipientName: appliedFilters.recipientName ?? undefined,
    recipientIban: appliedFilters.recipientIban ?? undefined,
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
  });

  const { transactions, loading, meta, revalidate } = usePayoutCurrencyTransactions({
    ...param,
    currencyCode: activeCurrency,
  });
  const { infoDetails } = useInfoDetails(meta, activeCurrency);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const [exporting, setExporting] = useState(false);

  const handleCurrencyChange = (currency: Currency) => {
    setActive(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("currency", currency);
    router.push(`?${params.toString()}`);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportPayoutTransactions({
        ...param,
        currencyCode: activeCurrency,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <TabsPanel value={panelValue}>
      <div style={{ display: "flex", gap: 8, marginTop: 32, marginBottom: 24 }}>
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

      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
          zIndex={10}
          overlayProps={{ radius: "sm", blur: 1 }}
          loaderProps={{ size: "md" }}
        />

        <InfoCards title="Overview" details={infoDetails} loading={loading} />

        <Flex justify="space-between" align="center" mt={38}>
          <SearchInput search={search} setSearch={setSearch} />
          <Flex gap={12}>
            <SecondaryBtn text="Refresh" action={revalidate} icon={IconRefresh} loading={loading} />
            <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
            <SecondaryBtn
              text="Download Statement"
              icon={IconCircleArrowDown}
            />
            <SecondaryBtn
              text="Export"
              action={handleExport}
              icon={IconFileExport}
              loading={exporting}
            />
          </Flex>
        </Flex>

        <Filter<FilterType>
          opened={opened}
          toggle={toggle}
          form={form}
          customStatusOption={customStatusOption}
          onApply={(values) => { setAppliedFilters(values); setActive(1); }}
          onClear={() => { setAppliedFilters(FilterValues); setActive(1); }}
        >
          <TextBox
            placeholder="Sender Name"
            {...form.getInputProps("senderName")}
          />
          <TextBox
            placeholder="Beneficiary Name"
            {...form.getInputProps("recipientName")}
          />
          <TextBox
            placeholder="Beneficiary IBAN"
            {...form.getInputProps("recipientIban")}
          />
          <SelectBox
            placeholder="Type"
            {...form.getInputProps("type")}
            data={["DEBIT", "CREDIT"]}
          />
        </Filter>

        <TableComponent
          head={PayoutTableHeaders}
          rows={
            <PayoutTransactionTableRows
              data={transactions}
              currency={activeCurrency}
            />
          }
          loading={loading}
        />

        <EmptyTable
          rows={transactions}
          loading={loading}
          text="Transactions will be shown here"
          title="There are no transactions"
        />

        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={calculateTotalPages(limit, meta?.total || 0)}
        />
      </Box>
    </TabsPanel>
  );
};
