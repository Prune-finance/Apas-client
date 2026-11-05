"use client";

import { useMemo, useState } from "react";
import { Box, Select, Skeleton, Text, UnstyledButton } from "@mantine/core";
import dayjs from "dayjs";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { ChangeStatus, ChartRange, formatRate, PairChart, useChangesQuery, usePairChart, useRatesMeta } from "@/lib/hooks/rates";
import classes from "./styles.module.scss";
import { AdminCell, DateRange, FilterDateRange, FilterSelect, Icon, Pill, rangeParams, Tone } from "./shared";

// Figma: Rate History tab (15678:366738)

const RANGES: { value: ChartRange; label: string }[] = [
  { value: "7D", label: "Last 7 Days" },
  { value: "30D", label: "Last 30 Days" },
  { value: "90D", label: "Last 90 Days" },
  { value: "1Y", label: "Last 1 Year" },
];

// Rate History badge per the integration guide
const STATUS: Record<ChangeStatus, { label: string; tone: Tone }> = {
  LIVE: { label: "Enabled", tone: ["#e8faf0", "#12b76a"] },
  SCHEDULED: { label: "Scheduled", tone: ["#fbfee6", "#97ad05"] },
  PENDING_APPROVAL: { label: "Pending", tone: ["#fff9e6", "#b26205"] },
  SUPERSEDED: { label: "Disabled", tone: ["#eaecf0", "#667085"] },
  REJECTED: { label: "Rejected", tone: ["#fff3f0", "#db340b"] },
};

const ADJUSTMENTS = [
  { value: "NONE", label: "No adjustment" },
  { value: "MARKUP", label: "Markup" },
  { value: "MARKDOWN", label: "Markdown" },
];

// Plot area matches Figma: 129px tall, 4 gridlines 40px apart, 4px inset for the points
const PLOT_H = 120;
const TOP = 4.5;

