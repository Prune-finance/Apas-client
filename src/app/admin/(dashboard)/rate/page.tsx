"use client";

import { useState } from "react";
import { ActionIcon, Badge, Box, Flex, Group, Menu, Modal, NumberInput, SimpleGrid, Stack, Switch, TableTd, TableTr, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowUpRight, IconListTree } from "@tabler/icons-react";
import Filter from "@/ui/components/Filter";
import dayjs from "dayjs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput, SelectBox } from "@/ui/components/Inputs";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { initialRates, RatePair, RateStatus } from "./data";
import classes from "./styles.module.scss";
import DisableRateModal from "./DisableRateModal";

type RateFilters = { status: string | null; base: string | null };
const emptyFilters: RateFilters = { status: null, base: null };

const currencies = ["GBP", "USD", "EUR", "JPY", "CAD", "AUD", "CHF", "NGN"];
const statusColors: Record<RateStatus, [string, string]> = {
  Enabled: ["#E8FAF0", "#12B76A"], Disabled: ["#EAECF0", "#667085"],
  Pending: ["#FFFAE6", "#B86E00"], Scheduled: ["#FAFFE6", "#8AA600"],
};
function Asset({ name }: { name: string }) {
  // SVGs retain their intrinsic Figma dimensions.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/rate/${name}.svg`} alt="" aria-hidden="true" />;
}

