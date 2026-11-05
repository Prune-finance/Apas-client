"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Skeleton, Text, UnstyledButton } from "@mantine/core";
import dayjs from "dayjs";
import EmptyTable from "@/ui/components/EmptyTable";
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
  FilterDateRange,
  FilterSelect,
  formatChangeValue,
  GREY,
  Icon,
  Pill,
  rangeParams,
} from "./shared";

// Figma: Audit Trail tab (15679:368530) — also used by the Audit log page

type Filters = { event: string | null; adminId: string | null; channel: string | null; range: DateRange };
const EMPTY: Filters = { event: null, adminId: null, channel: null, range: [null, null] };

// Same round flags as the Rates table (Figma 15677:340996)
const flagStyle = {
  borderRadius: "50%", objectFit: "cover" as const, width: 24, height: 24, boxShadow: "0 0 0 2px #fff", background: "#fff",
};

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
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [openId, setOpenId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setActive(1);
  };

  const query: AuditFilterQuery = {
    pairId: pairId ?? null,
    event: filters.event,
    adminId: filters.adminId,
    channel: filters.channel,
    ...rangeParams(filters.range),
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
        {/* Filters */}
        <Box className={classes.auditFilters}>
          <FilterSelect width={165} placeholder="All Events" aria-label="Filter by event"
            data={(meta?.auditEvents ?? []).map((e) => ({ value: e.value, label: e.label }))}
            value={filters.event} onChange={(v) => set("event", v)} />
          <FilterDateRange value={filters.range} onChange={(v) => set("range", v)} />
          <FilterSelect width={188} placeholder="All Administrator" aria-label="Filter by administrator" searchable
            data={(meta?.administrators ?? []).map((a) => ({ value: a.id, label: a.name }))}
            value={filters.adminId} onChange={(v) => set("adminId", v)} />
          <FilterSelect width={172} placeholder="All Channel" aria-label="Filter by channel"
            data={(meta?.channels ?? []).map((c) => ({ value: c.value, label: c.label }))}
            value={filters.channel} onChange={(v) => set("channel", v)} />
          <UnstyledButton className={classes.clearFilter} onClick={() => { setFilters(EMPTY); setActive(1); }}>
            Clear Filter
          </UnstyledButton>
        </Box>

        {/* Table — click a row to expand "What changed" / "Event metadata" */}
        <Box className={classes.auditTableWrap}>
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
                                <CountryFlag code={base!} size={24} style={flagStyle} />
                                <CountryFlag code={target!} size={24} style={flagStyle} />
                              </span>
                              {log.pair.code}
                            </Link>
                          ) : (
                            <span className={classes.pairCell}>
                              {log.currencyCode && <CountryFlag code={log.currencyCode} size={24} style={flagStyle} />}
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
