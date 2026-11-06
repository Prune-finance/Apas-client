"use client";

import { useEffect, useState } from "react";
import { Box, Modal, Text, UnstyledButton } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TextareaWithInsideLabel } from "@/ui/components/InputWithLabel";
import classes from "../styles.module.scss";
import { Icon } from "../shared";

// Figma: Enable pair (15673:337465)

export default function EnablePairModal({ pair, onClose, onConfirm, processing }: {
  pair: { code: string; statusLabel: string; hasLiveRate: boolean } | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  processing?: boolean;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pair) return;
    setReason("");
    setError("");
  }, [pair]);

  // Figma keeps Enable active even with the warning; the API has the final say
  const noLiveRate = !pair?.hasLiveRate;

  const submit = () => {
    const value = reason.trim();
    if (!value) return setError("Reason is required.");
    if (value.length > 500) return setError("Reason cannot exceed 500 characters.");
    onConfirm(value);
  };

  return (
    <Modal opened={!!pair} onClose={onClose} centered size={535} padding={0} radius={16}
      withCloseButton={false} aria-labelledby="enable-pair-title" classNames={{ content: classes.addDialog }}>
      {pair && (
        <Box className={classes.addBody}>
          {/* Header */}
          <Box className={classes.enableHeader}>
            <span className={classes.enableIcon}><Icon name="power" /></span>
            <Box className={classes.enableHeading}>
              <Text id="enable-pair-title" className={classes.addTitle} style={{ fontFamily: "'EksellDisplaySmall', serif", fontWeight: 700 }}>Enable {pair.code.replace(/\s/g, "")}</Text>
              <Text className={classes.enableStatus}>Currently {pair.statusLabel}</Text>
            </Box>
            <UnstyledButton className={classes.addClose} onClick={onClose} aria-label="Close">
              <Icon name="modal-close" />
            </UnstyledButton>
          </Box>

          <Box className={classes.addDivider} />

          <Box className={classes.enableCheck}>
            <Icon name="check-circle-24" />
            <Text className={classes.enableCheckText}>
              The pair becomes available for new transactions once it has a valid, approved and effective rate.
            </Text>
          </Box>

          {noLiveRate && (
            <Box className={classes.warnNotice} role="alert">
              <Icon name="warning-triangle" />
              <Box className={classes.noticeText}>
                <Text className={classes.warnTitle}>No active rate found</Text>
                <Text className={classes.warnBody}>Set a rate for this pair before enabling it.</Text>
              </Box>
            </Box>
          )}

          {/* Reason */}
          <TextareaWithInsideLabel standard label="Reason for change" withAsterisk value={reason}
            placeholder="e.g. New corridor launch for UK → Nigeria" error={error || undefined}
            onChange={(e) => { setReason(e.currentTarget.value); setError(""); }} />

          <Box className={classes.addDivider} />

          <Box className={classes.addFooter}>
            <SecondaryBtn text="Cancel" action={onClose} h={48} px={32} fz={14} fw={500}
              bg="#fbfee6" bd="none" c="#344054" />
            <PrimaryBtn text="Enable" action={submit} loading={processing}
              h={48} px={32} fz={14} fw={500} c="#344054" color="#c1dd06" />
          </Box>
        </Box>
      )}
    </Modal>
  );
}
