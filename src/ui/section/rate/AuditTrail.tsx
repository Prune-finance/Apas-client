"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Flex, LoadingOverlay, Skeleton, Text, UnstyledButton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { SelectBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import CountryFlag from "@/ui/components/CountryFlag";
import { AuditLogRow, AuditQuery, formatRate, useAuditLogPage, useRatesMeta } from "@/lib/hooks/rates";
import classes from "./styles.module.scss";
import AuditEventDrawer from "./Drawers/AuditEventDrawer";
import {
  AdminCell,
  CHANNEL,
  DateRange,
  EVENT_TONE,
  formatChangeValue,
  GREY,
  Icon,
  Pill,
  rangeParams,
} from "./shared";

// Figma: Audit Trail tab (15679:368530) — also used by the Audit log page

// `createdAt` is the shared Filter panel's date range field
type Filters = { event: string | null; adminId: string | null; channel: string | null; createdAt: DateRange };
const EMPTY: Filters = { event: null, adminId: null, channel: null, createdAt: [null, null] };

// Same round flags as the Rates table (Figma 15677:340996)
const flagStyle = { width: 24, height: 24, borderRadius: "50%", boxShadow: "0 0 0 2px #fff", background: "#fff" };

function ExpandedRow({ log, colSpan, onView }: { log: AuditLogRow; colSpan: number; onView: () => void }) {
  const m = log.metadata;
  const stamp = (x?: { name: string; at: string } | null) => (x ? `${x.name} · ${dayjs(x.at).format("DD MMM, HH:mm")}` : "-");
  return (
    <tr>
      <td colSpan={colSpan} className={classes.expandCell}>
        <Box className={classes.expandBox}>
          <Box className={classes.whatChanged}>
            <span className={classes.expandTitle}>What changed</span>
            <Box className={classes.changeGrid}>
              <span className={classes.changeHead}>Field</span>
              <span className={classes.changeHead}>Before</span>
              <span className={classes.changeHead}>After</span>
              {(log.changes ?? []).map((c) => (
                <Fragment key={c.field}>
                  <span className={classes.changeLabel}>{c.label}</span>
                  <span className={c.changed ? classes.changeBefore : classes.changeSameMuted}>{formatChangeValue(c.field, c.before)}</span>
                  <span className={c.changed ? classes.changeAfter : classes.changeSame}>{formatChangeValue(c.field, c.after)}</span>
                </Fragment>
              ))}
            </Box>
          </Box>
          <span className={classes.expandDivider} />
          <Box className={classes.eventMeta}>
            <Text className={classes.eventMetaTitle}>Event metadata</Text>
            <Box className={classes.metaGrid}>
              <span className={classes.metaLabel}>Event ID</span>
              <span className={classes.metaValue}>{m?.eventId ?? log.eventId}</span>
              <span className={classes.metaLabel}>Maker</span>
              <span className={classes.metaValue}>{stamp(m?.maker)}</span>
              <span className={classes.metaLabel}>Checker</span>
              <span className={classes.metaValue}>{stamp(m?.checker)}</span>
              <span className={classes.metaLabel}>Source</span>
              <span className={classes.metaValue}>{[m?.source, m?.ipAddress].filter(Boolean).join(" · ") || "-"}</span>
              <span className={classes.metaLabel}>Request ID</span>
              <span className={classes.metaValue}>{m?.requestId ?? "-"}</span>
            </Box>
            <UnstyledButton className={classes.viewEventBtn} onClick={onView}>
              View full event <Icon name="arrow-right-16" />
            </UnstyledButton>
          </Box>
        </Box>
      </td>
    </tr>
  );
}

export type AuditFilterQuery = Omit<AuditQuery, "page" | "limit">;

