import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import createAxiosInstance, { BASEURL } from "@/lib/axios";

// Rates lives on the accounts service under /v2/rates (the accounts base URL is /v1)
const accountsRoot = (BASEURL.accounts ?? "").replace(/\/v\d+\/?$/, "");
export const ratesAxios = createAxiosInstance("accounts");
ratesAxios.defaults.baseURL = `${accountsRoot}/v2/rates`;

// 401 = not signed in as an admin: send them to sign in, then back to this page
ratesAxios.interceptors.response.use(undefined, (error) => {
  if (isAxiosError(error) && error.response?.status === 401 && typeof window !== "undefined") {
    const back = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/auth/admin/login?redirect=${back}`;
  }
  return Promise.reject(error);
});

// ─── Shapes (see "Prune Rates - Frontend Integration Guide") ────────────────

export interface RateCurrency {
  code: string;
  name: string;
  symbol: string;
  countryCode: string | null;
  remittanceEnabled?: boolean;
  conversionInboundEnabled?: boolean;
  conversionOutboundEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  /** Pairs using this currency; a currency in use can't be deleted */
  pairCount?: number;
  canDelete?: boolean;
}

export type CurrencyFlags = Pick<RateCurrency, "remittanceEnabled" | "conversionInboundEnabled" | "conversionOutboundEnabled">;

export interface CurrencyQuery {
  search?: string;
  /** The API takes the strings "true" / "false" */
  remittance?: string | null;
  conversionInbound?: string | null;
  conversionOutbound?: string | null;
  page: number;
  limit: number;
}

/** Settings › Rate Currencies table: GET /currencies, one page at a time. */
export function useCurrencyList(query: CurrencyQuery) {
  const [currencies, setCurrencies] = useState<RateCurrency[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(query);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await ratesAxios.get("/currencies", { params: clean(JSON.parse(key)) });
      setCurrencies(data.data ?? []);
      setMeta(data.meta ?? null);
    } catch {
      setCurrencies([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { fetchList(); }, [fetchList]);
  return { currencies, meta, loading, revalidate: fetchList };
}

export type PairStatus = "ENABLED" | "DISABLED" | "PENDING" | "SCHEDULED";
export type ChangeStatus = "PENDING_APPROVAL" | "SCHEDULED" | "LIVE" | "SUPERSEDED" | "REJECTED";

export interface RateAdjustment {
  type: "NONE" | "MARKUP" | "MARKDOWN";
  mode: "PERCENT" | "AMOUNT" | null;
  value: string | null;
  label: string | null;
}

export interface RateChange {
  id: string;
  pairId: string;
  status: ChangeStatus;
  changeType: string;
  changeTypeLabel: string;
  baseRate: string;
  adjustment: RateAdjustment;
  finalRate: string;
  inverseRate: string;
  previous: { baseRate: string | null; finalRate: string | null } | null;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  reason: string;
  channel: string;
  submittedBy: { id: string; name: string; at: string } | null;
  reviewedBy: { id: string; name: string; at: string; comment?: string } | null;
  activatedAt: string | null;
}

export interface RatePair {
  id: string;
  code: string;
  baseCurrency: RateCurrency;
  targetCurrency: RateCurrency;
  quote: string;
  inverseQuote: string;
  enabled: boolean;
  conversion: { baseToTarget: boolean; targetToBase: boolean };
  status: PairStatus;
  enableOnFirstApproval: boolean;
}

export interface RatePairRow extends RatePair {
  rate: RateChange | null;
  liveFinalRate: string | null;
  pendingChangeId: string | null;
}

export interface PairStats {
  totalPairs: number;
  enabled: number;
  disabled: number;
  pendingApprovals: number;
}

export interface PageMeta {
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface RatesMeta {
  currencies: RateCurrency[];
  baseCurrencies: RateCurrency[];
  administrators: { id: string; name: string }[];
  pairStatuses: PairStatus[];
  changeStatuses: ChangeStatus[];
  adjustmentTypes: RateAdjustment["type"][];
  adjustmentModes: NonNullable<RateAdjustment["mode"]>[];
  auditEvents: { value: string; label: string }[];
  channels: { value: string; label: string }[];
  chartRanges?: ChartRange[];
  /** Decimal places for rates and inverse rates, and the rounding rule */
  precision?: RatePrecision;
  /** When false, a new rate goes live without a second admin's approval */
  makerCheckerEnabled?: boolean;
}

export interface RatePrecision { rate: number; inverse: number; rounding: string }

export interface ReviewView {
  pair: RatePair;
  change: RateChange;
  current: RateChange | null;
  review: { canReview: boolean; blockedBy: string | null; message: string | null };
}

export interface AuditLogRow {
  id: string;
  eventId: string;
  event: string;
  eventLabel: string;
  pair: { id: string; code: string; baseCurrency?: string; targetCurrency?: string } | null;
  currencyCode: string | null;
  previousValue: string | null;
  newValue: string | null;
  actor: { id: string; name: string } | null;
  channel: string;
  note: string | null;
  createdAt: string;
  // "What changed" and "Event metadata" come with every row (no extra call to expand)
  changes?: { field: string; label: string; before: string | null; after: string | null; changed: boolean }[];
  metadata?: {
    eventId: string;
    maker: { name: string; at: string } | null;
    checker: { name: string; at: string } | null;
    source: string | null;
    ipAddress: string | null;
    requestId: string | null;
  };
}

export interface AuditEventDetail extends AuditLogRow {
  summary: string;
  immutable: boolean;
  approvalChain: { step: string; role: string; by: string | null; at: string; note: string | null }[];
  source: { channel: string; label: string; ipAddress: string | null; userAgent: string | null; requestId: string | null };
}

export interface AuditStats {
  totalEvents: number;
  viaApi: number;
  lastChangeAt: string | null;
}

// ─── Error helpers ──────────────────────────────────────────────────────────

export const apiMessage = (error: unknown) =>
  (isAxiosError(error) && error.response?.data?.message) ||
  (!isAxiosError(error) && error instanceof Error && error.message) ||
  "Something went wrong";

/** Map `issues` ("body.baseRate") onto form field errors ("baseRate"). */
export const apiFieldErrors = (error: unknown): Record<string, string> => {
  if (!isAxiosError(error)) return {};
  const issues: { field: string; message: string }[] = error.response?.data?.issues ?? [];
  return Object.fromEntries(
    issues.map((i) => [i.field.replace(/^(body|query|params)\./, ""), i.message])
  );
};

// ─── Hooks ──────────────────────────────────────────────────────────────────

// GET /meta is reference data for every rates form and filter: fetched once and shared
let metaRequest: Promise<RatesMeta | null> | null = null;
const metaListeners = new Set<(meta: RatesMeta | null) => void>();

const loadRatesMeta = () => {
  metaRequest ??= ratesAxios
    .get("/meta")
    .then(({ data }) => data.data as RatesMeta)
    .catch(() => {
      metaRequest = null; // try again next time a screen needs it
      return null;
    });
  return metaRequest;
};

/** Refetch after anything that changes the reference data (currencies, pairs). */
export const invalidateRatesMeta = () => {
  metaRequest = null;
  loadRatesMeta().then((meta) => metaListeners.forEach((fn) => fn(meta)));
};

export function useRatesMeta() {
  const [meta, setMeta] = useState<RatesMeta | null>(null);
  useEffect(() => {
    let active = true;
    const update = (next: RatesMeta | null) => active && setMeta(next);
    metaListeners.add(update);
    loadRatesMeta().then(update);
    return () => {
      active = false;
      metaListeners.delete(update);
    };
  }, []);
  return meta;
}

/** Display labels for the meta enums */
export const ADJUSTMENT_TYPE_LABEL: Record<string, string> = { NONE: "None", MARKUP: "Mark up", MARKDOWN: "Mark down" };
export const ADJUSTMENT_MODE_LABEL: Record<string, string> = { PERCENT: "%", AMOUNT: "Amount" };
export const roundingLabel = (rounding?: string) => (rounding ?? "HALF_UP").toLowerCase().replace(/_/g, " ");

export interface PairQuery {
  status?: string | null;
  base?: string | null;
  search?: string;
  page: number;
  limit: number;
}

const clean = (params: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined));

export function useRatePairs(query: PairQuery) {
  const [pairs, setPairs] = useState<RatePairRow[]>([]);
  const [meta, setMeta] = useState<(PageMeta & { stats?: PairStats }) | null>(null);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(query);

  const fetchPairs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await ratesAxios.get("/pairs", { params: clean(JSON.parse(key)) });
      setPairs(data.data ?? []);
      setMeta(data.meta ?? null);
    } catch {
      setPairs([]);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetchPairs();
  }, [fetchPairs]);

  return { pairs, meta, loading, revalidate: fetchPairs };
}

export function useAuditLogs(enabled: boolean) {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    ratesAxios
      .get("/audit-logs", { params: { page: 1, limit: 50 } })
      .then(({ data }) => setLogs(data.data ?? []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [enabled]);
  return { logs, loading };
}

// ─── Pair page ──────────────────────────────────────────────────────────────

export interface PairDetail extends RatePair {
  liveRate: RateChange | null;
  pendingChange: RateChange | null;
  scheduledChange: RateChange | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  precision?: { rate: number; inverse: number; rounding: string };
}

export interface ChangeRow extends RateChange {
  pair: { id: string; code: string; baseCurrency: string; targetCurrency: string };
  canReview: boolean;
}

export function usePairDetail(id: string) {
  const [pair, setPair] = useState<PairDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchPair = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await ratesAxios.get(`/pairs/${id}`);
      setPair(data.data);
      setNotFound(false);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPair();
  }, [fetchPair]);

  return { pair, loading, notFound, revalidate: fetchPair };
}

export function usePairChanges(pairId: string, page: number, limit: number, version = 0) {
  const [changes, setChanges] = useState<ChangeRow[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    ratesAxios
      .get("/changes", { params: { pairId, page, limit } })
      .then(({ data }) => {
        setChanges(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch(() => setChanges([]))
      .finally(() => setLoading(false));
  }, [pairId, page, limit, version]);
  return { changes, meta, loading };
}

export function usePairAuditLogs(pairId: string, page: number, limit: number) {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    ratesAxios
      .get("/audit-logs", { params: { pairId, page, limit } })
      .then(({ data }) => {
        setLogs(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [pairId, page, limit]);
  return { logs, meta, loading };
}

/** Thousands separators on an API rate string ("2000.0000" → "2,000.0000"). Display only, no maths. */
export const formatRate = (value?: string | null) => {
  if (value === null || value === undefined || value === "") return "-";
  const [int, dec] = String(value).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${grouped}.${dec}` : grouped;
};

// ─── Audit log page ─────────────────────────────────────────────────────────

export interface AuditQuery {
  pairId?: string | null;
  /** One currency's configuration changes */
  currencyCode?: string | null;
  event?: string | null;
  adminId?: string | null;
  channel?: string | null;
  from?: string | null; // YYYY-MM-DD
  to?: string | null;
  page: number;
  limit: number;
}

export function useAuditLogPage(query: AuditQuery) {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [meta, setMeta] = useState<(PageMeta & { stats?: AuditStats }) | null>(null);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(query);

  useEffect(() => {
    setLoading(true);
    ratesAxios
      .get("/audit-logs", { params: clean(JSON.parse(key)) })
      .then(({ data }) => {
        setLogs(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [key]);

  return { logs, meta, loading };
}

export const auditExportParams = (query: Omit<AuditQuery, "page" | "limit">) => clean(query);

// ─── Rate History (filtered changes + chart) ────────────────────────────────

export interface ChangeQuery {
  pairId: string;
  status?: string | null;
  adminId?: string | null;
  adjustment?: string | null;
  from?: string | null; // YYYY-MM-DD
  to?: string | null;
  page: number;
  limit: number;
}

export function useChangesQuery(query: ChangeQuery, version = 0) {
  const [changes, setChanges] = useState<ChangeRow[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(query);
  useEffect(() => {
    setLoading(true);
    ratesAxios
      .get("/changes", { params: clean(JSON.parse(key)) })
      .then(({ data }) => {
        setChanges(data.data ?? []);
        setMeta(data.meta ?? null);
      })
      .catch(() => setChanges([]))
      .finally(() => setLoading(false));
  }, [key, version]);
  return { changes, meta, loading };
}

export type ChartRange = "7D" | "30D" | "90D" | "1Y";

export interface PairChart {
  quote: string;
  range: ChartRange;
  from: string;
  to: string;
  points: { date: string; finalRate: string | null }[];
}

export function usePairChart(pairId: string, range: ChartRange, version = 0) {
  const [chart, setChart] = useState<PairChart | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    ratesAxios
      .get(`/pairs/${pairId}/chart`, { params: { range } })
      .then(({ data }) => setChart(data.data ?? null))
      .catch(() => setChart(null))
      .finally(() => setLoading(false));
  }, [pairId, range, version]);
  return { chart, loading };
}

/**
 * Save an export without leaving the page. The file is fetched through the app's /api/download
 * route and saved from memory, so the caller's loader stays on until the file is actually saved.
 */
export const downloadExport = async ({ url, filename }: { url: string; filename?: string }) => {
  const name = filename || url.split("?")[0].split("/").pop() || "export.xlsx";
  const res = await fetch(`/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("The export file could not be downloaded.");
  const blobUrl = URL.createObjectURL(await res.blob());
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
};
