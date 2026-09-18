"use client";

import {
  Box,
  Combobox,
  Flex,
  NumberInput,
  NumberInputProps,
  rem,
  ScrollArea,
  Select,
  SelectProps,
  Text,
  Textarea,
  TextareaProps,
  TextInput,
  TextInputProps,
  UnstyledButton,
  useCombobox,
} from "@mantine/core";
import { useState } from "react";
import { UseFormReturnType } from "@mantine/form";
import { IconChevronDown } from "@tabler/icons-react";
import classes from "./quest-input.module.scss";
import { countriesWithCode } from "@/lib/countries-codes-flags";

// ─── shared helpers ────────────────────────────────────────────────────────

const LEFT_ICON_WIDTH = rem(40);

/** Label offset with icon */
const withIconLabelStyle = {
  label: { paddingLeft: LEFT_ICON_WIDTH },
};
/** Label offset without icon */
const noIconLabelStyle = {
  label: { paddingLeft: rem(12) },
};

// ─── QuestInput ────────────────────────────────────────────────────────────

interface QuestInputProps extends TextInputProps {}

export const QuestInput = ({
  label,
  value,
  onFocus,
  onBlur,
  leftSection,
  leftSectionWidth,
  styles,
  wrapperProps,
  ...props
}: QuestInputProps) => {
  const [focused, setFocused] = useState(false);
  const floating = focused || Boolean(value);
  const hasIcon = Boolean(leftSection);

  return (
    <TextInput
      label={label}
      placeholder={typeof label === "string" ? label : undefined}
      value={value}
      leftSection={leftSection}
      leftSectionWidth={leftSectionWidth ?? (hasIcon ? LEFT_ICON_WIDTH : undefined)}
      classNames={classes}
      wrapperProps={{ ...wrapperProps, "data-floating": floating || undefined }}
      styles={(theme, inputProps, ctx) => {
        const customStyles =
          typeof styles === "function" ? styles(theme, inputProps, ctx) : styles;
        return {
          ...customStyles,
          label: {
            paddingLeft: leftSectionWidth ?? (hasIcon ? LEFT_ICON_WIDTH : rem(12)),
            ...customStyles?.label,
          },
        };
      }}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
};

// ─── QuestSelect ───────────────────────────────────────────────────────────

interface QuestSelectProps extends SelectProps {}

export const QuestSelect = ({
  label,
  value,
  onFocus,
  onBlur,
  leftSection,
  leftSectionWidth,
  ...props
}: QuestSelectProps) => {
  const [focused, setFocused] = useState(false);
  const floating = focused || Boolean(value);
  const hasIcon = Boolean(leftSection);

  return (
    <Select
      label={label}
      placeholder={typeof label === "string" ? label : undefined}
      value={value}
      leftSection={leftSection}
      leftSectionWidth={leftSectionWidth ?? (hasIcon ? LEFT_ICON_WIDTH : undefined)}
      classNames={classes}
      styles={{
        ...(hasIcon ? withIconLabelStyle : noIconLabelStyle),
        input: { paddingTop: floating ? 20 : 0 },
      }}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
      wrapperProps={{ ...props.wrapperProps, "data-floating": floating || undefined }}
    />
  );
};

// ─── QuestNumberInput ──────────────────────────────────────────────────────

interface QuestNumberInputProps extends NumberInputProps {}

export const QuestNumberInput = ({
  label,
  value,
  onFocus,
  onBlur,
  leftSection,
  leftSectionWidth,
  ...props
}: QuestNumberInputProps) => {
  const [focused, setFocused] = useState(false);
  const floating = focused || value !== undefined && value !== "" && value !== null;
  const hasIcon = Boolean(leftSection);

  return (
    <NumberInput
      label={label}
      placeholder={typeof label === "string" ? label : undefined}
      value={value}
      leftSection={leftSection}
      leftSectionWidth={leftSectionWidth ?? (hasIcon ? LEFT_ICON_WIDTH : undefined)}
      classNames={classes}
      styles={hasIcon ? withIconLabelStyle : noIconLabelStyle}
      thousandSeparator=","
      min={0}
      hideControls
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
      wrapperProps={{ ...props.wrapperProps, "data-floating": floating || undefined }}
    />
  );
};

// ─── QuestTextarea ─────────────────────────────────────────────────────────

interface QuestTextareaProps extends TextareaProps {}

export const QuestTextarea = ({
  label,
  value,
  onFocus,
  onBlur,
  ...props
}: QuestTextareaProps) => {
  const [focused, setFocused] = useState(false);
  const floating = focused || Boolean(value);

  return (
    <Textarea
      label={label}
      placeholder={typeof label === "string" ? label : undefined}
      value={value}
      classNames={{ ...classes, input: classes.textarea }}
      styles={noIconLabelStyle}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
      wrapperProps={{ ...props.wrapperProps, "data-floating": floating || undefined }}
    />
  );
};

// ─── QuestPhoneInput ───────────────────────────────────────────────────────

interface QuestPhoneInputProps<T> {
  form: UseFormReturnType<T>;
  phoneNumberKey: keyof T & string;
  countryCodeKey: keyof T & string;
  label?: string;
}

export const QuestPhoneInput = <T,>({
  form,
  phoneNumberKey,
  countryCodeKey,
  label = "Phone Number",
}: QuestPhoneInputProps<T>) => {
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");

  const dialCode = (form.values[countryCodeKey] as string) || "+234";
  const phoneValue = (form.values[phoneNumberKey] as string) || "";
  const floating = focused || Boolean(phoneValue);

  const selectedCountry = countriesWithCode.find((c) => c.value === dialCode);
  const flagEmoji = selectedCountry?.label.split(" ")[0] ?? "🌍";

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch("");
    },
    onDropdownOpen: () => combobox.focusSearchInput(),
  });

  const options = countriesWithCode
    .filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase().trim())
    )
    .map((item) => (
      <Combobox.Option value={item.value} key={item.value}>
        <Text fz={13}>{item.label}</Text>
      </Combobox.Option>
    ));

  return (
    <Box style={{ position: "relative" }}>
      {/* Unified border container */}
      <Flex
        align="center"
        style={{
          height: rem(56),
          border: `1px solid ${focused ? "var(--prune-primary-600)" : "#e4e7ec"}`,
          borderRadius: 8,
          background: "#fff",
          overflow: "hidden",
          transition: "border-color 0.2s ease",
        }}
      >
        {/* Dial code selector */}
        <Combobox
          width={300}
          store={combobox}
          withinPortal
          onOptionSubmit={(val) => {
            form.setValues({ [countryCodeKey]: val } as Partial<T>);
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <UnstyledButton
              onClick={() => combobox.toggleDropdown()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: rem(4),
                padding: `0 ${rem(8)} 0 ${rem(12)}`,
                height: rem(56),
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: rem(18), lineHeight: 1 }}>{flagEmoji}</span>
              <Text fz={14} c="#98a2b3" fw={500} lh={1}>
                {dialCode}
              </Text>
              <IconChevronDown size={14} color="#98a2b3" />
            </UnstyledButton>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Search
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Search country"
            />
            <ScrollArea.Autosize type="scroll" mah={220}>
              {options.length > 0 ? (
                options
              ) : (
                <Combobox.Empty>No results</Combobox.Empty>
              )}
            </ScrollArea.Autosize>
          </Combobox.Dropdown>
        </Combobox>

        {/* Divider */}
        <Box
          style={{ width: 1, height: rem(24), background: "#e4e7ec", flexShrink: 0 }}
        />

        <Box style={{ position: "relative", flex: 1, minWidth: 0, height: "100%" }}>
          {/* Floating label — sits above the typed number, past the dial-code section */}
          <Box
            component="span"
            style={{
              position: "absolute",
              left: rem(12),
              top: floating ? 10 : "50%",
              transform: floating ? "translateY(0)" : "translateY(-50%)",
              fontSize: floating ? 11 : 14,
              color: floating ? "#667085" : "#98a2b3",
              opacity: floating ? 1 : 0,
              pointerEvents: "none",
              zIndex: 1,
              fontWeight: 400,
              whiteSpace: "nowrap",
              transition:
                "top 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1), font-size 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease",
            }}
          >
            {label}
          </Box>
          {/* Phone number — plain input with no border */}
          <Box
            component="input"
            type="tel"
            aria-label={label}
            value={phoneValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.setValues({ [phoneNumberKey]: e.currentTarget.value } as Partial<T>)
            }
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={floating ? "" : label}
            className={classes.phone_input}
            style={{
              width: "100%",
              minWidth: 0,
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              paddingLeft: rem(12),
              paddingTop: floating ? rem(20) : 0,
              fontSize: rem(14),
              color: "var(--prune-text-gray-700)",
              transition: "padding-top 0.22s ease",
            }}
          />
        </Box>
      </Flex>

      {form.errors[phoneNumberKey] && (
        <Text fz={12} c="red.6" mt={4}>
          {String(form.errors[phoneNumberKey])}
        </Text>
      )}
    </Box>
  );
};