export default function AuditTrail({ pairId, showPair, showStats = true, onQueryChange }: {
  pairId?: string;
  showPair?: boolean;
  /** The pair tab shows the stat cards; the Audit log page (Figma 15681:373066) doesn't */
  showStats?: boolean;
  /** Current filters, e.g. for the page's Export button */
  onQueryChange?: (query: AuditFilterQuery) => void;
}) {
  const meta = useRatesMeta();
  // Audit rows only carry currency codes (NGN, CAD); the flag needs the country (NG, CA) from /meta
  const flagCode = (currency: string) =>
    meta?.currencies.find((c) => c.code === currency)?.countryCode ?? currency;
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const filterForm = useForm<Filters>({ initialValues: EMPTY });
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);
  const activeFilterCount = [filters.event, filters.adminId, filters.channel, filters.createdAt[0]].filter(Boolean).length;
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [openId, setOpenId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  const query: AuditFilterQuery = {
    pairId: pairId ?? null,
    event: filters.event,
    adminId: filters.adminId,
    channel: filters.channel,
    ...rangeParams(filters.createdAt),
  };
  const queryKey = JSON.stringify(query);
  useEffect(() => {
    onQueryChange?.(JSON.parse(queryKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const { logs, meta: page, loading } = useAuditLogPage({ ...query, page: active, limit: Number(limit ?? 10) });
  const stats = page?.stats;
  const colSpan = showPair ? 7 : 6;

  return (
    <Box className={classes.auditTrail}>
      {/* Cards (stats always cover every event for this scope) */}
      {showStats && <Box className={classes.statRow}>
        {[
          // Missing stats show 0 (or "-" for the date) once loading is done
          ["Total events", String(stats?.totalEvents ?? 0)],
          // The API returns a date here, not a count (integration guide §12)
          ["Last change", stats?.lastChangeAt ? dayjs(stats.lastChangeAt).format("DD MMM YYYY") : "-"],
          ["Made via API", String(stats?.viaApi ?? 0)],
        ].map(([label, value]) => (
          <Box key={label} className={classes.statCard}>
            <span className={classes.statLabel}>{label}</span>
            {loading && !stats ? <Skeleton h={29} w={60} /> : <span className={classes.statValue}>{value}</span>}
          </Box>
        ))}
      </Box>}

      <Box className={classes.auditBody}>
        {/* Filters: the shared slide-in Filter panel */}
        <Flex justify="flex-end">
          <SecondaryBtn text="Filter" action={toggleFilters} icon={IconListTree} indicator={activeFilterCount}
            fw={600} fz={12} />
        </Flex>
        <Filter<Filters>
          opened={filtersOpened}
          toggle={toggleFilters}
          form={filterForm}
          isStatus
          onApply={(values) => { setFilters(values); setActive(1); }}
          onClear={() => { setFilters(EMPTY); setActive(1); }}
        >
          <SelectBox placeholder="Event" clearable
            data={(meta?.auditEvents ?? []).map((e) => ({ value: e.value, label: e.label }))}
            {...filterForm.getInputProps("event")} />
          <SelectBox placeholder="Administrator" clearable searchable
            data={(meta?.administrators ?? []).map((a) => ({ value: a.id, label: a.name }))}
            {...filterForm.getInputProps("adminId")} />
          <SelectBox placeholder="Channel" clearable
            data={(meta?.channels ?? []).map((c) => ({ value: c.value, label: c.label }))}
            {...filterForm.getInputProps("channel")} />
        </Filter>

        {/* Table — click a row to expand "What changed" / "Event metadata" */}
        {/* Loader over the table while GET /audit-logs runs (first load, filters, paging) */}
        <Box className={classes.auditTableWrap} pos="relative" mih={loading && !logs.length ? 200 : undefined}>
          <LoadingOverlay visible={loading} zIndex={10} overlayProps={{ radius: "sm", blur: 1 }}
            loaderProps={{ size: "md", color: "var(--prune-primary-600)" }} />
          <table className={classes.auditTable}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th className={classes.colChannel}>Event</th>
                {showPair && <th>Currency Pair</th>}
                <th style={{ width: 104 }}>{showPair ? "Previous value" : "Previous"}</th>
                <th>{showPair ? "New value" : "Final Rate"}</th>
                <th>Adminstrator</th>
                <th className={classes.colChannel}>Channel</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const open = openId === log.id;
                const channel = CHANNEL[log.channel] ?? { tone: GREY, label: log.channel };
                const [base, target] = log.pair
                  ? [log.pair.baseCurrency ?? log.pair.code.split("/")[0], log.pair.targetCurrency ?? log.pair.code.split("/")[1]]
                  : [];
                return (
                  <Fragment key={log.id}>
                    <tr data-row data-open={open || undefined} aria-expanded={open}
                      onClick={() => setOpenId(open ? null : log.id)}>
                      <td>
                        <span className={classes.cellStack}>
                          <span>{dayjs(log.createdAt).format("DD MMM YYYY")}</span>
                          <span className={classes.cellSub}>{dayjs(log.createdAt).format("HH:mm")}</span>
                        </span>
                      </td>
                      <td><Pill tone={EVENT_TONE[log.event] ?? GREY} label={log.eventLabel} /></td>
                      {showPair && (
                        <td>
                          {log.pair ? (
                            <Link href={`/admin/rate/${log.pair.id}`} className={classes.pairCell}
                              style={{ color: "inherit", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                              <span className={classes.flagGroup}>
                                <CountryFlag code={flagCode(base!)} size={24} round style={flagStyle} />
                                <CountryFlag code={flagCode(target!)} size={24} round style={flagStyle} />
                              </span>
                              {log.pair.code}
                            </Link>
                          ) : (
                            <span className={classes.pairCell}>
                              {log.currencyCode && <CountryFlag code={flagCode(log.currencyCode)} size={24} round style={flagStyle} />}
                              {log.currencyCode ?? "-"}
                            </span>
                          )}
                        </td>
                      )}
                      <td>{formatRate(log.previousValue)}</td>
                      <td className={classes.strong}>{formatRate(log.newValue)}</td>
                      <td><AdminCell name={log.actor?.name} /></td>
                      <td><Pill tone={channel.tone} label={channel.label} /></td>
                    </tr>
                    {open && <ExpandedRow log={log} colSpan={colSpan} onView={() => setEventId(log.id)} />}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          <EmptyTable rows={logs} loading={loading} title="No audit events" text="Try another filter or date range." />
        </Box>

        <PaginationComponent active={active} setActive={setActive} limit={limit} setLimit={setLimit}
          total={Math.max(1, page?.totalPages ?? 1)} />
      </Box>

      <AuditEventDrawer eventId={eventId} onClose={() => setEventId(null)} />
    </Box>
  );
}
