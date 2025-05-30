import {
  NumberInput,
  NumberInputProps,
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
  return <TextInput {...props} classNames={classes} />;
};

interface NumberInputWithInsideLabelProps extends NumberInputProps {}

export const NumberInputWithInsideLabel = ({
  ...props
}: NumberInputWithInsideLabelProps) => {
  const theme = useMantineTheme();
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

interface TextareaWithInsideLabelProps extends TextareaProps {}
export const TextareaWithInsideLabel = ({
  ...props
}: TextareaWithInsideLabelProps) => {
  return <Textarea {...props} classNames={classes} />;
};
