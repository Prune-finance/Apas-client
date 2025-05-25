import {
  Checkbox,
  CheckboxProps,
  Flex,
  Group,
  NumberInput,
  NumberInputProps,
  Radio,
  rem,
  Select,
  SelectProps,
  Text,
  Textarea,
  TextareaProps,
  TextInput,
  TextInputProps,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import classes from "./input.module.scss";
import styles from "./styles.module.scss";
import profile_styles from "./profile.module.scss";
import { DateInput, DateInputProps } from "@mantine/dates";

import { SelectCountryDialCode } from "../SelectDropdownSearch";
import { UseFormReturnType } from "@mantine/form";
import { IconHelp } from "@tabler/icons-react";

interface TextInputWithInsideLabelProps extends TextInputProps {}
export const TextInputWithInsideLabel = ({
  ...props
}: TextInputWithInsideLabelProps) => {
  return <TextInput {...props} classNames={classes} />;
};

interface NumberInputWithInsideLabelProps extends NumberInputProps {}

export const NumberInputWithInsideLabel = ({
  ...props
}: NumberInputWithInsideLabelProps) => {
  return (
    <NumberInput
      {...props}
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
      placeholder="Select"
      classNames={classes}
      styles={{ input: { paddingTop: rem(18) } }}
      {...props}
    />
  );
};

export const DateInputWithInsideLabel = ({ ...props }: DateInputProps) => {
  return (
    <DateInput {...props} placeholder="Select Date" classNames={classes} />
  );
};

interface TextareaWithInsideLabelProps extends TextareaProps {}
export const TextareaWithInsideLabel = ({
  ...props
}: TextareaWithInsideLabelProps) => {
  return <Textarea {...props} classNames={classes} />;
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
      height={54}
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
      classNames={{ ...classes, input: styles.input, label: styles.label }}
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
      h="100%"
      error={form.errors[phoneNumberKey]}
      key={form.key(phoneNumberKey)}
      prefix={"+"}
      leftSection={select}
      hideControls
      leftSectionWidth={50}
      styles={{
        input: {
          paddingLeft: rem(60),
          height: rem(54),
          backgroundColor: "#fcfcfd",
          borderColor: "#f2f4f7",
          //         background-color: #fcfcfd;
          // border: 1px solid #f2f4f7;
        },
      }}
    />
  );
};

interface MakeInitiatorProps extends CheckboxProps {}
export const MakeInitiator = ({ ...props }: MakeInitiatorProps) => {
  return (
    <Flex align="center">
      <Checkbox
        label="Make this contact an initiator"
        labelPosition="right"
        color="var(--prune-primary-600)"
        styles={{
          label: { fontSize: "14px", fontWeight: 500 },
        }}
        {...props}
      />

      <Tooltip label="Initiator">
        <ThemeIcon
          variant="transparent"
          color="var(--prune-text-gray-500)"
          size={16}
        >
          <IconHelp />
        </ThemeIcon>
      </Tooltip>
    </Flex>
  );
};

interface ProfileTextInputProps extends TextInputProps {
  editing?: boolean;
}
export const ProfileTextInput = ({
  editing = false,
  ...props
}: ProfileTextInputProps) => {
  return (
    <TextInput
      styles={{
        input: {
          border: editing ? "1px solid var(--prune-text-gray-200)" : "none",
        },
      }}
      classNames={{
        input: profile_styles.profile_input,
        label: profile_styles.profile_label,
      }}
      w="100%"
      readOnly={!editing}
      {...props}
    />
  );
};

interface ProfileDateInputProps extends DateInputProps {
  editing?: boolean;
}
export const ProfileDateInput = ({
  editing = false,
  ...props
}: ProfileDateInputProps) => {
  return (
    <DateInput
      styles={{
        input: {
          border: editing ? "1px solid var(--prune-text-gray-200)" : "none",
        },
      }}
      classNames={{
        input: profile_styles.profile_input,
        label: profile_styles.profile_label,
      }}
      w="100%"
      maxDate={new Date()}
      readOnly={!editing}
      {...props}
    />
  );
};

interface ProfileTextareaProps extends TextareaProps {
  editing?: boolean;
}
export const ProfileTextarea = ({
  editing = false,
  ...props
}: ProfileTextareaProps) => {
  return (
    <Textarea
      styles={{
        input: {
          border: editing ? "1px solid var(--prune-text-gray-200)" : "none",
        },
      }}
      classNames={{
        input: profile_styles.profile_input,
        label: profile_styles.profile_label,
      }}
      w="100%"
      readOnly={!editing}
      minRows={4}
      maxRows={5}
      autosize
      {...props}
    />
  );
};

interface CustomRadioCardProps {
  label: string;
  value: string | number;
}

export const CustomRadioCard = ({ label, value }: CustomRadioCardProps) => {
  return (
    <Radio.Card
      value={String(value)}
      color="var(--prune-primary-700)"
      classNames={{ card: profile_styles.card }}
    >
      <Group wrap="nowrap" align="center" justify="space-between">
        <Text fz={14} fw={500} c="var(--prune-text-gray-800)">
          {label}
        </Text>
        <Radio.Indicator color="var(--prune-primary-700)" />
      </Group>
    </Radio.Card>
  );
};
