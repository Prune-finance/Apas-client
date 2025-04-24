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
  const theme = useMantineTheme();
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
  const theme = useMantineTheme();
  return (
    <Select
      {...props}
      className="Switzer"
      placeholder="Enter number"
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
