"use client";

import { Portal, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { IconCalendarMonth, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import {
  Children,
  isValidElement,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import dayjs from "dayjs";
import classes from "./filter.module.scss";

export type StatusOption = string | { value: string; label: string };

type Props<T> = {
  opened: boolean;
  /** Closes the panel (the page's Filter button opens it) */
  toggle?: () => void;
  children?: ReactNode;
  form: UseFormReturnType<T>;
  isStatus?: boolean;
  approvalStatus?: boolean;
  frozenStatus?: boolean;
  /** Plain strings, or { value, label } to show a friendly label and send the enum value */
  customStatusOption?: StatusOption[];
  noDate?: boolean;
  onApply?: (values: T) => void;
  onAfterApply?: (values: T) => void;
  onClear?: () => void;
  /** No longer used: fields always fill the panel width */
  stretch?: boolean;
  title?: string;
};

/** Labelled wrapper for one field inside the panel. */
export function FilterField({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className={classes.field}>
      {label && <label className={classes.fieldLabel}>{label}</label>}
      {children}
    </div>
  );
}

// A range with only the start picked filters on that single day
const completeRanges = <T,>(values: T): T => {
  const out = { ...(values as Record<string, unknown>) };
  Object.entries(out).forEach(([k, v]) => {
    if (Array.isArray(v) && v.length === 2 && !!v[0] !== !!v[1]) out[k] = [v[0] ?? v[1], v[0] ?? v[1]];
  });
  return out as T;
};

// Each field's label comes from its own label, placeholder or aria-label
const fieldLabel = (props: Record<string, unknown>) =>
  [props.placeholder, props["aria-label"]].find((v) => typeof v === "string") as string | undefined;

export default function Filter<T>({
  opened,
  toggle,
  children,
  form,
  isStatus,
  approvalStatus,
  frozenStatus,
  customStatusOption,
  noDate,
  onApply,
  onAfterApply,
  onClear,
  title = "Filters",
}: Props<T>) {
  const pathname = usePathname();
  // Values on screen are a draft until Apply; closing without applying restores these
  const applied = useRef<T>(form.values);

  const close = () => toggle?.();

  // Opening snapshots the applied values (pages may set them from the URL);
  // closing without Apply throws the draft away
  useEffect(() => {
    if (opened) {
      applied.current = form.values;
      return;
    }
    if (JSON.stringify(form.values) !== JSON.stringify(applied.current)) form.setValues(applied.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const writeUrl = (values: Record<string, unknown>) => {
    const currentSearchParams = new URLSearchParams(window.location.search);

    Object.entries(values).forEach(([key, val]) => {
      if (key === "createdAt") {
        currentSearchParams.delete("date");
        currentSearchParams.delete("endDate");

        const [startDate, endDate] = Array.isArray(val)
          ? (val as [Date | null, Date | null])
          : [null, null];
        const start = startDate ? dayjs(startDate).format("YYYY-MM-DD") : null;
        const end = endDate ? dayjs(endDate).format("YYYY-MM-DD") : null;

        if (start && end) {
          currentSearchParams.set("date", start);
          // Same start and end means a single day
          if (start !== end) currentSearchParams.set("endDate", end);
        }
        return;
      }

      if (!val) {
        currentSearchParams.delete(key);
        return;
      }

      // Status values are sent uppercase
      currentSearchParams.set(
        key,
        key === "status" && typeof val === "string" ? val.toUpperCase() : String(val)
      );
    });

    const query = currentSearchParams.toString();
    window.history.pushState({}, "", query ? `${pathname}?${query}` : pathname);
  };

  const handleApply = () => {
    if (form.validate().hasErrors) return;
    const values = completeRanges(form.values);
    form.setValues(values);
    applied.current = values;

    if (onApply) onApply(values);
    else {
      writeUrl(values as Record<string, unknown>);
      onAfterApply?.(values);
    }
    close();
  };

  const handleClear = () => {
    form.reset();
    applied.current = form.getInitialValues();

    const currentUrl = new URL(window.location.href);
    const kept = new URLSearchParams();
    const tabParam = currentUrl.searchParams.get("tab");
    const currencyParam = currentUrl.searchParams.get("currency");
    if (tabParam) kept.set("tab", tabParam);
    if (currencyParam) kept.set("currency", currencyParam);
    const query = kept.toString();
    window.history.pushState({}, "", query ? `${pathname}?${query}` : pathname);
    onClear?.();
  };

  // Enter in a text field applies, like the Apply button
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (e.key === "Enter" && el instanceof HTMLInputElement && !el.readOnly) {
      e.preventDefault();
      handleApply();
    }
  };

  return (
    <Portal>
      <div className={classes.backdrop} data-open={opened || undefined} onClick={close} aria-hidden="true" />

      <div className={classes.panel} data-open={opened || undefined} role="dialog" aria-modal="true"
        aria-label={title} aria-hidden={!opened}>
        <div className={classes.header}>
          <span className={classes.title}>{title}</span>
          <button type="button" className={classes.close} onClick={close} aria-label="Close filters">
            <IconX size={14} color="#667085" />
          </button>
        </div>

        <div className={classes.fields} onKeyDown={handleKeyDown}>
          {Children.map(children, (child) =>
            isValidElement(child) ? (
              <FilterField label={(child.props as { label?: unknown }).label ? undefined : fieldLabel(child.props as Record<string, unknown>)}>
                {child}
              </FilterField>
            ) : child
          )}

          {!noDate && (
            <FilterField label="Date Range">
              <DatePickerInput
                placeholder="DD-MM-YYYY – DD-MM-YYYY"
                valueFormat="DD-MM-YYYY"
                {...form.getInputProps("createdAt")}
                type="range"
                allowSingleDateInRange
                leftSection={<IconCalendarMonth size={14} />}
                popoverProps={{ middlewares: { flip: true, shift: true } }}
                clearable
              />
            </FilterField>
          )}

          {!isStatus && (
            <FilterField label="Status">
              <Select
                placeholder="Status"
                {...form.getInputProps("status")}
                data={
                  customStatusOption && customStatusOption?.length > 0
                    ? customStatusOption
                    : approvalStatus
                    ? approvalOptions
                    : frozenStatus
                    ? frozenActiveOptions
                    : ["Active", "Inactive", "Frozen", "Deactivated"]
                }
                clearable
              />
            </FilterField>
          )}
        </div>

        <div className={classes.footer}>
          <button type="button" className={classes.clearBtn} onClick={handleClear}>Clear all</button>
          <button type="button" className={classes.applyBtn} onClick={handleApply}>Apply</button>
        </div>
      </div>
    </Portal>
  );
}

const approvalOptions = [
  "Approved",
  "Cancelled",
  "Pending",
  "Rejected",
  "Confirmed",
  "Failed",
];

const frozenActiveOptions = ["Active", "Inactive", "Frozen"];
