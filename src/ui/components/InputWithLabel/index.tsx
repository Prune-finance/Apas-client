import {
  NumberInput,
  NumberInputProps,
  Select,
  SelectProps,
  Textarea,
  TextareaProps,
  TextInput,
  TextInputProps,
  useMantineTheme,
} from "@mantine/core";
import classes from "./input.module.scss";
import { DateInput, DateInputProps } from "@mantine/dates";

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
