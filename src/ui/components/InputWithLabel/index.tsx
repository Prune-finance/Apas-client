import {
  NumberInput,
  NumberInputProps,
  rem,
  Select,
  SelectProps,
  Textarea,
  TextareaProps,
  TextInput,
  TextInputProps,
  useMantineTheme,
} from "@mantine/core";
import classes from "./input.module.scss";
import styles from "./styles.module.scss";
import { DateInput, DateInputProps } from "@mantine/dates";
import React, { useEffect, useState } from "react";
import { SelectCountryDialCode } from "../SelectDropdownSearch";
import { UseFormReturnType } from "@mantine/form";

interface TextInputWithInsideLabelProps extends TextInputProps {}
export const TextInputWithInsideLabel = ({
  ...props
}: TextInputWithInsideLabelProps) => {
  return <TextInput {...props} classNames={classes} className="Switzer" />;
};

interface NumberInputWithInsideLabelProps extends NumberInputProps {}

export const NumberInputWithInsideLabel = ({
  ...props
}: NumberInputWithInsideLabelProps) => {
  return (
    <NumberInput
      {...props}
      className="Switzer"
      placeholder="Enter number"
      classNames={classes}
      thousandSeparator=","
      min={0}
    />
  );
};
export const SelectInputWithInsideLabel = ({ ...props }: SelectProps) => {
  return (
    <Select
      {...props}
      className="Switzer"
      placeholder="Select"
      classNames={classes}
    />
  );
};

export const DateInputWithInsideLabel = ({ ...props }: DateInputProps) => {
  return (
    <DateInput
      {...props}
      className="Switzer"
      placeholder="Select Date"
      classNames={classes}
    />
  );
};

interface TextareaWithInsideLabelProps extends TextareaProps {}
export const TextareaWithInsideLabel = ({
  ...props
}: TextareaWithInsideLabelProps) => {
  return <Textarea {...props} classNames={classes} className="Switzer" />;
};

interface PhoneNumberInputProps<T> {
  form: UseFormReturnType<T>;

  phoneNumberKey: keyof T & string;
  countryCodeKey: keyof T & string;
}

export const PhoneNumberInput = <T,>({
  form,
  phoneNumberKey,
  countryCodeKey,
}: PhoneNumberInputProps<T>) => {
  const select = (
    <SelectCountryDialCode
      value={form.getValues()[countryCodeKey] as string}
      setValue={(value: string) => {
        const [code] = value.split("-");

        form.setValues({
          [phoneNumberKey]: `+${code}`,
          [countryCodeKey]: value,
        } as Partial<T>);
      }}
    />
  );

  return (
    <NumberInput
      classNames={{ input: styles.input, label: styles.label }}
      flex={1}
      withAsterisk
      type="tel"
      placeholder="00000000"
      value={form.values[phoneNumberKey] as string}
      onChange={(value) => {
        form.setValues({
          [phoneNumberKey]: `${value}`,
        } as Partial<T>);
      }}
      error={form.errors[phoneNumberKey]}
      key={form.key(phoneNumberKey)}
      prefix={"+"}
      leftSection={select}
      hideControls
      leftSectionWidth={50}
      styles={{
        input: {
          paddingLeft: rem(60),
        },
      }}
    />
  );
};
