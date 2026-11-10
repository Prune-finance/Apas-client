"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Drawer, LoadingOverlay, Text, UnstyledButton } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import dayjs from "dayjs";
import { isAxiosError } from "axios";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import CountryFlag, { currencyFlagCode } from "@/ui/components/CountryFlag";
import { NumberInputWithInsideLabel, TextareaWithInsideLabel } from "@/ui/components/InputWithLabel";
import { inter } from "@/ui/fonts";
import {
  ADJUSTMENT_MODE_LABEL,
  ADJUSTMENT_TYPE_LABEL,
  apiFieldErrors,
  apiMessage,
  formatRate,
  RateChange,
  PairDetail,
  RatePairRow,
  RatePrecision,
  ratesAxios,
  roundingLabel,
  useRatesMeta,
} from "@/lib/hooks/rates";
import classes from "../styles.module.scss";
import { RateToastState } from "../RateToast";
import { Icon } from "../shared";

// Figma: Set rate drawer (15673:334813 maker-checker · 15719:375398 direct · 15673:335907 validation)

type AdjustmentType = "NONE" | "MARKUP" | "MARKDOWN";
type AdjustmentMode = "PERCENT" | "AMOUNT";

interface Preview {
  currentLiveBaseRate: string | null;
  currentLiveFinalRate: string | null;
  baseRate: string;
  adjustment: { type: string; mode: string | null; value: string | null; label: string | null };
  adjustmentAmount: string | null;
  finalRate: string;
  inverseRate: string;
  quote: string;
  inverseQuote: string;
  precision?: RatePrecision;
}

// The API reports adjustment problems on adjustment.type / .mode / .value; they all show under the value field
const adjustmentError = (fields: Record<string, string>) =>
  fields["adjustment.value"] || fields["adjustment.mode"] || fields["adjustment.type"] || fields.adjustment || "";

const DECIMAL = /^\d+(\.\d+)?$/;

// NumberInput hands back a number, or a string while a value is half typed ("12."); the form keeps strings
const asText = (v: number | string) => (typeof v === "number" ? String(v) : v);

function Segmented<T extends string>({ value, onChange, options, className, label }: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className: string;
  label: string;
}) {
  return (
    <Box className={className} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <UnstyledButton key={o.value} role="radio" aria-checked={o.value === value}
          className={classes.segment} data-active={o.value === value || undefined} onClick={() => onChange(o.value)}>
          {o.label}
        </UnstyledButton>
      ))}
    </Box>
  );
}

