"use client";

import type { CSSProperties } from "react";
import { PinInput, PinInputProps } from "@mantine/core";
import classes from "./otp-input.module.scss";

type OtpInputProps = Omit<PinInputProps, "classNames"> & {
  /** Box size in px (defaults to 58) */
  boxSize?: number;
};

export function OtpInput({ length = 6, boxSize = 58, ...props }: OtpInputProps) {
  return (
    <PinInput
      length={length}
      type="number"
      oneTimeCode
      // hide each digit as it's typed; pass mask={false} to show them
      mask
      placeholder=""
      classNames={classes}
      style={{ "--pin-input-base": `${boxSize}px` } as CSSProperties}
      {...props}
    />
  );
}

export default OtpInput;