function FinalRateChart({ chart }: { chart: PairChart }) {
  const values = chart.points.map((p) => (p.finalRate === null ? null : Number(p.finalRate)));
  const known = values.filter((v): v is number => v !== null);

  const scale = useMemo(() => {
    if (!known.length) return null;
    let min = Math.min(...known);
    let max = Math.max(...known);
    if (min === max) { min -= 1; max += 1; }
    const pad = (max - min) * 0.1;
    min -= pad; max += pad;
    return { min, max, ticks: [3, 2, 1, 0].map((i) => min + ((max - min) * i) / 3) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  if (!scale) return <Box className={classes.chartEmpty}>No live rate in this period yet</Box>;

  const n = values.length;
  const x = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const y = (v: number) => TOP + PLOT_H - ((v - scale.min) / (scale.max - scale.min)) * PLOT_H;

  // Gaps where finalRate is null (days before the pair had a live rate)
  const segments: { i: number; v: number }[][] = [];
  values.forEach((v, i) => {
    if (v === null) return;
    const last = segments[segments.length - 1];
    if (last && last[last.length - 1].i === i - 1) last.push({ i, v });
    else segments.push([{ i, v }]);
  });

  // At most 9 date labels, like the design
  const step = Math.max(1, Math.ceil(n / 9));
  const labels = chart.points.filter((_, i) => i % step === 0 || i === n - 1);
  const fmt = (v: number) => Math.round(v).toLocaleString("en-GB");

  return (
    <Box className={classes.chartBody}>
      <Box className={classes.chartPlot}>
        <Box className={classes.chartAxis}>
          {scale.ticks.map((t, i) => <span key={i}>{fmt(t)}</span>)}
        </Box>
        <Box style={{ position: "relative", flex: 1, minWidth: 0, height: 129 }}>
          <svg className={classes.chartSvg} width="100%" height={129} viewBox="0 0 100 129" preserveAspectRatio="none" role="img"
            aria-label={`Final rate over time, ${chart.quote}`}>
            {[0, 40, 80, 120].map((g) => (
              <line key={g} x1={0} x2={100} y1={TOP + g} y2={TOP + g} stroke="#EAECF0" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            ))}
            {segments.map((seg, si) => {
              const d = seg.map((p, k) => `${k ? "L" : "M"}${x(p.i)},${y(p.v)}`).join(" ");
              const area = `${d} L${x(seg[seg.length - 1].i)},${TOP + PLOT_H} L${x(seg[0].i)},${TOP + PLOT_H} Z`;
              return (
                <g key={si}>
                    <path d={area} fill="#C1DD06" opacity={0.18} />
                    <path d={d} fill="none" stroke="#758604" strokeWidth={2.5} vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round" strokeLinecap="round" />
                </g>
              );
            })}
          </svg>
          {/* Points are HTML so they stay round while the SVG stretches to the width */}
          {segments.flat().map((p) => (
            <span key={p.i} title={`${chart.points[p.i].date}: ${chart.points[p.i].finalRate}`} style={{
              position: "absolute", left: `${x(p.i)}%`, top: y(p.v), width: 8, height: 8,
              transform: "translate(-50%, -50%)", borderRadius: "50%", background: "white",
              border: "2px solid #758604", boxSizing: "border-box",
            }} />
          ))}
        </Box>
      </Box>
      <Box className={classes.chartXAxis}>
        {labels.map((p) => <span key={p.date}>{dayjs(p.date).format("DD MMM")}</span>)}
      </Box>
    </Box>
  );
}

type Filters = { status: string | null; adminId: string | null; adjustment: string | null; range: DateRange };
const EMPTY: Filters = { status: null, adminId: null, adjustment: null, range: [null, null] };

export default function RateHistory({ pairId, quote, version, onReview }: {
  pairId: string;
  quote: string;
  version: number;
  onReview: (changeId: string) => void;
}) {
  const meta = useRatesMeta();
  const [range, setRange] = useState<ChartRange>("7D");
  const { chart, loading: chartLoading } = usePairChart(pairId, range, version);

  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => { setFilters((f) => ({ ...f, [key]: value })); setActive(1); };

  const { changes, meta: page, loading } = useChangesQuery({
    pairId,
    status: filters.status,
    adminId: filters.adminId,
    adjustment: filters.adjustment,
    ...rangeParams(filters.range),
    page: active,
    limit: Number(limit ?? 10),
  }, version);

  const effectiveSub = (c: (typeof changes)[number]) =>
    c.status === "LIVE" ? "→ Present"
      : c.status === "SUPERSEDED" ? `→ ${c.effectiveTo ? dayjs(c.effectiveTo).format("DD MMM HH:mm") : "-"}`
      : c.status === "REJECTED" ? "→ Never Live"
      : "→ Pending";

  return (
    <Box className={classes.historyTab}>
      {/* Final rate over time */}
      <Box className={classes.chartCard}>
        <Box className={classes.chartHead}>
          <Box>
            <Text className={classes.chartTitle}>Final rate over time</Text>
            <Text className={classes.chartSub}>
              {chart?.quote ?? quote}
              {chart ? ` · ${dayjs(chart.from).format("DD MMM")} – ${dayjs(chart.to).format("DD MMM YYYY")}` : ""}
            </Text>
          </Box>
          <Select className={classes.chartRange} data={RANGES} value={range} allowDeselect={false}
            onChange={(v) => v && setRange(v as ChartRange)} aria-label="Chart range"
            classNames={{ input: classes.rangeInput, section: classes.auditSection }}
            rightSection={<Icon name="chevron-down" />} rightSectionPointerEvents="none" rightSectionWidth={49} />
        </Box>
        {chartLoading && !chart ? <Skeleton h={149} radius={8} /> : chart ? <FinalRateChart chart={chart} /> : (
          <Box className={classes.chartEmpty}>Chart unavailable</Box>
        )}
      </Box>

      <Box className={classes.auditBody}>
        {/* Filters */}
        <Box className={classes.auditFilters}>
          <FilterSelect width={165} placeholder="All Statuses" aria-label="Filter by status"
            data={(meta?.changeStatuses ?? (Object.keys(STATUS) as ChangeStatus[])).map((s) => ({ value: s, label: STATUS[s]?.label ?? s }))}
            value={filters.status} onChange={(v) => set("status", v)} />
          <FilterDateRange value={filters.range} onChange={(v) => set("range", v)} />
          <FilterSelect width={188} placeholder="All Administrator" aria-label="Filter by administrator" searchable
            data={(meta?.administrators ?? []).map((a) => ({ value: a.id, label: a.name }))}
            value={filters.adminId} onChange={(v) => set("adminId", v)} />
          <FilterSelect width={172} placeholder="All Adjustment" aria-label="Filter by adjustment" data={ADJUSTMENTS}
            value={filters.adjustment} onChange={(v) => set("adjustment", v)} />
          <UnstyledButton className={classes.clearFilter} onClick={() => { setFilters(EMPTY); setActive(1); }}>
            Clear Filter
          </UnstyledButton>
        </Box>

        {/* History table */}
        <Box className={classes.historyTableWrap}>
          <table className={classes.auditTable}>
            <thead>
              <tr>
                <th className={classes.colTime}>Timestamp</th>
                <th style={{ width: 94 }}>Previous</th>
                <th className={classes.colPrev}>New Base</th>
                <th className={classes.colAdj}>Adjustment</th>
                <th className={classes.colFinal}>Final Rate</th>
                <th className={classes.colEffective}>Effective from</th>
                <th>Adminstrator</th>
                <th className={classes.colStatus}>Status</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c) => {
                const s = STATUS[c.status];
                const reviewable = c.status === "PENDING_APPROVAL";
                const adj = c.adjustment;
                return (
                  <tr key={c.id} data-row={reviewable || undefined} onClick={() => reviewable && onReview(c.id)}>
                    <td>
                      <span className={classes.cellStack}>
                        <span>{c.submittedBy?.at ? dayjs(c.submittedBy.at).format("DD MMM YYYY") : "-"}</span>
                        <span className={classes.cellSub}>{c.submittedBy?.at ? dayjs(c.submittedBy.at).format("HH:mm") : ""}</span>
                      </span>
                    </td>
                    <td>{formatRate(c.previous?.finalRate)}</td>
                    <td>{formatRate(c.baseRate)}</td>
                    <td>
                      {adj.label
                        ? <Pill tone={adj.type === "MARKDOWN" ? ["#fff3f0", "#db340b"] : ["#e8faf0", "#12b76a"]} label={adj.label} />
                        : "-"}
                    </td>
                    <td className={classes.strong}>{formatRate(c.finalRate)}</td>
                    <td>
                      <span className={classes.cellStack}>
                        <span>{c.effectiveFrom ? dayjs(c.effectiveFrom).format("DD MMM YYYY") : "On approval"}</span>
                        <span className={classes.cellSub}>{effectiveSub(c)}</span>
                      </span>
                    </td>
                    <td><AdminCell name={c.submittedBy?.name} /></td>
                    <td>{s && <Pill tone={s.tone} label={s.label} />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <EmptyTable rows={changes} loading={loading} title="No rate changes" text="Try another filter or date range." />
        </Box>

        <PaginationComponent active={active} setActive={setActive} limit={limit} setLimit={setLimit}
          total={Math.max(1, page?.totalPages ?? 1)} />
      </Box>
    </Box>
  );
}
