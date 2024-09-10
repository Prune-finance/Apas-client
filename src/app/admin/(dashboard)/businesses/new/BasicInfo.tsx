import form from "@/app/auth/[id]/register/form";
import {
  Avatar,
  Box,
  Combobox,
  Divider,
  Flex,
  Group,
  Loader,
  NativeSelect,
  NumberInput,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import styles from "./styles.module.scss";
import { UseFormReturnType } from "@mantine/form";
import { NewBusinessType } from "@/lib/schema";
import { IconMail, IconPhone, IconWorldWww } from "@tabler/icons-react";
import { usePricingPlan } from "@/lib/hooks/pricing-plan";
import DropzoneComponent from "@/ui/components/Dropzone";
import {
  countriesWithCode,
  countryCodesWithFlags,
} from "@/lib/countries-codes-flags";
import Image from "next/image";
import { useState } from "react";

type Props = {
  form: UseFormReturnType<NewBusinessType>;
};

export default function BasicInfo({ form }: Props) {
  const { loading, pricingPlan } = usePricingPlan();
  const pricingPlanOptions = pricingPlan.map((plan) => ({
    label: plan.name,
    value: plan.id,
  }));

  const select = (
    <NativeSelect
      data={countriesWithCode}
      rightSectionWidth={28}
      {...form.getInputProps("contactCountryCode")}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: rem(92),
          marginRight: rem(-2),
          // border: "1px solid var(--prune-primary-700)",
          fontSize: rem(12),
        },
      }}
      classNames={{
        input: styles.input,
      }}
    />
  );

  return (
    <Box>
      <Text fz={18} fw={600} c="var(--prune-text-gray-700)" mb={24}>
        Basic Information
      </Text>

      <Flex gap={20}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="Business Name"
          placeholder="Enter Legal Business Name"
          {...form.getInputProps("name")}
          withAsterisk
        />
        <Select
          placeholder="Select Country"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="Country"
          withAsterisk
          data={["Nigeria", "Ghana", "Kenya"]}
          {...form.getInputProps("country")}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <Select
          placeholder="Select Business Type"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="Business Type"
          withAsterisk
          data={["Corporate"]}
          {...form.getInputProps("legalEntity")}
        />

        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          label="Business domain"
          type="url"
          placeholder="Enter Domain"
          {...form.getInputProps("domain")}
          rightSection={<IconWorldWww size={14} />}
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="Business Address"
          withAsterisk
          placeholder="Enter Business Address"
          {...form.getInputProps("address")}
        />
        <Select
          placeholder="Select Pricing Plan"
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          label="Pricing plan"
          rightSection={
            loading && (
              <Loader type="oval" size={14} color="var(--prune-primary-800)" />
            )
          }
          data={pricingPlanOptions}
          // data={["Free", "Basic", "Premium"]}
          {...form.getInputProps("pricingPlan")}
        />
      </Flex>

      <Textarea
        mt={24}
        label="Business Bio"
        placeholder="Business Bio"
        classNames={{ input: styles.input, label: styles.label }}
        {...form.getInputProps("businessBio")}
      />

      <Text fz={18} fw={600} c="var(--prune-text-gray-700)" mt={32} mb={24}>
        Contact Person:
      </Text>

      <Flex gap={20}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="First Name"
          placeholder="Enter First Name"
          {...form.getInputProps("contactFirstName")}
          withAsterisk
        />
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          label="Last Name"
          placeholder="Enter Last Name"
          {...form.getInputProps("contactLastName")}
          withAsterisk
        />
      </Flex>

      <Flex gap={20} mt={24}>
        <TextInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          label="Contact Email"
          type="email"
          placeholder="Enter Contact Email"
          {...form.getInputProps("contactEmail")}
          rightSection={<IconMail size={14} />}
        />
        <NumberInput
          classNames={{ input: styles.input, label: styles.label }}
          flex={1}
          withAsterisk
          type="tel"
          label="Contact Phone Number"
          placeholder="Enter Contact Phone Number"
          {...form.getInputProps("contactNumber")}
          prefix={form.values.contactCountryCode}
          // rightSection={<IconPhone size={14} />}
          rightSection={select}
          //   rightSection={
          //     <Group>
          //       <Avatar />
          //       <Select data={["US"]} variant="unstyled" />
          //     </Group>
          //   }
          rightSectionWidth={90}
        />
      </Flex>

      <Flex mt={24} gap={20}>
        <Select
          placeholder="Select Identity Type"
          classNames={{ input: styles.input }}
          flex={1}
          data={["ID Card", "Passport", "Residence Permit"]}
          {...form.getInputProps(`contactIdType`)}
        />

        <Select
          placeholder="Select Proof of Address"
          classNames={{ input: styles.input }}
          flex={1}
          data={["Utility Bill"]}
          {...form.getInputProps(`contactPOAType`)}
          withAsterisk
        />
      </Flex>

      <Flex mt={24} gap={20}>
        {form.values.contactIdType && (
          <>
            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                {`Upload ${form.values.contactIdType} ${
                  form.values.contactIdType !== "Passport" ? "(Front)" : ""
                }`}
              </Text>
              <DropzoneComponent
                form={form}
                formKey={`contactIdUrl`}
                uploadedFileUrl={form.values.contactIdUrl}
              />
            </Box>

            <>
              {form.values.contactIdType !== "Passport" && (
                <Box flex={1}>
                  <Text fz={12} c="#344054" mb={10}>
                    {`Upload
                ${form.values.contactIdType}  (Back)`}
                  </Text>
                  <DropzoneComponent
                    form={form}
                    formKey={`contactIdUrlBack`}
                    uploadedFileUrl={form.values.contactIdUrlBack}
                  />
                </Box>
              )}
            </>
          </>
        )}

        {form.values.directors && form.values.contactPOAType && (
          <Box flex={1}>
            <Text fz={12} c="#344054" mb={10}>
              Upload Utility Bill
            </Text>
            <DropzoneComponent
              form={form}
              formKey={`contactPOAUrl`}
              uploadedFileUrl={form.values.contactPOAUrl}
            />
          </Box>
        )}
      </Flex>
    </Box>
  );
}
