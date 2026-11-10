"use client";

import { useEffect, useState } from "react";
import { Box, Center, Drawer, Loader, Text, UnstyledButton } from "@mantine/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useNotification from "@/lib/hooks/notification";
import { apiMessage, AuditEventDetail, ratesAxios } from "@/lib/hooks/rates";
import classes from "../styles.module.scss";
import { Avatar, EVENT_TONE, formatChangeValue, GREY, Icon } from "../shared";

dayjs.extend(utc);

// Figma: Audit event drawer (15681:370433)

const STEP_TITLE: Record<string, (by: string | null) => string> = {
  SUBMITTED: (by) => `Submitted by ${by ?? "—"} (Maker)`,
  APPROVED: (by) => `Approved by ${by ?? "—"} (Checker)`,
  REJECTED: (by) => `Rejected by ${by ?? "—"} (Checker)`,
  ACTIVATED: () => "Activated automatically",
};

export default function AuditEventDrawer({ eventId, onClose }: { eventId: string | null; onClose: () => void }) {
  const { handleError } = useNotification();
  const [event, setEvent] = useState<AuditEventDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setEvent(null);
    setLoading(true);
    ratesAxios
      .get(`/audit-logs/${eventId}`)
      .then(({ data }) => setEvent(data.data))
      .catch((error) => {
        handleError("Could not load event", apiMessage(error));
        onClose();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const tone = event ? EVENT_TONE[event.event] ?? GREY : GREY;

  return (
    <Drawer opened={!!eventId} onClose={onClose} position="right" size={631} padding={0}
      withCloseButton={false} aria-labelledby="audit-event-title"
      classNames={{ content: classes.reviewDrawer, body: `${classes.reviewBody} ${classes.reviewBodyRoomy}` }}>
      <Box className={classes.reviewTopBar}>
        <Box className={classes.reviewNav} />
        <Box className={classes.reviewTitleRow}>
          <Text id="audit-event-title" className={classes.reviewTitle}>Audit event</Text>
          <UnstyledButton className={classes.reviewClose} onClick={onClose} aria-label="Close">
            <Icon name="drawer-close" />
          </UnstyledButton>
        </Box>
      </Box>

      {loading || !event ? (
        <Center py={64}><Loader color="var(--prune-primary-600)" /></Center>
      ) : (
        <>
          {/* Event + summary */}
          <Box className={`${classes.reviewSection} ${classes.reviewMeta}`}>
            <span className={classes.pendingBadge} style={{ background: tone[0], color: tone[1] }}>{event.eventLabel}</span>
            <Text className={classes.reviewHeading}>{event.summary}</Text>
            <Text className={classes.reviewStamp}>{dayjs.utc(event.createdAt).format("DD MMM YYYY, HH:mm:ss")} UTC</Text>
          </Box>

          {/* Immutable record */}
          <Box className={classes.reviewSection}>
            <Box className={classes.immutableBox}>
              <Icon name="lock-20" />
              <span className={classes.immutableText}>Immutable record · cannot be edited or deleted</span>
              <span className={classes.immutableId}>{event.eventId}</span>
            </Box>
          </Box>

          {/* Changes */}
          {!!event.changes?.length && (
            <Box className={classes.reviewSection} style={{ gap: 16 }}>
              <Text className={classes.drawerSectionTitle}>Changes</Text>
              <table className={classes.drawerTable}>
                <thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead>
                <tbody>
                  {event.changes.map((c) => (
                    <tr key={c.field}>
                      <td className={classes.changeLabel}>{c.label}</td>
                      <td className={c.changed ? classes.drawerBefore : classes.changeSameMuted}>{formatChangeValue(c.field, c.before)}</td>
                      <td className={c.changed ? classes.drawerAfter : classes.changeSame}>{formatChangeValue(c.field, c.after)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}

          {/* Approval chain */}
          {!!event.approvalChain?.length && (
            <Box className={classes.reviewSection} style={{ gap: 15 }}>
              <Text className={classes.drawerSectionTitle}>Approval chain</Text>
              <Box className={classes.chain}>
                {event.approvalChain.map((step, i) => {
                  const last = i === event.approvalChain.length - 1;
                  const noteLabel = step.step === "SUBMITTED" ? "Reason" : step.step === "ACTIVATED" ? null : "Comment";
                  return (
                    <Box key={`${step.step}-${i}`} className={classes.chainStep}>
                      <Box className={classes.chainRail}>
                        <Avatar name={step.by ?? "S"} />
                        {!last && <span className={classes.chainLine}><Icon name="chain-line" /></span>}
                      </Box>
                      <Box className={classes.chainText}>
                        <span className={classes.chainTitle}>
                          {(STEP_TITLE[step.step] ?? ((by: string | null) => `${step.step} ${by ?? ""}`))(step.by)}
                        </span>
                        <span className={classes.chainSub}>
                          {dayjs(step.at).format("DD MMM YYYY, HH:mm")}
                          {step.note ? ` · ${noteLabel ? `${noteLabel}: “${step.note}”` : step.note}` : ""}
                        </span>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Source (the design's "Session" row isn't returned by the API) */}
          <Box className={classes.reviewSection} style={{ gap: 20 }}>
            <Text className={classes.drawerSectionTitle}>Source</Text>
            <Box className={classes.sourceGrid}>
              <span className={classes.sourceLabel}>Channel</span>
              <span className={classes.sourceValue}>{event.source?.label ?? event.channel}</span>
              <span className={classes.sourceLabel}>IP address</span>
              <span className={classes.sourceValue}>{event.source?.ipAddress ?? "-"}</span>
              <span className={classes.sourceLabel}>Request ID</span>
              <span className={classes.sourceValue}>{event.source?.requestId ?? "-"}</span>
            </Box>
          </Box>
        </>
      )}
    </Drawer>
  );
}
