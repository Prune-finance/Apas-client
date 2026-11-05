"use client";

import { useState } from "react";
import Link from "next/link";
import { ActionIcon, Badge, Box, Flex, Group, Menu, SimpleGrid, Skeleton, Switch, TableTd, TableTr, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconArrowUpRight, IconFileText, IconListTree, IconPlus } from "@tabler/icons-react";
import Filter from "@/ui/components/Filter";
import dayjs from "dayjs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SearchInput, SelectBox } from "@/ui/components/Inputs";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import CountryFlag from "@/ui/components/CountryFlag";
import useNotification from "@/lib/hooks/notification";
import { apiMessage, formatRate, PairStatus, RatePairRow, ratesAxios, useRatePairs, useRatesMeta } from "@/lib/hooks/rates";
import classes from "@/ui/section/rate/styles.module.scss";
import DisableRateModal from "@/ui/section/rate/Modals/DisableRateModal";
import EnablePairModal from "@/ui/section/rate/Modals/EnablePairModal";
import RateToast, { useRateToast } from "@/ui/section/rate/RateToast";
import SetRateDrawer from "@/ui/section/rate/Drawers/SetRateDrawer";
import ReviewChangeDrawer from "@/ui/section/rate/Drawers/ReviewChangeDrawer";
import AddPairModal from "@/ui/section/rate/Modals/AddPairModal";

type RateFilters = { status: string | null; base: string | null };
const emptyFilters: RateFilters = { status: null, base: null };

const statusColors: Record<PairStatus, [string, string]> = {
  ENABLED: ["#E8FAF0", "#12B76A"], DISABLED: ["#EAECF0", "#667085"],
  PENDING: ["#FFFAE6", "#B86E00"], SCHEDULED: ["#FAFFE6", "#8AA600"],
};
const statusLabel = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

function Asset({ name }: { name: string }) {
  // SVGs retain their intrinsic Figma dimensions.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/rate/${name}.svg`} alt="" aria-hidden="true" />;
}

