"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Center, Flex, Loader, Skeleton, Text, UnstyledButton } from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PrimaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import useNotification from "@/lib/hooks/notification";
import {
  apiMessage,
  formatRate,
  ChangeStatus,
  PairStatus,
  RatePairRow,
  ratesAxios,
  usePairChanges,
  usePairDetail,
  useRatesMeta,
} from "@/lib/hooks/rates";
import { inter } from "@/ui/fonts";
import classes from "@/ui/section/rate/styles.module.scss";
import DisableRateModal from "@/ui/section/rate/Modals/DisableRateModal";
import EnablePairModal from "@/ui/section/rate/Modals/EnablePairModal";
import RateToast, { useRateToast } from "@/ui/section/rate/RateToast";
import SetRateDrawer from "@/ui/section/rate/Drawers/SetRateDrawer";
import ReviewChangeDrawer from "@/ui/section/rate/Drawers/ReviewChangeDrawer";
import RateHistory from "@/ui/section/rate/RateHistory";
import AuditTrail from "@/ui/section/rate/AuditTrail";

dayjs.extend(relativeTime);

// Figma: Pair page · Overview (15719:380891 / 15672:332940), inverse hidden (15702:374635),
// pending change (15673:335192), Rate History (15678:366738), Audit Trail (15679:368530)

const pairBadge: Record<PairStatus, { label: string; bg: string; fg: string }> = {
  ENABLED: { label: "Enabled", bg: "#E8FAF0", fg: "#12B76A" },
  DISABLED: { label: "Disabled", bg: "#EAECF0", fg: "#667085" },
  PENDING: { label: "Pending", bg: "#FFFAE6", fg: "#B86E00" },
  SCHEDULED: { label: "Scheduled", bg: "#FAFFE6", fg: "#8AA600" },
};

