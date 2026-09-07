import form from "@/app/auth/login/form";
import { QuestionnaireType } from "@/lib/schema";
import { businessIndustries } from "@/lib/static";
import {
  SelectInputWithInsideLabel,
  PhoneNumberInput,
} from "@/ui/components/InputWithLabel";
import { Box, Checkbox, Flex, Stack, Text } from "@mantine/core";
import { IconBriefcase, IconMapPin, IconMail } from "@tabler/icons-react";
import React from "react";
import {
  TextInputWithInsideLabel,
  TextareaWithInsideLabel,
} from "./TextInputWithInsideLabel";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import countries from "@/assets/countries.json";

export default function BasicInfo() {
  const form = useQuestionnaireFormContext();
  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Flex direction={{ base: "column", md: "row" }} align="center" gap={24}>
        <TextInputWithInsideLabel
          label="Email"
          w="100%"
          leftSection={<IconMail />}
          {...form.getInputProps("businessEmail")}
          key={form.key("businessEmail")}
          withAsterisk
        />
        <TextInputWithInsideLabel
          label="Legal Business Name"
          w="100%"
          leftSection={<IconBriefcase />}
          {...form.getInputProps("businessName")}
          key={form.key("businessName")}
          withAsterisk
        />
      </Flex>

      <Flex direction={{ base: "column", md: "row" }} align="center" gap={20}>
        <TextInputWithInsideLabel
          label="Trading Name"
          w="100%"
          leftSection={<IconBriefcase />}
          {...form.getInputProps("businessTradingName")}
          key={form.key("businessTradingName")}
          withAsterisk
        />
        <SelectInputWithInsideLabel
          label="Country"
          w="100%"
          data={countries.map((country) => ({
            value: country.code,
            label: country.name,
          }))}
          searchable
          {...form.getInputProps("businessCountry")}
          key={form.key("businessCountry")}
          withAsterisk
        />
      </Flex>

      <SelectInputWithInsideLabel
        label="Business Industry"
        w="100%"
        searchable
        data={businessIndustries}
        {...form.getInputProps("businessIndustry")}
        key={form.key("businessIndustry")}
        withAsterisk
      />

      <Flex direction={{ base: "column", md: "row" }} align="center" gap={24}>
        <TextInputWithInsideLabel
          label="Business Address"
          w="100%"
          leftSection={<IconMapPin />}
          {...form.getInputProps("businessAddress")}
          key={form.key("businessAddress")}
          withAsterisk
        />
        <Box w="100%">
          <PhoneNumberInput<QuestionnaireType>
            form={form}
            countryCodeKey="countryCode"
            phoneNumberKey="businessPhoneNumber"
          />
        </Box>
      </Flex>

      <TextareaWithInsideLabel
        label="Business Description"
        minRows={4}
        autosize
        maxRows={4}
        {...form.getInputProps("businessDescription")}
        key={form.key("businessDescription")}
        withAsterisk
      />

      <TextareaWithInsideLabel
        label="Give a description of your  geographic footprint, at country level and your typical customer base."
        minRows={4}
        autosize
        maxRows={4}
        {...form.getInputProps("geoFootprint")}
        key={form.key("geoFootprint")}
        withAsterisk
      />

      <Stack gap={16}>
        <Text fz={16} fw={500} c="#667085">
          Is this entity regulated? Does it hold any regulatory licenses?
        </Text>
        <Stack gap={12}>
          <Checkbox
            label="Yes"
            checked={form.values.isRegulated === "yes"}
            onChange={() => form.setFieldValue("isRegulated", "yes")}
            color="var(--prune-primary-600)"
            radius={4}
            size="md"
            styles={{ label: { color: "#667085" } }}
          />
          <Checkbox
            label="No"
            checked={form.values.isRegulated === "no"}
            onChange={() => form.setFieldValue("isRegulated", "no")}
            color="var(--prune-primary-600)"
            radius={4}
            size="md"
            styles={{ label: { color: "#667085" } }}
          />
        </Stack>
      </Stack>

      {form.values.isRegulated === "yes" && (
        <TextareaWithInsideLabel
          label="Provide details of regulatory license (Name and reference number)"
          minRows={4}
          autosize
          maxRows={4}
          {...form.getInputProps("regulatoryDetails")}
          key={form.key("regulatoryDetails")}
        />
      )}
    </Box>
  );
}
