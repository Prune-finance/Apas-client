"use client";

import { useState } from "react";
import { ActionIcon, Badge, Box, Flex, Group, LoadingOverlay, Menu, TableTd, TableTr, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree, IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import Filter from "@/ui/components/Filter";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput, SelectBox } from "@/ui/components/Inputs";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import CountryFlag, { currencyFlagCode } from "@/ui/components/CountryFlag";
import { RateCurrency, useCurrencyList, useRatesMeta } from "@/lib/hooks/rates";
import classes from "@/ui/section/rate/styles.module.scss";
import CurrencyModal from "@/ui/section/rate/Modals/CurrencyModal";
import DeleteCurrencyModal from "@/ui/section/rate/Modals/DeleteCurrencyModal";
import { Icon } from "@/ui/section/rate/shared";

// Settings › Rate Currencies: the currencies available to rate pairs

type Filters = { currency: string | null; remittance: string | null; conversionInbound: string | null; conversionOutbound: string | null };
const emptyFilters: Filters = { currency: null, remittance: null, conversionInbound: null, conversionOutbound: null };
const YES_NO = [{ value: "true", label: "Enabled" }, { value: "false", label: "Disabled" }];

const FlagBadge = ({ on }: { on?: boolean }) => (
  <Badge className={classes.badge} bg={on ? "#E8FAF0" : "#EAECF0"} c={on ? "#12B76A" : "#667085"}>
    {on ? "Enabled" : "Disabled"}
  </Badge>
);

export default function RateCurrencies() {
  const ratesMeta = useRatesMeta();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const filterForm = useForm<Filters>({ initialValues: emptyFilters });
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const [adding, setAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<RateCurrency | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RateCurrency | null>(null);

  // The currency picked in the filter goes into the search box on Apply, so it is sent as `search`
  const { remittance, conversionInbound, conversionOutbound } = applied;
  const { currencies, meta, loading, revalidate } = useCurrencyList({
    search: debouncedSearch.trim() || undefined,
    remittance,
    conversionInbound,
    conversionOutbound,
    page: active,
    limit: Number(limit ?? 10),
  });
  const activeFilterCount = Object.values(applied).filter(Boolean).length;

  return (
    <Box mt={30} mih="calc(100vh - 290px)" pos="relative">
      <LoadingOverlay visible={loading} zIndex={10} overlayProps={{ radius: "sm", blur: 1 }} loaderProps={{ size: "md" }} />
      <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
        <Box>
          <Text fz={16} fw={600}>Rate Currencies</Text>
          <Text fz={12} c="var(--prune-text-gray-500)" mt={4}>
            Currencies that can be used in currency pairs, and how each one can be used.
          </Text>
        </Box>
        <PrimaryBtn text="Add Currency" icon={IconPlus} action={() => setAdding(true)} fw={600} fz={14} />
      </Flex>

      <Box className={classes.compactInputs}>
        <Flex mt={24} gap={12} align="center" justify="space-between" wrap="wrap">
          <SearchInput aria-label="Search currencies" placeholder="Search code or name" search={search}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setSearch(value);
              // Typing something else replaces the currency picked in the filter
              if (applied.currency && value !== applied.currency) {
                setApplied((f) => ({ ...f, currency: null }));
                filterForm.setFieldValue("currency", null);
              }
              setActive(1);
            }} />
          <SecondaryBtn text="Filter" action={toggleFilters} icon={IconListTree} indicator={activeFilterCount}
            fw={600} fz={12} />
        </Flex>
        <Filter<Filters>
          opened={filtersOpened}
          toggle={toggleFilters}
          form={filterForm}
          noDate
          isStatus
          onApply={(values) => {
            setApplied(values);
            if (values.currency) setSearch(values.currency);
            setActive(1);
          }}
          onClear={() => {
            if (applied.currency && search === applied.currency) setSearch("");
            setApplied(emptyFilters);
            setActive(1);
          }}
        >
          <SelectBox placeholder="Currency" searchable clearable
            data={(ratesMeta?.currencies ?? []).map((c) => ({ value: c.code, label: `${c.code} — ${c.name}` }))}
            {...filterForm.getInputProps("currency")} />
          <SelectBox placeholder="Remittance" data={YES_NO} clearable {...filterForm.getInputProps("remittance")} />
          <SelectBox placeholder="Conversion inbound" data={YES_NO} clearable {...filterForm.getInputProps("conversionInbound")} />
          <SelectBox placeholder="Conversion outbound" data={YES_NO} clearable {...filterForm.getInputProps("conversionOutbound")} />
        </Filter>
      </Box>

      <Box mt={24} className={classes.tableWrap}>
        <TableComponent loading={loading} className={classes.table}
          head={["Currency", "Symbol", "Remittance", "Conversion In", "Conversion Out", "Pairs", "Last updated", "Actions"]}
          columnWidths={["22%", "8%", "12%", "12%", "13%", "8%", "15%", "10%"]}
          rows={currencies.map((c) => (
            <TableTr key={c.code}>
              <TableTd>
                <Group gap={8} wrap="nowrap">
                  {/* Same round flag as the Rates table */}
                  {<CountryFlag code={currencyFlagCode(c.code, c.countryCode)} size={24} round style={{ width: 24, height: 24 }} />}
                  <Box>
                    <Text fz={14} lh={1}>{c.code}</Text>
                    <Text fz={12} lh={1.5} c="var(--prune-text-gray-500)">{c.name}</Text>
                  </Box>
                </Group>
              </TableTd>
              <TableTd>{c.symbol || "—"}</TableTd>
              <TableTd><FlagBadge on={c.remittanceEnabled} /></TableTd>
              <TableTd><FlagBadge on={c.conversionInboundEnabled} /></TableTd>
              <TableTd><FlagBadge on={c.conversionOutboundEnabled} /></TableTd>
              <TableTd>{c.pairCount ?? 0}</TableTd>
              <TableTd>
                <Text fz={14} lh={1}>{c.updatedAt ? dayjs(c.updatedAt).format("DD MMM YYYY") : "—"}</Text>
                {c.updatedAt && <Text fz={12} mt={4} c="var(--prune-text-gray-500)">{dayjs(c.updatedAt).format("HH:mm")}</Text>}
              </TableTd>
              <TableTd>
                <Menu position="bottom-end" withinPortal>
                  <Menu.Target>
                    <ActionIcon variant="transparent" w="100%" h={40} aria-label={`Actions for ${c.code}`}>
                      <Icon name="more" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => setEditTarget(c)}>Edit currency</Menu.Item>
                    <Menu.Item c={c.canDelete === false ? "var(--prune-text-gray-400)" : "#D92D20"} onClick={() => setDeleteTarget(c)}>
                      Delete currency
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </TableTd>
            </TableTr>
          ))}
        />
        <EmptyTable rows={currencies} loading={loading} title="No currencies found"
          text={debouncedSearch || activeFilterCount ? "Try another search or filter." : "Add a currency to start creating pairs."} />
      </Box>

      <PaginationComponent active={active} setActive={setActive} limit={limit} setLimit={setLimit}
        total={Math.max(1, meta?.totalPages ?? 1)} />

      <CurrencyModal opened={adding || !!editTarget} currency={editTarget}
        onClose={() => { setAdding(false); setEditTarget(null); }} onSaved={revalidate} />
      <DeleteCurrencyModal currency={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={revalidate} />
    </Box>
  );
}
