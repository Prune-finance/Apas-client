"use client";

import { useMemo, useState } from "react";
import { Box, Flex, Select, Skeleton, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { SelectBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { ChangeStatus, ChartRange, formatRate, PairChart, useChangesQuery, usePairChart, useRatesMeta } from "@/lib/hooks/rates";
import classes from "./styles.module.scss";
import { AdminCell, DateRange, Icon, Pill, rangeParams, Tone } from "./shared";

// Figma: Rate History tab (15678:366738)

// Labels for the chart ranges the API offers (meta.chartRanges)
const RANGE_LABEL: Record<string, string> = {
  "7D": "Last 7 Days", "30D": "Last 30 Days", "90D": "Last 90 Days", "1Y": "Last 1 Year",
};
const DEFAULT_RANGES: ChartRange[] = ["7D", "30D", "90D", "1Y"];

// Rate History badge per the integration guide
const STATUS: Record<ChangeStatus, { label: string; tone: Tone }> = {
  LIVE: { label: "Enabled", tone: ["#e8faf0", "#12b76a"] },
  SCHEDULED: { label: "Scheduled", tone: ["#fbfee6", "#97ad05"] },
  PENDING_APPROVAL: { label: "Pending", tone: ["#fff9e6", "#b26205"] },
  SUPERSEDED: { label: "Disabled", tone: ["#eaecf0", "#667085"] },
  REJECTED: { label: "Rejected", tone: ["#fff3f0", "#db340b"] },
};

const ADJUSTMENT_FILTER_LABEL: Record<string, string> = { NONE: "No adjustment", MARKUP: "Markup", MARKDOWN: "Markdown" };

// Plot area matches Figma: 129px tall, 4 gridlines 40px apart, 4px inset for the points
const PLOT_H = 120;
const TOP = 4.5;

function FinalRateChart({ chart }: { chart: PairChart }) {
  // The API sends a point only when the rate changed (e.g. 09 Dec, 12 Dec in a 7-day range),
  // so points are placed by date across from → to, not spaced evenly
  const start = dayjs(chart.from).startOf("day").valueOf();
  const end = Math.max(dayjs(chart.to).valueOf(), start + 1);
  const pts = chart.points
    .filter((p): p is { date: string; finalRate: string } => p.finalRate !== null)
    .map((p) => ({ date: p.date, at: dayjs(p.date).valueOf(), v: Number(p.finalRate), raw: p.finalRate }))
    .sort((a, b) => a.at - b.at);

  const scale = useMemo(() => {
    if (!pts.length) return null;
    let min = Math.min(...pts.map((p) => p.v));
    let max = Math.max(...pts.map((p) => p.v));
    if (min === max) { min -= 1; max += 1; }
    const pad = (max - min) * 0.1;
    min -= pad; max += pad;
    return { min, max, ticks: [3, 2, 1, 0].map((i) => min + ((max - min) * i) / 3) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  if (!scale) return <Box className={classes.chartEmpty}>No live rate in this period yet</Box>;

  const x = (at: number) => Math.min(100, Math.max(0, ((at - start) / (end - start)) * 100));
  const y = (v: number) => TOP + PLOT_H - ((v - scale.min) / (scale.max - scale.min)) * PLOT_H;

  // A rate stays live until the next change, so the line carries the last value to the end of the range
  const line = [...pts.map((p) => ({ x: x(p.at), y: y(p.v) })), { x: 100, y: y(pts[pts.length - 1].v) }];
  const d = line.map((p, k) => `${k ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const area = `${d} L100,${TOP + PLOT_H} L${line[0].x},${TOP + PLOT_H} Z`;

  // Up to 9 evenly spaced date labels across the range, like the design
  const days = Math.max(1, Math.round((end - start) / 86_400_000));
  const count = Math.min(9, days + 1);
  const labels = Array.from({ length: count }, (_, i) => dayjs(start + ((end - start) * i) / Math.max(1, count - 1)));
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
            <path d={area} fill="#C1DD06" opacity={0.18} />
            <path d={d} fill="none" stroke="#758604" strokeWidth={2.5} vectorEffect="non-scaling-stroke"
              strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          {/* Points are HTML so they stay round while the SVG stretches to the width */}
          {pts.map((p) => (
            <span key={p.date} title={`${dayjs(p.date).format("DD MMM YYYY")}: ${formatRate(p.raw)}`} style={{
              position: "absolute", left: `${x(p.at)}%`, top: y(p.v), width: 8, height: 8,
              transform: "translate(-50%, -50%)", borderRadius: "50%", background: "white",
              border: "2px solid #758604", boxSizing: "border-box",
            }} />
          ))}
        </Box>
      </Box>
      <Box className={classes.chartXAxis}>
        {labels.map((l, i) => <span key={i}>{l.format("DD MMM")}</span>)}
      </Box>
    </Box>
  );
}

// `status` and `createdAt` are the shared Filter panel's built-in status and date range fields
type Filters = { status: string | null; adminId: string | null; adjustment: string | null; createdAt: DateRange };
const EMPTY: Filters = { status: null, adminId: null, adjustment: null, createdAt: [null, null] };

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
  const filterForm = useForm<Filters>({ initialValues: EMPTY });
  const [filtersOpened, { toggle: toggleFilters }] = useDisclosure(false);
  const activeFilterCount = [filters.status, filters.adminId, filters.adjustment, filters.createdAt[0]].filter(Boolean).length;

  const { changes, meta: page, loading } = useChangesQuery({
    pairId,
    status: filters.status,
    adminId: filters.adminId,
    adjustment: filters.adjustment,
    ...rangeParams(filters.createdAt),
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
          <Select className={classes.chartRange} data={(meta?.chartRanges ?? DEFAULT_RANGES).map((r) => ({ value: r, label: RANGE_LABEL[r] ?? r }))} value={range} allowDeselect={false}
            onChange={(v) => v && setRange(v as ChartRange)} aria-label="Chart range"
            classNames={{ input: classes.rangeInput, section: classes.auditSection }}
            rightSection={<Icon name="chevron-down" />} rightSectionPointerEvents="none" rightSectionWidth={49} />
        </Box>
        {chartLoading && !chart ? <Skeleton h={149} radius={8} /> : chart ? <FinalRateChart chart={chart} /> : (
          <Box className={classes.chartEmpty}>Chart unavailable</Box>
        )}
      </Box>

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
          customStatusOption={(meta?.changeStatuses ?? (Object.keys(STATUS) as ChangeStatus[])).map((s) => ({ value: s, label: STATUS[s]?.label ?? s }))}
          onApply={(values) => { setFilters(values); setActive(1); }}
          onClear={() => { setFilters(EMPTY); setActive(1); }}
        >
          <SelectBox placeholder="Administrator" clearable searchable
            data={(meta?.administrators ?? []).map((a) => ({ value: a.id, label: a.name }))}
            {...filterForm.getInputProps("adminId")} />
          <SelectBox placeholder="Adjustment" clearable
            data={(meta?.adjustmentTypes ?? ["NONE", "MARKUP", "MARKDOWN"]).map((t) => ({ value: t, label: ADJUSTMENT_FILTER_LABEL[t] ?? t }))}
            {...filterForm.getInputProps("adjustment")} />
        </Filter>

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
