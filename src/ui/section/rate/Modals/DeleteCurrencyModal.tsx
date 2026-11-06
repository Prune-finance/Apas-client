"use client";

import { useEffect, useState } from "react";
import { Box, Modal, Text, UnstyledButton } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TextareaWithInsideLabel } from "@/ui/components/InputWithLabel";
import useNotification from "@/lib/hooks/notification";
import { apiMessage, invalidateRatesMeta, RateCurrency, ratesAxios } from "@/lib/hooks/rates";
import classes from "../styles.module.scss";
import { Icon } from "../shared";

// DELETE /currencies/:code — only allowed while no pair uses the currency (canDelete)

export default function DeleteCurrencyModal({ currency, onClose, onDeleted }: {
  currency: RateCurrency | null;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { handleSuccess, handleError } = useNotification();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setReason("");
    setError("");
  }, [currency?.code]);

  const blocked = currency?.canDelete === false;
  const pairs = currency?.pairCount ?? 0;

  const submit = async () => {
    if (!currency || blocked || saving) return;
    const value = reason.trim();
    if (value.length < 3) return setError("Enter a reason (at least 3 characters)");
    if (value.length > 500) return setError("Reason cannot exceed 500 characters");

    setSaving(true);
    try {
      await ratesAxios.delete(`/currencies/${currency.code}`, { data: { reason: value } });
      handleSuccess("Currency deleted", `${currency.code} was removed from the rate currencies.`);
      invalidateRatesMeta();
      onDeleted();
      onClose();
    } catch (err) {
      handleError(`Could not delete ${currency.code}`, apiMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal opened={!!currency} onClose={() => { if (!saving) onClose(); }} centered size={535} padding={0} radius={16}
      withCloseButton={false} aria-labelledby="delete-currency-title" classNames={{ content: classes.addDialog }}>
      {currency && (
        <form className={classes.addBody} onSubmit={(event) => { event.preventDefault(); void submit(); }}>
          <Box className={classes.enableHeader}>
            <span className={classes.enableIcon} style={{ background: "#fff3f0" }}><Icon name="disable" /></span>
            <Box className={classes.enableHeading}>
              <Text id="delete-currency-title" className={classes.addTitle} style={{ fontFamily: "'EksellDisplaySmall', serif", fontWeight: 700 }}>
                Delete {currency.code}
              </Text>
              <Text className={classes.enableStatus}>{currency.name}</Text>
            </Box>
            <UnstyledButton className={classes.addClose} type="button" disabled={saving} onClick={onClose} aria-label="Close">
              <Icon name="modal-close" />
            </UnstyledButton>
          </Box>

          <Box className={classes.addDivider} />

          {blocked ? (
            <Box className={classes.warnNotice} role="alert">
              <Icon name="warning-triangle" />
              <Box className={classes.noticeText}>
                <Text className={classes.warnTitle}>This currency is in use</Text>
                <Text className={classes.warnBody}>
                  {pairs} currency pair{pairs === 1 ? "" : "s"} use{pairs === 1 ? "s" : ""} {currency.code}. Remove those pairs before deleting it.
                </Text>
              </Box>
            </Box>
          ) : (
            <Text className={classes.enableCheckText}>
              {currency.code} will no longer be available for new currency pairs. Its audit history is kept.
            </Text>
          )}

          <TextareaWithInsideLabel standard label="Reason for change" withAsterisk disabled={saving || blocked} value={reason}
            onChange={(e) => { setReason(e.currentTarget.value); setError(""); }}
            placeholder="e.g. Added by mistake" error={error || undefined} />

          <Box className={classes.addDivider} />

          <Box className={classes.addFooter}>
            <SecondaryBtn text="Cancel" action={onClose} disabled={saving} h={48} px={32} fz={14} fw={500}
              bg="#fbfee6" bd="none" c="#344054" />
            <PrimaryBtn text="Delete currency" type="submit" loading={saving} disabled={blocked}
              h={48} px={32} fz={14} fw={500} c={blocked ? "#98a2b3" : "white"} color={blocked ? "#eaecf0" : "#FF5226"} />
          </Box>
        </form>
      )}
    </Modal>
  );
}
