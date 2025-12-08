"use client";

import { Checkbox, Flex } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props<T> = {
  form: UseFormReturnType<T>;
  mt?: number;
};

function SaveBeneficiaryToggle<T extends { saveBeneficiary?: boolean }>({
  form,
  mt = 24,
}: Props<T>) {
  return (
    <Flex mt={mt} bg="#F9FAFB" p={12} style={{ borderRadius: 4 }}>
      <Checkbox
        {...form.getInputProps("saveBeneficiary", { type: "checkbox" })}
        label={"Uncheck this box if you don't want us to save beneficiary"}
        color="var(--prune-primary-700)"
        size="sm"
        styles={{ label: { color: "#667085" } }}
      />
    </Flex>
  );
}

export default SaveBeneficiaryToggle;