export default function SetRateDrawer({ pair, onClose, onSubmitted, notify, requiresApproval = true, precision }: {
  pair: RatePairRow | null;
  onClose: () => void;
  onSubmitted: () => void;
  notify: (toast: NonNullable<RateToastState>) => void;
  /** Maker-checker on: "Submit for approval" + the approval note */
  requiresApproval?: boolean;
  /** The pair's own precision; falls back to the reference data */
  precision?: RatePrecision;
}) {
  // A pair that already has a rate is edited: the drawer loads GET /pairs/:id and starts from it
  const editing = !!pair?.rate;
  const [detail, setDetail] = useState<PairDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const live = detail?.liveRate ?? (pair?.rate?.status === "LIVE" ? pair.rate : null);
  const meta = useRatesMeta();
  const rules = precision ?? detail?.precision ?? meta?.precision;
  const rateDp = rules?.rate ?? 4;
  const typeOptions = (meta?.adjustmentTypes ?? ["NONE", "MARKUP", "MARKDOWN"])
    .map((t) => ({ value: t as AdjustmentType, label: ADJUSTMENT_TYPE_LABEL[t] ?? t }));
  const modeOptions = (meta?.adjustmentModes ?? ["PERCENT", "AMOUNT"])
    .map((m) => ({ value: m as AdjustmentMode, label: ADJUSTMENT_MODE_LABEL[m] ?? m }));

  const [baseRate, setBaseRate] = useState("");
  const [type, setType] = useState<AdjustmentType>("NONE");
  const [mode, setMode] = useState<AdjustmentMode>("PERCENT");
  const [value, setValue] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<Preview | null>(null);
  const [saving, setSaving] = useState(false);

  // Each time the drawer opens: reset, then (when editing) prefill from the pair's current rate
  useEffect(() => {
    if (!pair) return;
    const prefill = (rate: RateChange | null) => {
      setBaseRate(rate?.baseRate ?? "");
      setType((rate?.adjustment.type ?? "NONE") as AdjustmentType);
      setMode((rate?.adjustment.mode ?? "PERCENT") as AdjustmentMode);
      setValue(rate?.adjustment.value ?? "");
    };
    setDetail(null);
    setEffectiveFrom(null);
    setReason("");
    setTouched({});
    setSubmitted(false);
    setApiErrors({});
    setPreview(null);
    prefill(pair.rate?.status === "LIVE" ? pair.rate : null);
    if (!pair.rate) return;

    let cancelled = false;
    setLoadingDetail(true);
    ratesAxios
      .get(`/pairs/${pair.id}`)
      .then(({ data }) => {
        if (cancelled) return;
        const d: PairDetail = data.data;
        setDetail(d);
        // The rate in effect, else the next approved one, else the one awaiting approval
        prefill(d.liveRate ?? d.scheduledChange ?? d.pendingChange);
      })
      .catch(() => !cancelled && prefill(pair.rate))
      .finally(() => !cancelled && setLoadingDetail(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair?.id]);

  const typeWord = type === "MARKDOWN" ? "Markdown" : "Markup";

  // Client rules; the preview endpoint has the final say on the numbers
  const clientErrors = useMemo(() => {
    const e: Record<string, string> = {};
    const b = baseRate.trim();
    if (!b) e.baseRate = "Base rate is required.";
    else if (!DECIMAL.test(b) || Number(b) <= 0) e.baseRate = "Rate must be greater than zero.";
    else if (!new RegExp(`^\\d+(\\.\\d{1,${rateDp}})?$`).test(b)) e.baseRate = `Use at most ${rateDp} decimal places.`;

    if (type !== "NONE") {
      const v = value.trim();
      if (!v) e.adjustmentValue = `Enter a ${typeWord.toLowerCase()} value.`;
      else if (!DECIMAL.test(v) || Number(v) <= 0) e.adjustmentValue = "Value must be greater than zero.";
      // e.g. switching from Amount to % with a larger number still in the field
      else if (mode === "PERCENT" && Number(v) > 100) e.adjustmentValue = `${typeWord} can't be more than 100%.`;
      else if (type === "MARKDOWN" && (mode === "PERCENT" ? Number(v) >= 100 : !e.baseRate && Number(v) >= Number(b)))
        e.adjustmentValue = "Markdown would result in a negative final rate.";
    }

    if (effectiveFrom && dayjs(effectiveFrom).isBefore(dayjs(), "minute")) e.effectiveFrom = "Effective date can't be in the past.";

    if (!reason.trim()) e.reason = "Reason is required.";
    else if (reason.length > 500) e.reason = "Reason cannot exceed 500 characters.";
    return e;
  }, [baseRate, type, mode, value, effectiveFrom, reason, typeWord, rateDp]);

  const shown = (field: string) =>
    apiErrors[field] || ((submitted || touched[field]) ? clientErrors[field] : undefined);
  const errors = {
    baseRate: shown("baseRate"),
    adjustmentValue: shown("adjustmentValue"),
    effectiveFrom: shown("effectiveFrom"),
    reason: shown("reason"),
  };
  const hasShownErrors = Object.values(errors).some(Boolean);
  const previewInvalid = !!errors.baseRate || !!errors.adjustmentValue;

  const adjustmentBody = () => (type === "NONE" ? undefined : { type, mode, value: value.trim() });

  // Debounced preview: never calculate rates in JS
  const [debounced] = useDebouncedValue(JSON.stringify([baseRate, type, mode, value]), 400);
  useEffect(() => {
    if (!pair) return;
    if (clientErrors.baseRate || clientErrors.adjustmentValue) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    ratesAxios
      .post(`/pairs/${pair.id}/preview`, { baseRate: baseRate.trim(), adjustment: adjustmentBody() })
      .then(({ data }) => {
        if (cancelled) return;
        setPreview(data.data);
        setApiErrors((e) => ({ ...e, baseRate: "", adjustmentValue: "" }));
      })
      .catch((error) => {
        if (cancelled) return;
        setPreview(null);
        const fields = apiFieldErrors(error);
        setApiErrors((e) => ({
          ...e,
          baseRate: fields.baseRate ?? "",
          adjustmentValue: adjustmentError(fields),
        }));
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, pair?.id]);

  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));
  const clearApi = (field: string) => setApiErrors((e) => (e[field] ? { ...e, [field]: "" } : e));

  const submit = async () => {
    if (!pair) return;
    setSubmitted(true);
    if (Object.keys(clientErrors).length || Object.values(apiErrors).some(Boolean)) return;

    setSaving(true);
    try {
      const { data } = await ratesAxios.post(`/pairs/${pair.id}/changes`, {
        baseRate: baseRate.trim(),
        adjustment: adjustmentBody(),
        effectiveFrom: effectiveFrom ? dayjs(effectiveFrom).startOf("minute").toISOString() : undefined,
        reason: reason.trim(),
      });
      const change: RateChange | undefined = data.data?.change ?? data.data;
      const code = `${pair.baseCurrency.code} / ${pair.targetCurrency.code}`;
      if (change?.status === "LIVE") {
        notify({ tone: "success", title: "Rate set", body: `${code} is now live at ${formatRate(change.finalRate)}.` });
      } else if (change?.status === "SCHEDULED") {
        notify({ tone: "success", title: "Rate scheduled",
          body: `${code} goes live on ${dayjs(change.effectiveFrom).format("DD MMM YYYY, HH:mm")}.` });
      } else {
        notify({ tone: "success", title: "Rate submitted for approval", body: `${code} change is pending. Live rate is unchanged.` });
      }
      onSubmitted();
      onClose();
    } catch (error) {
      const fields = apiFieldErrors(error);
      const adjustment = adjustmentError(fields);
      if (adjustment) fields.adjustmentValue = adjustment;
      setApiErrors(fields);
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const activeRate = live?.finalRate ?? pair.liveFinalRate;
      // Field errors are shown on the fields; otherwise say why (e.g. "This is the rate already live…")
      const reason = Object.keys(fields).length ? "" : `${apiMessage(error).replace(/\.?$/, ".")} `;
      notify({
        tone: "error",
        title: "Rate update failed",
        body: `${reason}${activeRate
          ? `Previous active rate ${formatRate(activeRate)} remains in effect. Nothing was saved.`
          : "Nothing was saved."}`,
      });
      // 409: another change is already waiting for approval; 404: the pair is gone.
      // Refresh the page behind so it shows Review / drops the pair.
      if (status === 409 || status === 404) {
        onSubmitted();
        if (status === 404) onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const disabled = submitted && hasShownErrors;
  const target = pair?.targetCurrency;
  const base = pair?.baseCurrency;
  const amountSign = type === "MARKDOWN" ? "-" : "+";

  return (
    <Drawer opened={!!pair} onClose={onClose} position="right" size={631} padding={0}
      withCloseButton={false} aria-labelledby="set-rate-title"
      classNames={{ content: classes.reviewDrawer, body: classes.reviewBody }}>
      {pair && target && base && (
        <>
          {/* While GET /pairs/:id loads the rate being edited */}
          <LoadingOverlay visible={loadingDetail} zIndex={20} overlayProps={{ blur: 1 }}
            loaderProps={{ color: "var(--prune-primary-600)" }} />
          <Box className={classes.reviewTopBar}>
            <Box className={classes.reviewNav} />
            <Box className={classes.reviewTitleRow}>
              <Text id="set-rate-title" className={classes.reviewTitle}>
                {editing ? "Edit rate" : "Set rate"} · {base.code} / {target.code}
              </Text>
              <Text className={classes.setRateSubtitle}>
                {requiresApproval
                  ? "Changes require approval before they affect live transactions."
                  : "Changes take effect on live transactions from the effective date."}
              </Text>
              <UnstyledButton className={classes.reviewClose} onClick={onClose} aria-label="Close">
                <Icon name="drawer-close" />
              </UnstyledButton>
            </Box>
          </Box>

          {submitted && hasShownErrors && (
            <Box className={classes.reviewSection}>
              <Box className={`${classes.notice} ${classes.noticeError}`} role="alert">
                <Icon name="alert-triangle" />
                <Box className={classes.noticeText}>
                  <Text className={classes.noticeTitle}>Some fields need attention</Text>
                  <Text className={classes.noticeBody}>Fix the highlighted fields below before you submit this rate.</Text>
                </Box>
              </Box>
            </Box>
          )}

          {/* Base rate + effective date */}
          <Box className={classes.setRateRow}>
            <Box className={classes.baseRateCol}>
              {/* Shared floating-label number input; the target currency sits on the left */}
              <NumberInputWithInsideLabel label={`Base rate (${target.code} per 1 ${base.code})`} withAsterisk={false}
                hideControls allowNegative={false} decimalScale={rateDp} value={baseRate}
                error={errors.baseRate || undefined}
                leftSection={
                  <span className={classes.rateCurrency}>
                    <CountryFlag code={currencyFlagCode(target.code, target.countryCode)} size={24}
                      round style={{ width: 24, height: 24 }} />
                    {target.code}
                  </span>
                }
                leftSectionWidth={88}
                styles={{ label: { paddingLeft: 88 } }}
                onChange={(v) => { setBaseRate(asText(v)); clearApi("baseRate"); }}
                onBlur={() => touch("baseRate")} />
              {!errors.baseRate && (
                <Text className={classes.rateHint}>
                  Current live base rate: {formatRate(preview?.currentLiveBaseRate ?? live?.baseRate) === "-"
                    ? "None yet" : formatRate(preview?.currentLiveBaseRate ?? live?.baseRate)}
                </Text>
              )}
            </Box>
            <Box className={classes.baseRateCol} style={{ flex: 1, width: "auto" }}>
              <Box className={classes.dateField} data-error={errors.effectiveFrom ? true : undefined}>
                <span className={classes.dateFieldLabel}>Effective date &amp; time</span>
                <DateTimePicker value={effectiveFrom} onChange={(d) => { setEffectiveFrom(d); touch("effectiveFrom"); }}
                  minDate={new Date()} valueFormat="DD MMM YYYY, HH:mm" placeholder="On approval" clearable
                  aria-label="Effective date and time" variant="unstyled"
                  classNames={{ input: classes.dateFieldInput, section: classes.dateFieldSection }}
                  rightSection={effectiveFrom ? undefined : <Icon name="calendar-24" />}
                  rightSectionPointerEvents={effectiveFrom ? "all" : "none"} rightSectionWidth={46} />
              </Box>
              {errors.effectiveFrom && <Text className={classes.fieldError}>{errors.effectiveFrom}</Text>}
            </Box>
          </Box>

          {/* Adjustment type */}
          <Box className={classes.reviewSection}>
            <Segmented label="Adjustment type" className={classes.segmented} value={type}
              onChange={(v) => { setType(v); clearApi("adjustmentValue"); }}
              options={typeOptions} />
          </Box>

          {type !== "NONE" && (
            <Box className={classes.setRateRow}>
              <Segmented label="Adjustment mode" className={`${classes.segmented} ${classes.modeSegmented}`} value={mode}
                onChange={(v) => { setMode(v); clearApi("adjustmentValue"); }}
                options={modeOptions} />
              <Box className={classes.baseRateCol} style={{ flex: 1, width: "auto" }}>
                <NumberInputWithInsideLabel label={`${typeWord} value`} withAsterisk={false}
                  hideControls allowNegative={false} decimalScale={rateDp} value={value}
                  // A percentage can't go above 100: keystrokes that would exceed it are ignored
                  isAllowed={({ floatValue }) => mode !== "PERCENT" || floatValue === undefined || floatValue <= 100}
                  error={errors.adjustmentValue || undefined}
                  rightSection={mode === "PERCENT" ? <Icon name="percent" /> : <span className={classes.rateFieldUnit}>{target.code}</span>}
                  rightSectionWidth={56}
                  onChange={(v) => { setValue(asText(v)); clearApi("adjustmentValue"); }}
                  onBlur={() => touch("adjustmentValue")} />
              </Box>
            </Box>
          )}

          {/* Calculation preview (from the API) */}
          <Box className={classes.previewWrap}>
            <Box className={classes.previewBox} data-error={previewInvalid || undefined} aria-live="polite">
              <Text className={classes.previewTitle} style={{ fontFamily: inter.style.fontFamily }}>Calculation preview</Text>
              <Box className={classes.previewRows}>
                <Box className={classes.previewLine}>
                  <span className={classes.previewLabel}>Base rate</span>
                  <span className={previewInvalid ? classes.previewDanger : undefined}>
                    {previewInvalid ? `0.00 ${target.code}` : preview ? `${formatRate(preview.baseRate)} ${target.code}` : "-"}
                  </span>
                </Box>
                {type !== "NONE" && (
                  <Box className={classes.previewLine}>
                    <span className={classes.previewLabel}>
                      {typeWord} ({preview?.adjustment.label ?? `${amountSign}${value || "0"}${mode === "PERCENT" ? "%" : ` ${target.code}`}`})
                    </span>
                    <span className={previewInvalid || type === "MARKDOWN" ? classes.previewDanger : classes.previewGain}>
                      {previewInvalid ? `${amountSign} 0.00` : preview?.adjustmentAmount
                        ? `${amountSign} ${formatRate(preview.adjustmentAmount.replace(/^[+-]\s*/, ""))}` : "-"}
                    </span>
                  </Box>
                )}
                <Box className={classes.previewDivider}><Icon name="preview-divider" /></Box>
                <Box className={classes.finalRow} data-invalid={previewInvalid || undefined}>
                  <span>Final rate</span>
                  <span className={previewInvalid ? classes.previewDanger : undefined}>
                    {previewInvalid ? "Not Valid" : preview ? `${formatRate(preview.finalRate)} ${target.code}` : "-"}
                  </span>
                </Box>
                <Box className={classes.inverseRow}>
                  {previewInvalid ? (
                    <span className={classes.previewDanger}>Inverse rate can&apos;t be calculated for an invalid rate</span>
                  ) : (
                    <>
                      <span className={classes.previewLabel}>Inverse rate (1/{preview ? formatRate(preview.finalRate) : "-"})</span>
                      <strong>{preview ? `${preview.inverseRate} ${base.code} per ${target.code}` : "-"}</strong>
                    </>
                  )}
                </Box>
                {!previewInvalid && (
                  <Text className={classes.previewNote}>
                    Rounded to {(preview?.precision ?? rules)?.inverse ?? 6} decimal place, {roundingLabel((preview?.precision ?? rules)?.rounding)}
                  </Text>
                )}
              </Box>
            </Box>
          </Box>

          {/* Reason */}
          <Box className={classes.reviewSection}>
            <TextareaWithInsideLabel standard label="Reason for change" withAsterisk value={reason}
              placeholder="e.g. New corridor launch for UK → Nigeria" error={errors.reason || undefined}
              onChange={(e) => { setReason(e.currentTarget.value); clearApi("reason"); }} onBlur={() => reason && touch("reason")} />
          </Box>

          {requiresApproval && (
            <Box className={classes.reviewSection}>
              <Box className={classes.makerNote}>
                <Icon name="shield" />
                <Box className={classes.noticeText}>
                  <Text className={classes.makerTitle}>Maker-checker is enabled - Approval Required</Text>
                  <Text className={classes.warnBody}>This will remain pending until approved. Live transactions aren&apos;t affected.</Text>
                </Box>
              </Box>
            </Box>
          )}

          <Box className={classes.reviewFooter}>
            <SecondaryBtn text="Cancel" action={onClose} fz={14} fw={600}
              bg="#fbfee6" bd="none" c="#344054" />
            <PrimaryBtn text={requiresApproval ? "Submit for approval" : "Set rate"} action={submit} loading={saving}
              disabled={disabled} fz={14} fw={600} c={disabled ? "#98a2b3" : "#344054"}
              color={disabled ? "#eaecf0" : "#c1dd06"} />
          </Box>
        </>
      )}
    </Drawer>
  );
}
