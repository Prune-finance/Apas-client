"use client";

import { Button, Collapse, Flex, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { IconCalendarMonth } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { FocusEvent, KeyboardEvent, ReactNode, useEffect, useRef } from "react";
import dayjs from "dayjs";
import classes from "./filter.module.scss";

export type StatusOption = string | { value: string; label: string };

type Props<T> = {
  opened: boolean;
  /** Kept for existing callers; the page's Filter button toggles the panel */
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
  /** Stretch the fields to fill the whole row */
  stretch?: boolean;
};

// Date ranges with only the start picked are still being edited — don't apply yet
const hasPartialRange = (values: Record<string, unknown>) =>
  Object.values(values).some(
    (v) => Array.isArray(v) && v.length === 2 && !!v[0] !== !!v[1]
  );

// A focused text field (not a read-only Select input) means the user is still typing
const isTypingIn = (el: Element | null) =>
  el instanceof HTMLInputElement &&
  !el.readOnly &&
  ["text", "search", "email", "number", "tel", ""].includes(el.type);

export default function Filter<T>({
  opened,
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
  stretch,
}: Props<T>) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const initialValues = useRef(JSON.stringify(form.values));
  const lastApplied = useRef(initialValues.current);

  const applyFilters = () => {
    const values = form.values as Record<string, unknown>;
    const serialized = JSON.stringify(values);
    if (serialized === lastApplied.current || hasPartialRange(values)) return;
    lastApplied.current = serialized;

    if (onApply) {
      onApply(form.values as T);
      return;
    }

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
    onAfterApply?.(form.values as T);
  };

  // Selects and the date picker apply as soon as a value is picked;
  // text fields wait for blur or Enter.
  const serializedValues = JSON.stringify(form.values);
  useEffect(() => {
    if (isTypingIn(document.activeElement) && containerRef.current?.contains(document.activeElement)) return;
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedValues]);

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (isTypingIn(e.target)) applyFilters();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && isTypingIn(e.target as Element)) {
      e.preventDefault();
      applyFilters();
    }
  };

  const handleClear = () => {
    form.reset();
    lastApplied.current = initialValues.current;

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

  return (
    <Collapse in={opened}>
      <Text fz={14} fw={600} c="var(--prune-text-gray-700)" mt={24} mb={20}>
        Filter By
      </Text>

      <Flex
        ref={containerRef}
        gap={12}
        align="center"
        mih={40}
        wrap="wrap"
        className={stretch ? classes.stretch : undefined}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {children}

        {!noDate && (
          <DatePickerInput
            placeholder="Date Range"
            valueFormat="DD-MM-YYYY"
            {...form.getInputProps("createdAt")}
            size="xs"
            // A full range ("01-10-2026 – 30-10-2026") plus the icon and clear button
            // needs ~220px; keep it on one line on narrower screens
            w={220}
            h={36}
            fz={12}
            className={classes.date__field}
            styles={{
              input: {
                height: "30px",
                fontSize: 12,
                paddingTop: 0,
                paddingBottom: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              section: { height: "30px" },
            }}
            type="range"
            allowSingleDateInRange
            leftSection={<IconCalendarMonth size={12} />}
            numberOfColumns={2}
            // Two calendar months don't fit on small screens
            popoverProps={{ middlewares: { flip: true, shift: true } }}
            clearable
          />
        )}

        {!isStatus && (
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
            size="xs"
            w={180}
            h={36}
            fz={12}
            styles={{ input: { height: "30px", fontSize: 12 } }}
            clearable
          />
        )}

        <Flex gap={12} className={stretch ? classes.actions : undefined}>
          <Button
            variant="transparent"
            color="#758604"
            onClick={handleClear}
            fz={14}
            px={0}
            fw={500}
          >
            Clear Filter
          </Button>
        </Flex>
      </Flex>
    </Collapse>
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
