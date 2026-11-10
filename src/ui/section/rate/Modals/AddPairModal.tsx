"use client";

import { useEffect, useState } from "react";
import { Box, Checkbox, Modal, Text, UnstyledButton } from "@mantine/core";
import { isAxiosError } from "axios";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SelectInputWithInsideLabel, TextareaWithInsideLabel } from "@/ui/components/InputWithLabel";
import CountryFlag, { currencyFlagCode } from "@/ui/components/CountryFlag";
import useNotification from "@/lib/hooks/notification";
import { inter } from "@/ui/fonts";
import {
  apiFieldErrors,
  apiMessage,
  RateCurrency,
  RatePairRow,
  RatesMeta,
  ratesAxios,
  invalidateRatesMeta,
} from "@/lib/hooks/rates";
import classes from "../styles.module.scss";

// Figma: Add Currency Pair (15670:330830 default · 15671:331401 errors · 15678:365703 dropdown open)

function Icon({ name }: { name: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/rate/${name}.svg`} alt="" aria-hidden="true" />;
}

const Flag = ({ currency }: { currency: RateCurrency }) => (
  <CountryFlag code={currencyFlagCode(currency.code, currency.countryCode)} size={24}
    round style={{ width: 24, height: 24 }} />
);

function CurrencySelect({
  label,
  value,
  onChange,
  currencies,
  error,
  taggedCode,
  tagText,
  loading,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (code: string) => void;
  currencies: RateCurrency[];
  error?: boolean;
  taggedCode?: string;
  tagText?: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  const selected = currencies.find((c) => c.code === value);

  return (
    <SelectInputWithInsideLabel
      className={classes.currencySelect}
      data-has-value={!!selected || undefined}
      label={label}
      aria-label={label}
      withAsterisk={false}
      value={value || null}
      onChange={(code) => onChange(code ?? "")}
      data={currencies.map(currency => ({ value: currency.code, label: `${currency.code} - ${currency.name}` }))}
      error={error}
      disabled={disabled || (loading && !currencies.length)}
      allowDeselect={false}
      searchable
      nothingFoundMessage={loading ? "Loading currencies…" : "No currencies available"}
      leftSection={selected ? <Flag currency={selected} /> : undefined}
      leftSectionWidth={48}
      rightSection={<Icon name="select-chevron" />}
      rightSectionWidth={48}
      comboboxProps={{ withinPortal: true, position: "bottom-start", offset: 3 }}
      maxDropdownHeight={280}
      renderOption={({ option }) => {
        const currency = currencies.find(item => item.code === option.value);
        if (!currency) return option.label;
        return <>
          <Flag currency={currency} />
          <span className={classes.optionCode}>{currency.code}</span>
          <span className={classes.optionName}>{currency.name}</span>
          {taggedCode === currency.code && <span className={classes.optionTag}>{tagText}</span>}
        </>;
      }}
      styles={{
        input: { paddingTop: selected ? 16 : 0 },
        label: { top: selected ? 8 : 16, transform: "none", paddingTop: 0, paddingLeft: 48 },
        dropdown: { padding: "12px 0", background: "#f9f9f9", borderRadius: 16 },
        option: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" },
      }}
    />
  );
}

export default function AddPairModal({
  opened,
  onClose,
  meta,
  onCreated,
}: {
  opened: boolean;
  onClose: () => void;
  meta: RatesMeta | null;
  onCreated: () => void;
}) {
  const { handleSuccess, handleError } = useNotification();
  // Currencies come from the rates reference data (GET /meta)
  const currencies = meta?.currencies ?? [];
  const currenciesLoading = !meta;

  const [base, setBase] = useState("");
  const [target, setTarget] = useState("");
  const [reason, setReason] = useState("");
  const [enableOnFirstApproval, setEnableOnFirstApproval] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existing, setExisting] = useState<RatePairRow | null>(null);
  const [saving, setSaving] = useState(false);

  const baseCurrency = currencies.find((c) => c.code === base);
  const targetCurrency = currencies.find((c) => c.code === target);
  const sameCurrency = Boolean(base && target && base === target);
  const code = base && target ? `${base}/${target}` : "";

  // Reset whenever the dialog opens
  useEffect(() => {
    if (!opened) return;
    setBase("");
    setTarget("");
    setReason("");
    setEnableOnFirstApproval(true);
    setErrors({});
    setExisting(null);
  }, [opened]);

  // Duplicate check as soon as both currencies are chosen
  useEffect(() => {
    setExisting(null);
    if (!opened || !code || sameCurrency) return;
    let cancelled = false;
    ratesAxios
      .get("/pairs", { params: { search: code, limit: 10 } })
      .then(({ data }) => {
        if (cancelled) return;
        const match = (data.data as RatePairRow[] | undefined)?.find((p) => p.code === code);
        setExisting(match ?? null);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [opened, code, sameCurrency]);

  const blocked = sameCurrency || Boolean(existing);

  const submit = async () => {
    if (saving) return;
    const next: Record<string, string> = {};
    if (!base) next.baseCurrency = "Choose a base currency";
    if (!target) next.targetCurrency = "Choose a target currency";
    if (reason.trim().length < 3) next.reason = "Enter a reason (at least 3 characters)";
    else if (reason.length > 500) next.reason = "Reason cannot exceed 500 characters";
    setErrors(next);
    if (Object.keys(next).length || blocked) return;

    setSaving(true);
    try {
      await ratesAxios.post("/pairs", {
        baseCurrency: base,
        targetCurrency: target,
        reason: reason.trim(),
        enableOnFirstApproval,
      });
      handleSuccess("Pair added", `${code} was created. Set a rate to send it for approval.`);
      invalidateRatesMeta(); // base currencies can change with a new pair
      onCreated();
      onClose();
    } catch (error) {
      setErrors(apiFieldErrors(error));
      // 409: the pair already exists — show it in the banner
      if (isAxiosError(error) && error.response?.status === 409) {
        setExisting({ code, status: "ENABLED" } as RatePairRow);
      } else {
        handleError("Could not add pair", apiMessage(error));
      }
    } finally {
      setSaving(false);
    }
  };

  const statusText = (s?: string) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : "");

  return (
    <Modal opened={opened} onClose={() => { if (!saving) onClose(); }} closeOnClickOutside={!saving} closeOnEscape={!saving} centered size={668} padding={0} radius={16}
      withCloseButton={false} aria-labelledby="add-pair-title" classNames={{ content: classes.addDialog }}>
      <form className={classes.addBody} onSubmit={event => { event.preventDefault(); void submit(); }}>
        {/* Header */}
        <Box className={classes.addHeader}>
          <Box>
            <Text id="add-pair-title" className={classes.addTitle}
              style={{ fontFamily: "'EksellDisplaySmall', serif", fontWeight: 700 }}>Add Currency Pair</Text>
            <Text className={classes.addSubtitle} style={{ fontFamily: inter.style.fontFamily }}>
              Create a new pair. You can set its rate after the pair is created.
            </Text>
          </Box>
          <UnstyledButton className={classes.addClose} type="button" disabled={saving} onClick={onClose} aria-label="Close">
            <Icon name="modal-close" />
          </UnstyledButton>
        </Box>

        <Box className={classes.addDivider} />

        {/* Duplicate pair */}
        {existing && (
          <Box className={`${classes.notice} ${classes.noticeError}`} role="alert">
            <Icon name="alert-triangle" />
            <Box className={classes.noticeText}>
              <Text className={classes.noticeTitle}>This pair already exists</Text>
              <Text className={classes.noticeBody}>
                {base} / {target} is already configured{existing.status ? ` and ${statusText(existing.status)}` : ""}. Duplicate pairs cannot be created.
              </Text>
            </Box>
          </Box>
        )}

        {/* Base ⇄ Target */}
        <Box className={classes.currencyRow}>
          <CurrencySelect label="Base Currency" value={base} currencies={currencies}
            error={sameCurrency || !!existing || !!errors.baseCurrency}
            taggedCode={target} tagText="Selected as target" loading={currenciesLoading} disabled={saving}
            onChange={(c) => { setBase(c); setErrors((e) => ({ ...e, baseCurrency: "" })); }} />
          <UnstyledButton type="button" disabled={saving} aria-label="Swap base and target" className={classes.currencySwap}
            onClick={() => { setBase(target); setTarget(base); }}>
            <Icon name="switch-horizontal" />
          </UnstyledButton>
          <CurrencySelect label="Target Currency" value={target} currencies={currencies}
            error={sameCurrency || !!existing || !!errors.targetCurrency}
            taggedCode={base} tagText="Selected as base" loading={currenciesLoading} disabled={saving}
            onChange={(c) => { setTarget(c); setErrors((e) => ({ ...e, targetCurrency: "" })); }} />
          {(sameCurrency || errors.baseCurrency || errors.targetCurrency) && (
            <Text className={classes.fieldError} role="alert">
              {sameCurrency
                ? "Base and target currency cannot be the same."
                : errors.baseCurrency || errors.targetCurrency}
            </Text>
          )}
        </Box>

        {/* Quote summary */}
        {baseCurrency && targetCurrency && !blocked && (
          <Box className={`${classes.notice} ${classes.noticeInfo}`}>
            <span className={classes.flagGroup}>
              <Flag currency={baseCurrency} />
              <Flag currency={targetCurrency} />
            </span>
            <Box className={classes.noticeText}>
              <Text className={classes.noticeTitle}>{code}</Text>
              <Text className={classes.noticeBody} c="#667085">
                Quoted as: {target} per 1 {base} · Inverse {target} / {base} derived automatically
              </Text>
            </Box>
          </Box>
        )}

        <TextareaWithInsideLabel standard label="Reason for change" withAsterisk
          disabled={saving} value={reason}
          onChange={(e) => { setReason(e.currentTarget.value); setErrors((er) => ({ ...er, reason: "" })); }}
          placeholder="e.g. New corridor launch for UK → Nigeria" error={errors.reason || undefined} />

        <Checkbox
          label="Enable after the first rate is approved"
          checked={enableOnFirstApproval}
          onChange={event => setEnableOnFirstApproval(event.currentTarget.checked)}
          disabled={saving} size="md" radius={4} color="var(--prune-primary-600)"
          icon={({ className }) => <span className={className}><Icon name="checkbox-check" /></span>}
          classNames={{ root: classes.addCheckbox, label: classes.checkboxLabel }}
        />

        <Box className={classes.addDivider} />

        {/* Footer */}
        <Box className={classes.addFooter}>
          <SecondaryBtn text="Cancel" action={onClose} disabled={saving} fz={14} fw={600}
            bg="#fbfee6" bd="none" c="#344054" />
          <PrimaryBtn text="Create pair" type="submit" loading={saving} disabled={blocked}
            fz={14} fw={600} c={blocked ? "#98a2b3" : "#344054"}
            color={blocked ? "#eaecf0" : "#c1dd06"} />
        </Box>
      </form>
    </Modal>
  );
}
