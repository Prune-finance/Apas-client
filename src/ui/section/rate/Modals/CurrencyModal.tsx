"use client";

import { useEffect, useState } from "react";
import { Box, Modal, Switch, Text, UnstyledButton } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import CountryFlag from "@/ui/components/CountryFlag";
import useNotification from "@/lib/hooks/notification";
import { inter } from "@/ui/fonts";
import {
  apiFieldErrors,
  apiMessage,
  CurrencyFlags,
  RateCurrency,
  invalidateRatesMeta, ratesAxios,
} from "@/lib/hooks/rates";
import classes from "../styles.module.scss";
import { Icon } from "../shared";

// Add (POST /currencies) or edit (PATCH /currencies/:code) a rate currency.
// Laid out like the Add Currency Pair dialog.

type Values = {
  code: string;
  name: string;
  symbol: string;
  countryCode: string;
} & Required<CurrencyFlags>;

const empty: Values = {
  code: "",
  name: "",
  symbol: "",
  countryCode: "",
  remittanceEnabled: true,
  conversionInboundEnabled: true,
  conversionOutboundEnabled: true,
};

const FLAGS: {
  key: keyof CurrencyFlags;
  label: string;
  description: string;
}[] = [
  {
    key: "remittanceEnabled",
    label: "Remittance",
    description: "Can be used for remittance payouts.",
  },
  {
    key: "conversionInboundEnabled",
    label: "Conversion inbound",
    description: "Other currencies can be converted into it.",
  },
  {
    key: "conversionOutboundEnabled",
    label: "Conversion outbound",
    description: "It can be converted into other currencies.",
  },
];

const toValues = (c: RateCurrency): Values => ({
  code: c.code,
  name: c.name,
  symbol: c.symbol ?? "",
  countryCode: c.countryCode ?? "",
  remittanceEnabled: !!c.remittanceEnabled,
  conversionInboundEnabled: !!c.conversionInboundEnabled,
  conversionOutboundEnabled: !!c.conversionOutboundEnabled,
});