export default function RatePage() {
  const { handleSuccess, handleError } = useNotification();
  const ratesMeta = useRatesMeta();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);
  const [appliedFilters, setAppliedFilters] = useState<RateFilters>(emptyFilters);
  const filterForm = useForm<RateFilters>({ initialValues: emptyFilters });
  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { pairs, meta, loading, revalidate } = useRatePairs({
    status: appliedFilters.status,
    base: appliedFilters.base,
    search: debouncedSearch.trim(),
    page: active,
    limit: Number(limit ?? 10),
  });

  const [addOpen, setAddOpen] = useState(false);
  const [rateTarget, setRateTarget] = useState<RatePairRow | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [disableTarget, setDisableTarget] = useState<RatePairRow | null>(null);
  const [enableTarget, setEnableTarget] = useState<RatePairRow | null>(null);
  const { toast, show: showToast, hide: hideToast } = useRateToast();
  const [toggling, setToggling] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Row switch: both directions ask for a reason first
  const setEnabled = async (row: RatePairRow, enabled: boolean, reason?: string) => {
    setToggling(row.id);
    try {
      await ratesAxios.patch(`/pairs/${row.id}/status`, { enabled, ...(reason ? { reason } : {}) });
      handleSuccess(enabled ? "Pair enabled" : "Pair disabled", `${row.code} is now ${enabled ? "enabled" : "disabled"}.`);
      setDisableTarget(null);
      setEnableTarget(null);
      revalidate();
    } catch (error) {
      handleError(`Could not ${enabled ? "enable" : "disable"} ${row.code}`, apiMessage(error));
    } finally {
      setToggling(null);
    }
  };
  const toggle = (row: RatePairRow) => (row.enabled ? setDisableTarget(row) : setEnableTarget(row));

  const exportFile = async () => {
    setExporting(true);
    try {
      const { data } = await ratesAxios.get("/pairs/export", {
        params: Object.fromEntries(
          Object.entries({ ...appliedFilters, search: debouncedSearch.trim() }).filter(([, v]) => v)
        ),
      });
      if (data.data?.url) window.open(data.data.url, "_blank", "noopener");
      else handleError("Nothing to export", data.message ?? "No pairs match the current filters.");
    } catch (error) {
      handleError("Export failed", apiMessage(error));
    } finally {
      setExporting(false);
    }
  };

  const stats = meta?.stats;
  const summaries: [string, number | undefined][] = [
    ["Total pairs", stats?.totalPairs], ["Enabled", stats?.enabled],
    ["Disabled", stats?.disabled], ["Pending Approval", stats?.pendingApprovals],
  ];

  return (
    <Box className={classes.page}>
      {/* Same header as Eligibility Center */}
      <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
        <Box>
          <Title order={2} fw={700}>
            Rates
          </Title>
          <Text fz={14} c="var(--prune-text-gray-500)" mt={4}>
            View and manage all currency pairs and their rates on the platform.
          </Text>
        </Box>
        <Group gap={10}>
          <SecondaryBtn text="Audit Log" icon={IconFileText} link="/admin/rate/audit-log" fw={600} fz={14} />
          <PrimaryBtn text="Add Pair" icon={IconPlus} action={() => setAddOpen(true)} fw={600} fz={14} />
        </Group>
      </Flex>

      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing={16} mt={48}>
        {summaries.map(([label, count]) => <Box key={label} className={classes.card}>
          <Text fz={14} lh={1} c="var(--prune-text-gray-500)">{label}</Text>
          {stats ? <Text fz={24} fw={500} lh={1.2} mt={16}>{count ?? 0}</Text> : <Skeleton h={28} w={48} mt={16} />}
        </Box>)}
      </SimpleGrid>

      <Box className={classes.compactInputs}>
        <Flex mt={32} gap={12} align="center" justify="space-between" wrap="wrap">
          <SearchInput aria-label="Search currency pairs" placeholder="Search e.g. GBP/NGN" search={search}
            onChange={event => { setSearch(event.currentTarget.value); setActive(1); }} />
          <Group gap={12}>
            <SecondaryBtn
              text="Filter"
              action={toggleFilters}
              icon={IconListTree}
              indicator={activeFilterCount}
              fw={600}
              fz={12}
              aria-expanded={filtersOpened}
              aria-controls="rate-filter-panel"
            />
            {/* The server builds an .xlsx file */}
            <SecondaryBtn text="Export" icon={IconArrowUpRight} fz={12} action={exportFile} loading={exporting} />
          </Group>
        </Flex>
        <Box id="rate-filter-panel">
          <Filter<RateFilters>
            opened={filtersOpened}
            toggle={toggleFilters}
            form={filterForm}
            noDate
            stretch
            customStatusOption={(ratesMeta?.pairStatuses ?? (Object.keys(statusColors) as PairStatus[])).map(s => ({ value: s, label: statusLabel(s) }))}
            onApply={values => { setAppliedFilters(values); setActive(1); }}
            onClear={() => { setAppliedFilters(emptyFilters); setActive(1); }}
          >
            <SelectBox
              aria-label="Filter by base currency"
              placeholder="Base currency"
              data={(ratesMeta?.baseCurrencies ?? []).map(c => ({ value: c.code, label: `${c.code} — ${c.name}` }))}
              clearable
              searchable
              {...filterForm.getInputProps("base")}
            />
          </Filter>
        </Box>
      </Box>

      <Box mt={24} className={classes.tableWrap}>
        <TableComponent loading={loading} head={["", "Currency Pair", "Base Rate", "Adjustment", "Final Rate", "Status", "Effective from", "Actions"]} columnWidths={[51, undefined, 113, 114, 113, 120, 120, 93]} className={classes.table} rows={pairs.map(row => {
          // `rate` is the latest change, which may still be pending or scheduled;
          // `liveFinalRate` is what transactions use right now
          const rate = row.rate;
          const adjustment = rate?.adjustment;
          const proposed = rate && rate.status !== "LIVE";
          const proposedNote = rate?.status === "SCHEDULED" ? "Scheduled" : "Proposed";
          return <TableTr key={row.id}>
            <TableTd>
              <Switch aria-label={`${row.enabled ? "Disable" : "Enable"} ${row.code}`} checked={row.enabled}
                disabled={toggling === row.id} onChange={() => toggle(row)} color="var(--prune-primary-600)" size="md" classNames={{ track: classes.switchTrack }} />
            </TableTd>
            <TableTd>
              <Link href={`/admin/rate/${row.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              <Group gap={8} wrap="nowrap">
                <span className={classes.flags}>
                  {row.baseCurrency.countryCode && <CountryFlag code={row.baseCurrency.countryCode} size={20} />}
                  {row.targetCurrency.countryCode && <CountryFlag code={row.targetCurrency.countryCode} size={20} />}
                </span>
                <Box>
                  <Text fz={14} lh={1}>{row.code}</Text>
                  <Text fz={12} lh={1.5} c="var(--prune-text-gray-500)">{row.quote}</Text>
                </Box>
              </Group>
              </Link>
            </TableTd>
            {/* Rates are strings from the API — shown as-is, never recalculated */}
            <TableTd>
              <Text fz={14} lh={1}>{rate ? formatRate(rate.baseRate) : "—"}</Text>
              {proposed && <Text fz={12} mt={4} c="var(--prune-text-gray-500)">{proposedNote}</Text>}
            </TableTd>
            <TableTd>
              {!adjustment?.label ? "None" : (
                <Badge className={classes.badge}
                  bg={adjustment.type === "MARKDOWN" ? "#FFF3F0" : "#E8FAF0"}
                  c={adjustment.type === "MARKDOWN" ? "#DB340B" : "#12B76A"}>
                  {adjustment.label}
                </Badge>
              )}
            </TableTd>
            <TableTd>
              <Text fz={14} fw={700} lh={1}>{row.liveFinalRate ? formatRate(row.liveFinalRate) : "—"}</Text>
              {proposed && <Text fz={12} mt={4} c="var(--prune-text-gray-500)">{proposedNote}: {formatRate(rate.finalRate)}</Text>}
            </TableTd>
            <TableTd>
              <Badge className={classes.badge} bg={statusColors[row.status]?.[0]} c={statusColors[row.status]?.[1]}>
                {statusLabel(row.status)}
              </Badge>
            </TableTd>
            <TableTd>
              <Text fz={14} lh={1}>
                {rate ? (rate.effectiveFrom ? dayjs(rate.effectiveFrom).format("DD MMM YYYY") : "On approval") : "—"}
              </Text>
              {rate?.submittedBy?.name && <Text fz={12} mt={4} c="var(--prune-text-gray-500)">by {rate.submittedBy.name}</Text>}
            </TableTd>
            <TableTd>
              <Menu position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon variant="transparent" w="100%" h={40} aria-label={`Actions for ${row.code}`}><Asset name="more" /></ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {/* Only one pending change per pair: offer Review instead of Set rate */}
                  {row.pendingChangeId
                    ? <Menu.Item onClick={() => setReviewId(row.pendingChangeId)}>Review pending change</Menu.Item>
                    : <Menu.Item onClick={() => setRateTarget(row)}>Set rate</Menu.Item>}
                  <Menu.Item component={Link} href={`/admin/rate/${row.id}`}>View pair</Menu.Item>
                  <Menu.Item onClick={() => toggle(row)}>{row.enabled ? "Disable" : "Enable"} pair</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </TableTd>
          </TableTr>;
        })} />
        <EmptyTable rows={pairs} loading={loading} title="No currency pairs found" text="Try another search or clear your filters." />
      </Box>

      <PaginationComponent active={active} setActive={setActive} limit={limit} setLimit={setLimit}
        total={Math.max(1, meta?.totalPages ?? 1)} />

      {disableTarget && <DisableRateModal
        pair={{ code: disableTarget.code, statusLabel: statusLabel(disableTarget.status) }}
        processing={toggling === disableTarget.id}
        onClose={() => setDisableTarget(null)}
        onConfirm={reason => setEnabled(disableTarget, false, reason)}
      />}
      <AddPairModal opened={addOpen} onClose={() => setAddOpen(false)} meta={ratesMeta} onCreated={revalidate} />
      <EnablePairModal processing={!!enableTarget && toggling === enableTarget.id}
        pair={enableTarget && {
          code: enableTarget.code,
          statusLabel: statusLabel(enableTarget.status),
          hasLiveRate: enableTarget.rate?.status === "LIVE" || !!enableTarget.liveFinalRate,
        }}
        onClose={() => setEnableTarget(null)}
        onConfirm={reason => enableTarget && setEnabled(enableTarget, true, reason)} />
      <SetRateDrawer pair={rateTarget} onClose={() => setRateTarget(null)} onSubmitted={revalidate}
        notify={showToast} requiresApproval={ratesMeta?.makerCheckerEnabled ?? true} />
      <RateToast toast={toast} onClose={hideToast} />
      <ReviewChangeDrawer changeId={reviewId} onClose={() => setReviewId(null)} onReviewed={revalidate} />
    </Box>
  );
}
