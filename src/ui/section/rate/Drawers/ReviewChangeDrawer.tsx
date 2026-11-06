"use client";

import { useEffect, useState } from "react";
import { Box, Center, Drawer, Loader, Text, UnstyledButton } from "@mantine/core";
import dayjs from "dayjs";
import { isAxiosError } from "axios";
import utc from "dayjs/plugin/utc";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { TextInputWithInsideLabel } from "@/ui/components/InputWithLabel";
import useNotification from "@/lib/hooks/notification";
import { apiFieldErrors, apiMessage, formatRate, RateChange, ratesAxios, ReviewView } from "@/lib/hooks/rates";
import classes from "../styles.module.scss";

dayjs.extend(utc);

// Figma: Review change drawer (15681:371814 blocked · 15681:372354 reviewable)

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/rate/${name}.svg`} alt="" aria-hidden="true" />;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING_APPROVAL: "Pending approval",
  SCHEDULED: "Approved · scheduled",
  LIVE: "Approved · live",
  SUPERSEDED: "Superseded",
  REJECTED: "Rejected",
};

const CHANNEL_LABEL: Record<string, string> = { PORTAL: "Admin portal", API: "API", SYSTEM: "System" };

const BLOCKED_TITLE: Record<string, string> = {
  OWN_CHANGE: "You cannot approve your own change",
  ALREADY_REVIEWED: "This change has already been reviewed",
};

function RateCard({ title, rate, proposed }: { title: string; rate: RateChange | null; proposed?: boolean }) {
  const rows: [string, string, boolean?][] = rate
    ? [
        ["Base rate", formatRate(rate.baseRate)],
        ["Adjustment", rate.adjustment.label ?? "None"],
        ["Final rate", formatRate(rate.finalRate), true],
        ["Inverse", rate.inverseRate ?? "-"],
        ["Effective", rate.effectiveFrom ? dayjs(rate.effectiveFrom).format("DD MMM YYYY") : "Live now"],
      ]
    : [
        ["Base rate", "-"],
        ["Adjustment", "-"],
        ["Final rate", "-", true],
        ["Inverse", "-"],
        ["Effective", "Nothing live yet"],
      ];

  return (
    <Box className={`${classes.rateCard} ${proposed ? classes.rateCardProposed : ""}`}>
      <Text className={classes.rateCardTitle}>{title}</Text>
      <Box className={classes.rateGrid}>
        {rows.map(([label, value, strong]) => (
          <Box key={label} style={{ display: "contents" }}>
            <span className={classes.rateGridLabel}>{label}</span>
            <span className={`${classes.rateGridValue} ${strong ? classes.rateGridStrong : ""}`}>{value}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function ReviewChangeDrawer({
  changeId,
  onClose,
  onReviewed,
}: {
  changeId: string | null;
  onClose: () => void;
  onReviewed: () => void;
}) {
  const { handleSuccess, handleError } = useNotification();
  const [view, setView] = useState<ReviewView | null>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [acting, setActing] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    if (!changeId) return;
    setView(null);
    setComment("");
    setCommentError(null);
    setLoading(true);
    ratesAxios
      .get(`/changes/${changeId}`)
      .then(({ data }) => setView(data.data))
      .catch((error) => {
        handleError("Could not load change", apiMessage(error));
        onClose();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeId]);

  const act = async (kind: "approve" | "reject") => {
    if (!changeId) return;
    // The checker comment is required for both decisions (at least 3 characters, the API's rule for rejections)
    if (comment.trim().length < 3) {
      setCommentError(kind === "reject"
        ? "Say why the change is rejected (at least 3 characters)"
        : "Add a comment for this approval (at least 3 characters)");
      return;
    }
    setActing(kind);
    try {
      const { data } = await ratesAxios.post(`/changes/${changeId}/${kind}`, { comment: comment.trim() });
      handleSuccess(kind === "approve" ? "Rate approved" : "Rate rejected", data.message ?? "");
      onReviewed();
      onClose();
    } catch (error) {
      const fields = apiFieldErrors(error);
      if (fields.comment) {
        setCommentError(fields.comment);
        return;
      }
      handleError(kind === "approve" ? "Could not approve" : "Could not reject", apiMessage(error));
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        // The change no longer exists
        onReviewed();
        onClose();
      } else if (status === 403 || status === 409) {
        // Own change, or someone else reviewed it first: reload so the drawer shows why it is blocked
        onReviewed();
        ratesAxios.get(`/changes/${changeId}`).then(({ data }) => setView(data.data)).catch(() => undefined);
      }
    } finally {
      setActing(null);
    }
  };

  const change = view?.change;
  const review = view?.review;
  const canReview = Boolean(review?.canReview);
  const own = review?.blockedBy === "OWN_CHANGE";

  return (
    <Drawer opened={!!changeId} onClose={onClose} position="right" size={631} padding={0}
      withCloseButton={false} aria-labelledby="review-change-title"
      classNames={{ content: classes.reviewDrawer, body: classes.reviewBody }}>
      {/* Top bar */}
      <Box className={classes.reviewTopBar}>
        <Box className={classes.reviewNav} />
        <Box className={classes.reviewTitleRow}>
          <Text id="review-change-title" className={classes.reviewTitle}>Review change</Text>
          <UnstyledButton className={classes.reviewClose} onClick={onClose} aria-label="Close">
            <Icon name="drawer-close" />
          </UnstyledButton>
        </Box>
      </Box>

      {loading || !view || !change ? (
        <Center py={64}><Loader color="var(--prune-primary-600)" /></Center>
      ) : (
        <>
          {/* Status + summary */}
          <Box className={`${classes.reviewSection} ${classes.reviewMeta}`}>
            <span className={classes.pendingBadge}>{STATUS_LABEL[change.status] ?? change.status}</span>
            <Text className={classes.reviewHeading}>
              {view.pair.baseCurrency.code} / {view.pair.targetCurrency.code} · {change.changeTypeLabel} change
            </Text>
            <Text className={classes.reviewStamp}>
              {change.submittedBy?.at ? `${dayjs.utc(change.submittedBy.at).format("DD MMM YYYY, HH:mm:ss")} UTC` : ""}
            </Text>
          </Box>

          {/* Maker */}
          <Box className={classes.reviewSection}>
            <Box className={classes.submitter}>
              <span className={classes.avatar}>
                <Icon name="avatar-bg" />
                <span>{(change.submittedBy?.name ?? "?").charAt(0).toUpperCase()}</span>
              </span>
              <Box>
                <Text className={classes.submitterName}>
                  Submitted by {change.submittedBy?.name ?? "—"}{own ? " (you)" : ""}
                </Text>
                <Text className={classes.submitterMeta}>
                  {change.submittedBy?.at ? dayjs(change.submittedBy.at).format("DD MMM YYYY, HH:mm") : ""} · via{" "}
                  {CHANNEL_LABEL[change.channel] ?? change.channel}
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Current → Proposed */}
          <Box className={classes.reviewSection}>
            <Box className={classes.compareRow}>
              <RateCard title="CURRENT (LIVE)" rate={view.current} />
              <Icon name="arrow-right" />
              <RateCard title="PROPOSED" rate={change} proposed />
            </Box>
          </Box>

          {/* Reason */}
          <Box className={classes.fieldBlock}>
            <Text className={classes.fieldBlockLabel}>Reason from maker</Text>
            <Text className={classes.fieldBlockText}>“{change.reason}”</Text>
          </Box>

          {/* Blocked warning (own change / already reviewed) */}
          {!canReview && review?.message && (
            <Box className={classes.reviewSection}>
              <Box className={classes.warnNotice} role="alert">
                <Icon name="warning-triangle" />
                <Box style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <Text className={classes.warnTitle}>
                    {BLOCKED_TITLE[review.blockedBy ?? ""] ?? "This change can't be reviewed"}
                  </Text>
                  <Text className={classes.warnBody}>{review.message}</Text>
                </Box>
              </Box>
            </Box>
          )}

          {/* Checker comment */}
          {canReview ? (
            <Box className={classes.reviewSection}>
              <TextInputWithInsideLabel standard label="Checker comment" withAsterisk value={comment}
                placeholder="e.g. Rate within tolerance" error={commentError}
                onChange={(e) => { setComment(e.currentTarget.value); setCommentError(null); }} />
            </Box>
          ) : (
            <Box className={classes.fieldBlock}>
              <Text className={classes.fieldBlockLabel}>Checker comment</Text>
              <Text className={`${classes.fieldBlockText} ${classes.fieldBlockMuted}`}>
                {change.reviewedBy?.comment || "No comment yet"}
              </Text>
            </Box>
          )}

          {/* Footer */}
          <Box className={classes.reviewFooter}>
            <PrimaryBtn text="Reject" h={48} px={32} fz={14} fw={500}
              color={canReview ? "#ff5226" : "#eaecf0"} c={canReview ? "white" : "#98a2b3"}
              disabled={!canReview || !!acting} loading={acting === "reject"} action={() => act("reject")} />
            <PrimaryBtn text="Approve & activate" h={48} px={32} fz={14} fw={500}
              color={canReview ? "#c1dd06" : "#eaecf0"} c={canReview ? "#344054" : "#98a2b3"}
              disabled={!canReview || !!acting} loading={acting === "approve"} action={() => act("approve")} />
          </Box>
        </>
      )}
    </Drawer>
  );
}