export default function CurrencyModal({
  opened,
  currency,
  onClose,
  onSaved,
}: {
  opened: boolean;
  /** Set to edit that currency; leave empty to add one */
  currency?: RateCurrency | null;
  onClose: () => void;
  onSaved: (currency: RateCurrency) => void;
}) {
  const { handleSuccess, handleError } = useNotification();
  const editing = !!currency;
  const [values, setValues] = useState<Values>(empty);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!opened) return;
    setValues(currency ? toValues(currency) : empty);
    setReason("");
    setErrors({});
  }, [opened, currency]);

  const original = currency ? toValues(currency) : null;
  const changed = original
    ? (Object.keys(values) as (keyof Values)[]).filter(
        (k) => k !== "code" && values[k] !== original[k],
      )
    : [];

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "", form: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^[A-Z]{3}$/.test(values.code))
      e.code = "Enter a 3-letter ISO code, e.g. NGN";
    if (!values.name.trim()) e.name = "Enter the currency name";
    if (!values.symbol.trim()) e.symbol = "Enter the currency symbol";
    else if (values.symbol.trim().length > 5)
      e.symbol = "Symbol cannot exceed 5 characters";
    if (values.countryCode && !/^[A-Z]{2}$/.test(values.countryCode))
      e.countryCode = "Enter a 2-letter country code, e.g. NG";
    if (reason.trim().length < 3)
      e.reason = "Enter a reason (at least 3 characters)";
    else if (reason.length > 500)
      e.reason = "Reason cannot exceed 500 characters";
    if (editing && !changed.length)
      e.form = "Change at least one field to save.";
    return e;
  };

  const submit = async () => {
    if (saving) return;
    const e = validate();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    const body: Record<string, unknown> = editing
      ? Object.fromEntries(
          changed.map((k) => [
            k,
            typeof values[k] === "string"
              ? (values[k] as string).trim() || null
              : values[k],
          ]),
        )
      : {
          ...values,
          name: values.name.trim(),
          symbol: values.symbol.trim(),
          countryCode: values.countryCode || null,
        };

    setSaving(true);
    try {
      const { data } = editing
        ? await ratesAxios.patch(`/currencies/${currency!.code}`, {
            ...body,
            reason: reason.trim(),
          })
        : await ratesAxios.post("/currencies", {
            ...body,
            reason: reason.trim(),
          });
      handleSuccess(
        editing ? "Currency updated" : "Currency added",
        `${values.code} was ${editing ? "updated" : "added to the rate currencies"}.`,
      );
      invalidateRatesMeta();
      onSaved(data.data);
      onClose();
    } catch (error) {
      setErrors(apiFieldErrors(error));
      handleError(
        editing ? "Could not update currency" : "Could not add currency",
        apiMessage(error),
      );
    } finally {
      setSaving(false);
    }
  };

  const upper = (v: string, max: number) =>
    v
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, max);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!saving) onClose();
      }}
      closeOnClickOutside={!saving}
      closeOnEscape={!saving}
      centered
      size={668}
      padding={0}
      radius={16}
      withCloseButton={false}
      aria-labelledby="currency-modal-title"
      classNames={{ content: classes.addDialog }}
    >
      <form
        className={classes.addBody}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <Box className={classes.addHeader}>
          <Box>
            <Text
              id="currency-modal-title"
              className={classes.addTitle}
              style={{ fontFamily: "'EksellDisplay', serif" }}
            >
              {editing ? `Edit ${currency!.code}` : "Add Currency"}
            </Text>
            <Text
              className={classes.addSubtitle}
              style={{ fontFamily: inter.style.fontFamily }}
            >
              {editing
                ? "Update how this currency can be used. Changes are recorded in the audit log."
                : "Add a currency so it can be used in currency pairs."}
            </Text>
          </Box>
          <UnstyledButton
            className={classes.addClose}
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="modal-close" />
          </UnstyledButton>
        </Box>

        <Box className={classes.addDivider} />

        <Box className={classes.currencyFormGrid}>
          <TextInputWithInsideLabel
            label="Currency code"
            withAsterisk
            value={values.code}
            disabled={saving || editing}
            onChange={(e) => set("code", upper(e.currentTarget.value, 3))}
            error={errors.code || undefined}
            leftSection={
              values.countryCode.length === 2 ? (
                <CountryFlag code={values.countryCode} size={20} />
              ) : undefined
            }
          />
          <TextInputWithInsideLabel
            label="Currency name"
            withAsterisk
            value={values.name}
            disabled={saving}
            onChange={(e) => set("name", e.currentTarget.value)}
            error={errors.name || undefined}
          />
          <TextInputWithInsideLabel
            label="Symbol"
            withAsterisk
            value={values.symbol}
            disabled={saving}
            onChange={(e) => set("symbol", e.currentTarget.value)}
            error={errors.symbol || undefined}
          />
          <TextInputWithInsideLabel
            label="Country code"
            value={values.countryCode}
            disabled={saving}
            onChange={(e) =>
              set("countryCode", upper(e.currentTarget.value, 2))
            }
            error={errors.countryCode || undefined}
          />
        </Box>

        <Box className={classes.currencyFlags}>
          {FLAGS.map((f) => (
            <Switch
              key={f.key}
              label={f.label}
              description={f.description}
              checked={values[f.key]}
              disabled={saving}
              onChange={(e) => set(f.key, e.currentTarget.checked)}
              color="var(--prune-primary-600)"
              size="md"
              classNames={{
                track: classes.switchTrack,
                label: classes.flagLabel,
                description: classes.flagDescription,
              }}
            />
          ))}
        </Box>

        <TextareaWithInsideLabel
          standard
          label="Reason for change"
          withAsterisk
          disabled={saving}
          value={reason}
          onChange={(e) => {
            setReason(e.currentTarget.value);
            setErrors((er) => ({ ...er, reason: "", form: "" }));
          }}
          placeholder={
            editing
              ? "e.g. Outbound paused by treasury"
              : "e.g. New corridor launch"
          }
          error={errors.reason || undefined}
        />

        {errors.form && (
          <Text className={classes.fieldError} role="alert">
            {errors.form}
          </Text>
        )}

        <Box className={classes.addDivider} />

        <Box className={classes.addFooter}>
          <SecondaryBtn
            text="Cancel"
            action={onClose}
            disabled={saving}
            h={48}
            px={32}
            fz={14}
            fw={500}
            bg="#fbfee6"
            bd="none"
            c="#344054"
          />
          <PrimaryBtn
            text={editing ? "Save changes" : "Add currency"}
            type="submit"
            loading={saving}
            h={48}
            px={32}
            fz={14}
            fw={500}
            c="#344054"
            color="#c1dd06"
          />
        </Box>
      </form>
    </Modal>
  );
}