// Rate History badge per the integration guide
const changeBadge: Record<ChangeStatus, { label: string; bg: string; fg: string }> = {
  LIVE: { label: "Enabled", bg: "#E8FAF0", fg: "#12B76A" },
  SCHEDULED: { label: "Scheduled", bg: "#FAFFE6", fg: "#8AA600" },
  PENDING_APPROVAL: { label: "Pending", bg: "#FFFAE6", fg: "#B86E00" },
  SUPERSEDED: { label: "Disabled", bg: "#EAECF0", fg: "#667085" },
  REJECTED: { label: "Rejected", bg: "#FFF3F0", fg: "#DB340B" },
};

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/rate/${name}.svg`} alt="" aria-hidden="true" />;
}

const DotBadge = ({ label, bg, fg }: { label: string; bg: string; fg: string }) => (
  <span className={classes.dotBadge} style={{ background: bg, color: fg }}>
    <span className={classes.dot} />
    {label}
  </span>
);

const TABS = [
  { value: "overview", label: "Overview", icon: "tab-overview" },
  { value: "history", label: "Rate History", icon: "tab-rate-history" },
  { value: "audit", label: "Audit Trail", icon: "tab-audit-trail" },
] as const;
type TabValue = (typeof TABS)[number]["value"];

const fmtDate = (iso?: string | null) => (iso ? dayjs(iso).format("DD MMM YYYY") : "-");
const fmtDateTime = (iso?: string | null) => (iso ? dayjs(iso).format("DD MMM YYYY, HH:mm") : "-");

export default function PairPage({ params }: { params: { id: string } }) {
  const { handleSuccess, handleError } = useNotification();
  const { pair, loading, notFound, revalidate } = usePairDetail(params.id);
  const [tab, setTab] = useState<TabValue>("overview");
  const [version, setVersion] = useState(0);
  const refresh = () => { revalidate(); setVersion((v) => v + 1); };

  const [rateTarget, setRateTarget] = useState<RatePairRow | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [disableOpen, setDisableOpen] = useState(false);
  const [enableOpen, setEnableOpen] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useRateToast();
  const ratesMeta = useRatesMeta();
  const [toggling, setToggling] = useState(false);
  // Display preference only — there is no API setting behind it yet
  const [showInverse, setShowInverse] = useState(true);

  if (loading && !pair) {
    return <Center h={400}><Loader color="var(--prune-primary-600)" /></Center>;
  }
  if (notFound || !pair) {
    return <Center h={400}><Text c="#667085">This currency pair doesn&apos;t exist.</Text></Center>;
  }

  // SetRate/Review modals take the table-row shape
  const asRow: RatePairRow = {
    ...pair,
    rate: pair.liveRate,
    liveFinalRate: pair.liveRate?.finalRate ?? null,
    pendingChangeId: pair.pendingChange?.id ?? null,
  };
  const live = pair.liveRate;
  const badge = pairBadge[pair.status] ?? pairBadge.DISABLED;

  const setEnabled = async (enabled: boolean, reason?: string) => {
    setToggling(true);
    try {
      await ratesAxios.patch(`/pairs/${pair.id}/status`, { enabled, ...(reason ? { reason } : {}) });
      handleSuccess(enabled ? "Pair enabled" : "Pair disabled", `${pair.code} is now ${enabled ? "enabled" : "disabled"}.`);
      setDisableOpen(false);
      setEnableOpen(false);
      refresh();
    } catch (error) {
      handleError(`Could not ${enabled ? "enable" : "disable"} ${pair.code}`, apiMessage(error));
    } finally {
      setToggling(false);
    }
  };

  // One pending change per pair: offer Review instead of Set Rate
  const openRate = () => (pair.pendingChange ? setReviewId(pair.pendingChange.id) : setRateTarget(asRow));

  return (
    <Box className={classes.pairPage}>
      {/* Breadcrumb + header */}
      <Box>
        <nav className={classes.crumbs} aria-label="Breadcrumb">
          <Link href="/admin/rate" className={classes.crumb}>Rates</Link>
          <span className={classes.crumbSep}>/</span>
          <Link href="/admin/rate" className={classes.crumb}>Currency Pairs</Link>
          <span className={classes.crumbSep}>/</span>
          <span className={classes.crumbCurrent}>{pair.code}</span>
        </nav>

        <Box className={classes.pairHeader}>
          <Box className={classes.pairHeading}>
            <Box className={classes.pairTitleRow}>
              <Text className={classes.pairTitle}>{pair.baseCurrency.code} / {pair.targetCurrency.code}</Text>
              <DotBadge {...badge} />
            </Box>
            <Text className={classes.pairSubtitle}>
              {pair.baseCurrency.name} → {pair.targetCurrency.name} · Rate quoted as {pair.quote}
            </Text>
          </Box>

          {pair.enabled ? (
            <PrimaryBtn text="Disable Pair" leftSection={<Icon name="pair-disable" />} color="#ff5226" c="white"
              className={classes.largeBtn} action={() => setDisableOpen(true)} />
          ) : (
            <PrimaryBtn text="Enable Pair" leftSection={<Icon name="pair-disable" />} color="#ff5226" c="white"
              className={classes.largeBtn} action={() => setEnableOpen(true)} />
          )}
          <PrimaryBtn text={pair.pendingChange ? "Review Change" : "Set Rate"} leftSection={<Icon name="pair-set-rate" />}
            color="#c1dd06" c="#344054" className={classes.largeBtn} action={openRate} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box className={classes.pairTabs}>
        <Box className={classes.tabList} role="tablist">
          {TABS.map((t) => (
            <UnstyledButton key={t.value} role="tab" aria-selected={tab === t.value}
              className={classes.tab} data-active={tab === t.value || undefined} onClick={() => setTab(t.value)}>
              <span className={classes.tabLabel}>
                <span className={classes.tabIcon} style={{ ["--icon" as string]: `url(/images/rate/${t.icon}.svg)` }} />
                {t.label}
              </span>
              <span className={classes.tabIndicator} />
            </UnstyledButton>
          ))}
        </Box>

        {tab === "overview" && (
          <>
            {/* Pair settings (Figma 15719:378673) */}
            <Box className={classes.settingsRow}>
              {/* Maker-checker is always on: every rate change needs a second admin */}
              <Box className={classes.settingCell}>
                <span className={classes.settingBox} data-checked><Icon name="checkbox-check" /></span>
                Require admin approval for rate change
              </Box>
              <Box className={classes.settingCell} title="Not available yet">
                <span className={classes.settingBox} />
                Use API Rate
              </Box>
              <UnstyledButton className={classes.settingCell} onClick={() => setShowInverse((v) => !v)}
                role="checkbox" aria-checked={showInverse}>
                <span className={classes.settingBox} data-checked={showInverse || undefined}>
                  {showInverse && <Icon name="checkbox-check" />}
                </span>
                Show inverse rate
              </UnstyledButton>
            </Box>

            <Box className={classes.overviewRow}>
            {/* Current live rate */}
            <Box className={`${classes.liveCard} ${live && showInverse ? "" : classes.liveCardFull}`}>
              <Box className={classes.liveHead}>
                <Box className={classes.liveTitleRow}>
                  <Text className={classes.liveTitle}>Current live rate</Text>
                  {live
                    ? <DotBadge label="Live" bg="#E8FAF0" fg="#12B76A" />
                    : <DotBadge label="Offline" bg="#EAECF0" fg="#667085" />}
                </Box>
                <Text className={classes.liveEffective} style={{ fontFamily: inter.style.fontFamily }}>
                  Effective {live ? `${fmtDateTime(live.effectiveFrom ?? live.activatedAt)} → until superseded` : "-"}
                </Text>
              </Box>

              <Box className={classes.liveFigures}>
                <Box className={`${classes.figure} ${classes.figureWide}`}>
                  <Text className={classes.figureLabel}>Base rate</Text>
                  <Text className={classes.figureValue}>{formatRate(live?.baseRate)}</Text>
                  <Text className={classes.figureSub}>{pair.quote}</Text>
                </Box>
                <Text className={classes.figureOp} style={{ fontFamily: inter.style.fontFamily }}>+</Text>
                <Box className={classes.figure}>
                  <Text className={classes.figureLabel}>Adjustment</Text>
                  <Text className={`${classes.figureValue} ${live?.adjustment.label ? "" : classes.figureMuted}`}>
                    {live?.adjustment.label ?? "None"}
                  </Text>
                  <Text className={classes.figureSub}>
                    {live?.adjustment.label
                      ? `${live.adjustment.type === "MARKDOWN" ? "Markdown" : "Markup"} · ${live.adjustment.mode === "AMOUNT" ? "amount" : "percent"}`
                      : "No markup / markdown"}
                  </Text>
                </Box>
                <Text className={classes.figureOp} style={{ fontFamily: inter.style.fontFamily }}>→</Text>
                <Box className={`${classes.figure} ${classes.figureWide}`}>
                  <Text className={classes.figureLabel}>Final rate</Text>
                  <Text className={classes.figureValue}>{formatRate(live?.finalRate)}</Text>
                  <Text className={classes.figureSub}>Applied to transactions</Text>
                </Box>
              </Box>

              {live && (
                <Box className={classes.grayNotice}>
                  <Icon name="info-triangle" />
                  <Text fz={12} lh={1.5} c="#667085" style={{ flex: 1 }}>
                    Final rate = Base rate ± adjustment. With no adjustment configured, the final rate equals the base rate.
                  </Text>
                </Box>
              )}

              {!live && (
                <Box className={classes.infoNotice}>
                  <Icon name="shield" />
                  <Text className={classes.infoNoticeText}>
                    {pair.pendingChange ? "A rate is waiting for approval" : "No rate set yet"}
                  </Text>
                  <UnstyledButton className={classes.smallBlueBtn} onClick={openRate}>
                    {pair.pendingChange ? "Review" : "Set rate"}
                  </UnstyledButton>
                </Box>
              )}
            </Box>

            {/* Inverse rate (Figma 15719:378702) */}
            {live && showInverse && (
              <Box className={classes.inverseCard}>
                <Box>
                  <Text className={classes.inverseTitle}>Inverse rate</Text>
                  <Text className={classes.inverseSub}>
                    {pair.targetCurrency.code} / {pair.baseCurrency.code} · {pair.inverseQuote}
                  </Text>
                </Box>
                <Flex align="center">
                  <Text className={classes.inverseValue}>{live.inverseRate}</Text>
                  <Text className={classes.inverseUnit} style={{ fontFamily: inter.style.fontFamily }}>
                    {pair.baseCurrency.code}
                  </Text>
                </Flex>
                <Box className={classes.formulaBox}>
                  <Text className={classes.formulaTitle}>Inverse = 1 ÷ Final rate</Text>
                  <Text className={classes.formulaBody}>1 ÷ {formatRate(live.finalRate)} = {live.inverseRate}</Text>
                </Box>
                <Box className={classes.precisionRow}>
                  <Text fz={12} lh={1} c="#667085" style={{ flex: 1 }}>
                    Precision: {pair.precision?.inverse ?? 6} dp · Rounding: half-up
                  </Text>
                  <Icon name="lock" />
                </Box>
              </Box>
            )}
            </Box>

            {/* Pending change awaiting a checker (Figma 15673:335238) */}
            {pair.pendingChange && (() => {
              const pc = pair.pendingChange;
              const adj = pc.adjustment.label
                ? `${pc.adjustment.type === "MARKDOWN" ? "Markdown" : "Markup"} ${pc.adjustment.label}`
                : "No adjustment";
              return (
                <Box className={classes.pendingBanner}>
                  <Box className={classes.pendingBannerTop}>
                    <Box className={classes.pendingBannerTitle}>
                      <Icon name="clock" />
                      <Text className={classes.pendingBannerHeading} style={{ fontFamily: inter.style.fontFamily }}>
                        {pc.effectiveFrom ? "Scheduled change awaiting approval" : "Rate change awaiting approval"}
                      </Text>
                      <span className={classes.pendingPill}><span className={classes.dot} />Pending approval</span>
                    </Box>
                    <PrimaryBtn text="Review rate change" leftSection={<Icon name="export-arrow" />}
                      className={classes.reviewRateBtn} action={() => setReviewId(pc.id)} />
                  </Box>
                  <Box className={classes.pendingBannerBody}>
                    <Text className={classes.pendingBannerMain}>
                      Base rate {formatRate(live?.baseRate ?? pc.previous?.baseRate)} → {formatRate(pc.baseRate)} · {adj} · Final {formatRate(pc.finalRate)}
                    </Text>
                    <Text className={classes.pendingBannerSub}>
                      Submitted by {pc.submittedBy?.name ?? "—"}
                      {pc.submittedBy?.at ? ` · ${dayjs(pc.submittedBy.at).fromNow()}` : ""}
                      {" · "}Effective {pc.effectiveFrom ? dayjs(pc.effectiveFrom).format("DD MMM YYYY, HH:mm") : "on approval"}
                      {" · "}Not applied to live transactions until approved
                    </Text>
                  </Box>
                </Box>
              );
            })()}

            <ChangesCard pairId={pair.id} version={version} title="Recent rate changes" onReview={setReviewId} />
          </>
        )}

        {tab === "history" && (
          <RateHistory pairId={pair.id} quote={pair.quote} version={version} onReview={setReviewId} />
        )}

        {tab === "audit" && <AuditTrail pairId={pair.id} />}
      </Box>

      {disableOpen && (
        <DisableRateModal pair={{ code: pair.code, statusLabel: badge.label }} processing={toggling}
          onClose={() => setDisableOpen(false)} onConfirm={(reason) => setEnabled(false, reason)} />
      )}
      <EnablePairModal pair={enableOpen ? { code: pair.code, statusLabel: badge.label, hasLiveRate: !!live } : null}
        processing={toggling} onClose={() => setEnableOpen(false)} onConfirm={(reason) => setEnabled(true, reason)} />
      <SetRateDrawer pair={rateTarget} onClose={() => setRateTarget(null)} onSubmitted={refresh} notify={showToast}
        requiresApproval={ratesMeta?.makerCheckerEnabled ?? true} precision={pair.precision} />
      <RateToast toast={toast} onClose={hideToast} />
      <ReviewChangeDrawer changeId={reviewId} onClose={() => setReviewId(null)} onReviewed={refresh} />
    </Box>
  );
}

function ChangesCard({ pairId, version, title, onReview, withStatus }: {
  pairId: string;
  version: number;
  title: string;
  onReview: (id: string) => void;
  withStatus?: boolean;
}) {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const { changes, meta, loading } = usePairChanges(pairId, active, Number(limit ?? 10), version);

  const period = (c: (typeof changes)[number]) => {
    const from = c.effectiveFrom ?? c.activatedAt;
    const start = from ? dayjs(from).format("DD MMM HH:mm") : "On approval";
    const end =
      c.status === "LIVE" ? "Present"
        : c.status === "SUPERSEDED" ? (c.effectiveTo ? dayjs(c.effectiveTo).format("DD MMM HH:mm") : "-")
        : c.status === "REJECTED" ? "Never Live"
        : "Pending";
    return `${start} → ${end}`;
  };

  return (
    <Box className={classes.recentCard}>
      <Text className={classes.recentTitle}>{title}</Text>
      {loading && !changes.length ? (
        <Flex direction="column" gap={16} px={16}>{[0, 1, 2].map((i) => <Skeleton key={i} h={40} radius={8} />)}</Flex>
      ) : (
        <Box style={{ overflowX: "auto" }}>
          {/* Figma: 42px header, 12px/8px cells, fixed 118px rate columns */}
          <table className={classes.changesTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th className={classes.colRate}>Previous</th>
                <th className={classes.colRate}>New rate</th>
                <th className={classes.colRate}>Adjustment</th>
                <th className={classes.colRate}>Final rate</th>
                {withStatus && <th>Status</th>}
                <th>Effective Period</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((c) => {
                const reviewable = c.status === "PENDING_APPROVAL";
                const b = changeBadge[c.status];
                return (
                  <tr key={c.id} data-clickable={reviewable || undefined} onClick={() => reviewable && onReview(c.id)}>
                    <td>{fmtDateTime(c.submittedBy?.at)}</td>
                    <td className={classes.muted}>{formatRate(c.previous?.finalRate)}</td>
                    <td className={classes.strong}>{formatRate(c.baseRate)}</td>
                    <td>{c.adjustment.label ?? "-"}</td>
                    <td className={classes.strong}>{formatRate(c.finalRate)}</td>
                    {withStatus && <td>{b && <DotBadge {...b} />}</td>}
                    <td>{period(c)}</td>
                    <td>{c.submittedBy?.name ?? "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <EmptyTable rows={changes} loading={loading} title="No rate changes yet" text="Rate changes for this pair will appear here." />
        </Box>
      )}
      <Box px={16}>
        <PaginationComponent active={active} setActive={setActive} limit={limit} setLimit={setLimit}
          total={Math.max(1, meta?.totalPages ?? 1)} />
      </Box>
    </Box>
  );
}
