import {
  NumberInput,
  NumberInputProps,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import classes from "./input.module.css";

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
