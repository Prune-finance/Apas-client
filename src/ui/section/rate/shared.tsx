"use client";

import { Select, SelectProps } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { formatRate } from "@/lib/hooks/rates";
import classes from "./styles.module.scss";

export function Icon({ name }: { name: string }) {
  // SVGs keep their intrinsic Figma dimensions.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/rate/${name}.svg`} alt="" aria-hidden="true" />;
}

export type Tone = [bg: string, fg: string];

export const Pill = ({ tone, label }: { tone: Tone; label: string }) => (
  <span className={classes.pill} style={{ background: tone[0], color: tone[1] }}>{label}</span>
);

export const Avatar = ({ name }: { name: string }) => (
  <span className={classes.avatar}>
    <Icon name="avatar-bg" />
    <span>{(name || "?").charAt(0).toUpperCase()}</span>
  </span>
);

export const AdminCell = ({ name }: { name?: string | null }) => (
  <span className={classes.adminCell}>
    <Avatar name={name ?? "System"} />
    {name ?? "System"}
  </span>
);

// Audit event badge colours (Figma audit tables)
export const EVENT_TONE: Record<string, Tone> = {
  RATE_SUBMITTED: ["#fff9e6", "#b26205"],
  RATE_REJECTED: ["#fff3f0", "#db340b"],
  RATE_APPROVED: ["#e8faf0", "#12b76a"],
  PAIR_ENABLED: ["#e8faf0", "#12b76a"],
  PAIR_CREATED: ["#fbfee6", "#97ad05"],
  RATE_ACTIVATED: ["#f2f7ff", "#0a69fa"],
  CURRENCY_CREATED: ["#fbfee6", "#97ad05"],
  CURRENCY_UPDATED: ["#f2f7ff", "#0a69fa"],
  PAIR_DISABLED: ["#eaecf0", "#667085"],
  CURRENCY_DELETED: ["#eaecf0", "#667085"],
};
export const GREY: Tone = ["#eaecf0", "#667085"];

export const CHANNEL: Record<string, { tone: Tone; label: string }> = {
  PORTAL: { tone: GREY, label: "Portal" },
  API: { tone: ["#f2f7ff", "#0a69fa"], label: "API" },
  SYSTEM: { tone: GREY, label: "System" },
};

/** 48px "Dropdown - Standard" from the Figma filter rows. */
export function FilterSelect({ width, ...props }: SelectProps & { width: number }) {
  return (
    <Select
      w={width}
      className={classes.auditSelect}
      classNames={{ input: classes.auditInput, section: classes.auditSection }}
      rightSection={<Icon name="chevron-down" />}
      rightSectionPointerEvents="none"
      rightSectionWidth={49}
      allowDeselect
      {...props}
    />
  );
}

export type DateRange = [Date | null, Date | null];

/** Date range "Text Field - Standard" with the calendar icon. */
export function FilterDateRange({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  return (
    <DatePickerInput
      type="range"
      className={classes.auditDate}
      placeholder="All dates"
      valueFormat="DD MMM YYYY"
      allowSingleDateInRange
      numberOfColumns={2}
      classNames={{ input: classes.auditDateInput, section: classes.auditSection }}
      leftSection={<Icon name="calendar" />}
      leftSectionWidth={47}
      leftSectionPointerEvents="none"
      value={value}
      onChange={(v) => onChange(v as DateRange)}
      aria-label="Filter by date"
    />
  );
}

/** A range only applies once both ends are picked; the API takes YYYY-MM-DD. */
export const rangeParams = ([start, end]: DateRange) =>
  start && end
    ? { from: dayjs(start).format("YYYY-MM-DD"), to: dayjs(end).format("YYYY-MM-DD") }
    : { from: null, to: null };

// "What changed" values arrive raw (ISO dates, enum codes, plain decimals)
const CHANGE_STATUS_LABEL: Record<string, string> = {
  LIVE: "Live", SCHEDULED: "Scheduled", PENDING_APPROVAL: "Pending approval", SUPERSEDED: "Superseded", REJECTED: "Rejected",
  ENABLED: "Enabled", DISABLED: "Disabled", PENDING: "Pending",
};
const RATE_FIELDS = new Set(["baseRate", "finalRate", "inverseRate", "previousValue", "newValue"]);

export function formatChangeValue(field: string, value: string | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  if (/^\d{4}-\d{2}-\d{2}T/.test(value) && dayjs(value).isValid()) return dayjs(value).format("DD MMM YYYY, HH:mm");
  if (RATE_FIELDS.has(field)) return formatRate(value);
  if (value === "true" || value === "false") return value === "true" ? "Yes" : "No";
  return CHANGE_STATUS_LABEL[value] ?? value;
}