export default function RatePage() {
  const [rates, setRates] = useState(initialRates);
  const [search, setSearch] = useState("");
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);
  const [appliedFilters, setAppliedFilters] = useState<RateFilters>(emptyFilters);
  const filterForm = useForm<RateFilters>({ initialValues: emptyFilters });
  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [editor, setEditor] = useState<"add" | RatePair | null>(null);
  const [disableTarget, setDisableTarget] = useState<RatePair | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [audit, setAudit] = useState<string[]>([]);
  const form = useForm({
    initialValues: { base: "GBP", quote: "NGN", rate: 1, adjustment: 0 },
    validate: {
      base: (value, values) => value === values.quote ? "Choose different currencies" : null,
      rate: value => Number.isFinite(value) && value > 0 ? null : "Enter a rate greater than zero",
      adjustment: value => Number.isFinite(value) && value > -100 ? null : "Adjustment must be greater than -100%",
    },
  });
  const filtered = rates.filter(row => `${row.base}/${row.quote}`.toLowerCase().includes(search.trim().toLowerCase()) && (!appliedFilters.status || row.status === appliedFilters.status) && (!appliedFilters.base || row.base === appliedFilters.base));
  const pageSize = Number(limit ?? 10);
  const visible = filtered.slice((active - 1) * pageSize, active * pageSize);
  const log = (message: string) => setAudit(items => [`${dayjs().format("DD MMM YYYY, HH:mm")} — ${message}`, ...items]);
  const toggle = (row: RatePair) => {
    if (row.status === "Pending") return;
    if (row.status === "Enabled" || row.status === "Scheduled") {
      setDisableTarget(row);
      return;
    }
    setRates(items => items.map(item => item === row ? { ...item, status: "Enabled" } : item));
    setActive(1);
    log(`${row.base}/${row.quote} enabled`);
  };
  const confirmDisable = (reason: string) => {
    if (!disableTarget || !reason.trim()) return;
    setRates(items => items.map(item => item === disableTarget ? { ...item, status: "Disabled" } : item));
    log(`${disableTarget.base}/${disableTarget.quote} disabled — ${reason.trim()}`);
    setActive(1);
    setDisableTarget(null);
  };
  const openEditor = (row?: RatePair) => {
    form.setValues(row ? { base: row.base, quote: row.quote, rate: row.rate, adjustment: row.adjustment } : { base: "GBP", quote: "NGN", rate: 1, adjustment: 0 });
    form.clearErrors();
    setEditor(row ?? "add");
  };
  const save = form.onSubmit(values => {
    if (rates.some(row => row !== editor && row.base === values.base && row.quote === values.quote)) {
      form.setFieldError("base", "This currency pair already exists");
      return;
    }
    const pair: RatePair = { ...values, finalRate: Number((values.rate * (1 + values.adjustment / 100)).toFixed(2)), status: "Pending", effective: dayjs().format("YYYY-MM-DD"), author: "Local preview" };
    setRates(items => editor === "add" ? [...items, pair] : items.map(item => item === editor ? pair : item));
    log(`${editor === "add" ? "Added" : "Updated"} ${pair.base}/${pair.quote} for approval`);
    setEditor(null);
    setActive(1);
  });
  const exportCsv = () => {
    const rows = [["Currency Pair", "Base Rate", "Adjustment (%)", "Final Rate", "Status", "Effective from", "Updated by"], ...filtered.map(row => [`${row.base}/${row.quote}`, row.rate, row.adjustment, row.finalRate, row.status, row.effective, row.author])];
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "rates.csv"; anchor.click();
    URL.revokeObjectURL(url);
  };
  const summaries = [
    ["Total pairs", rates.length], ["Enabled", rates.filter(row => row.status === "Enabled").length],
    ["Disabled", rates.filter(row => row.status === "Disabled").length], ["Pending Approval", rates.filter(row => row.status === "Pending").length],
  ];
  return (
    <Box className={classes.page}>
      <Flex className={classes.header} justify="space-between" align="center" gap={16} wrap="wrap">
        <Title order={2} fz={20} fw={500} c="var(--prune-text-gray-700)" style={{ fontFamily: "'EksellDisplay', serif" }}>Rates</Title>
        <Group gap={10}>
          <SecondaryBtn text="Audit Log" leftSection={<Asset name="audit" />} className={classes.secondary} action={() => setAuditOpen(true)} />
          <PrimaryBtn text="Add Pair" leftSection={<Asset name="add" />} h={48} px={32} fw={500} action={() => openEditor()} />
        </Group>
      </Flex>
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing={16} mt={48}>
        {summaries.map(([label, count]) => <Box key={label} className={classes.card}>
          <Text fz={14} lh={1} c="var(--prune-text-gray-500)">{label}</Text>
          <Text fz={24} fw={500} lh={1.2} mt={16}>{count}</Text>
        </Box>)}
      </SimpleGrid>
      <Box className={classes.compactInputs}>
        <Flex mt={32} gap={12} align="center" justify="space-between" wrap="wrap">
          <SearchInput aria-label="Search currency pairs" placeholder="Search" search={search} onChange={event => { setSearch(event.currentTarget.value); setActive(1); }} />
          <Group gap={12}>
            <SecondaryBtn
              text={filtersOpened ? "Close filter" : "Filter"}
              action={toggleFilters}
              icon={IconListTree}
              indicator={activeFilterCount}
              fw={600}
              fz={12}
              aria-expanded={filtersOpened}
              aria-controls="rate-filter-panel"
            />
            <SecondaryBtn text="Export CSV" icon={IconArrowUpRight} fz={12} action={exportCsv} />
          </Group>
        </Flex>
        <Box id="rate-filter-panel">
          <Filter<RateFilters>
            opened={filtersOpened}
            toggle={toggleFilters}
            form={filterForm}
            noDate
            stretch
            customStatusOption={Object.keys(statusColors)}
            onApply={values => { setAppliedFilters(values); setActive(1); }}
            onClear={() => { setAppliedFilters(emptyFilters); setActive(1); }}
          >
            <SelectBox
              aria-label="Filter by base currency"
              placeholder="Base currency"
              data={currencies}
              clearable
              {...filterForm.getInputProps("base")}
            />
          </Filter>
        </Box>
      </Box>
      <Box mt={24} className={classes.tableWrap}>
        <TableComponent loading={false} head={["", "Currency Pair", "Base Rate", "Adjustment", "Final Rate", "Status", "Effective from", "Actions"]} columnWidths={[51, undefined, 113, 114, 113, 120, 120, 93]} className={classes.table} rows={visible.map(row => <TableTr key={`${row.base}/${row.quote}`}>
          <TableTd><Switch aria-label={`Enable ${row.base}/${row.quote}`} checked={row.status === "Enabled" || row.status === "Scheduled"} disabled={row.status === "Pending"} onChange={() => toggle(row)} color="var(--prune-primary-600)" size="md" classNames={{ track: classes.switchTrack }} /></TableTd>
          <TableTd><Group gap={8} wrap="nowrap"><span className={classes.flags}><Asset name="gb" /><Asset name="ng" /></span><Box><Text fz={14} lh={1}>{row.base}/{row.quote}</Text><Text fz={12} lh={1.5} c="var(--prune-text-gray-500)">{row.rate} {row.quote} per 1 {row.base}</Text></Box></Group></TableTd>
          <TableTd>{row.rate.toFixed(2)}</TableTd>
          <TableTd>{row.adjustment === 0 ? "None" : <Badge className={classes.badge} bg={row.adjustment > 0 ? "#E8FAF0" : "#FFF3F0"} c={row.adjustment > 0 ? "#12B76A" : "#DB340B"}>{row.adjustment > 0 ? "+" : ""}{row.adjustment}%</Badge>}</TableTd>
          <TableTd><Text fz={14} fw={700}>{row.finalRate.toFixed(2)}</Text></TableTd>
          <TableTd><Badge className={classes.badge} bg={statusColors[row.status][0]} c={statusColors[row.status][1]}>{row.status}</Badge></TableTd>
          <TableTd><Text fz={14} lh={1}>{dayjs(row.effective).format("DD MMM YYYY")}</Text><Text fz={12} mt={4} c="var(--prune-text-gray-500)">by {row.author}</Text></TableTd>
          <TableTd><Menu position="bottom-end" withinPortal><Menu.Target><ActionIcon variant="transparent" w="100%" h={40} aria-label={`Actions for ${row.base}/${row.quote}`}><Asset name="more" /></ActionIcon></Menu.Target><Menu.Dropdown><Menu.Item onClick={() => openEditor(row)}>Edit pair</Menu.Item><Menu.Item disabled={row.status === "Pending"} onClick={() => toggle(row)}>{row.status === "Enabled" || row.status === "Scheduled" ? "Disable" : "Enable"} pair</Menu.Item></Menu.Dropdown></Menu></TableTd>
        </TableTr>)} />
        <EmptyTable rows={filtered} loading={false} title="No currency pairs found" text="Try another search or clear your filters." />
      </Box>
      <PaginationComponent active={active} setActive={setActive} limit={limit} setLimit={setLimit} total={Math.max(1, Math.ceil(filtered.length / pageSize))} />
      {disableTarget && <DisableRateModal
        pair={disableTarget}
        onClose={() => setDisableTarget(null)}
        onConfirm={confirmDisable}
      />}
      <Modal opened={editor !== null} onClose={() => setEditor(null)} title={editor === "add" ? "Add currency pair" : "Edit currency pair"} centered>
        <form onSubmit={save}><Stack>
          <Text fz={13} c="dimmed">Local preview: changes reset when this page is reloaded.</Text>
          <SelectBox label="Base currency" data={currencies} w="100%" h="auto" allowDeselect={false} {...form.getInputProps("base")} />
          <SelectBox label="Quote currency" data={currencies} w="100%" h="auto" allowDeselect={false} {...form.getInputProps("quote")} />
          <NumberInput label="Base rate" min={0.000001} decimalScale={6} {...form.getInputProps("rate")} />
          <NumberInput label="Adjustment (%)" min={-99.99} decimalScale={2} {...form.getInputProps("adjustment")} />
          <Group justify="flex-end"><SecondaryBtn text="Cancel" action={() => setEditor(null)} /><PrimaryBtn text="Save pair" type="submit" /></Group>
        </Stack></form>
      </Modal>
      <Modal opened={auditOpen} onClose={() => setAuditOpen(false)} title="Rate audit log" centered size="lg"><Stack>
        <Text fz={13} c="dimmed">Local preview activity for this session.</Text>
        {audit.length ? audit.map((entry, index) => <Text key={index} fz={14}>{entry}</Text>) : <Text fz={14}>No rate changes in this session.</Text>}
      </Stack></Modal>
    </Box>
  );
}
