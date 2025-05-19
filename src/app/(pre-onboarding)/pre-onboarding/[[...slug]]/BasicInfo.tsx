import form from "@/app/auth/login/form";
import { QuestionnaireType } from "@/lib/schema";
import { businessIndustries } from "@/lib/static";
import {
  SelectInputWithInsideLabel,
  PhoneNumberInput,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Radio, RadioGroup, Stack } from "@mantine/core";
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
    <Box style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Flex direction={{ base: "column", md: "row" }} align="center" gap={20}>
        <TextInputWithInsideLabel
          label="Legal Business Name"
          w="100%"
          rightSection={<IconBriefcase />}
          {...form.getInputProps("businessName")}
          key={form.key("businessName")}
          withAsterisk
        />
        <TextInputWithInsideLabel
          label="Trading Name"
          w="100%"
          rightSection={<IconBriefcase />}
          {...form.getInputProps("businessTradingName")}
          key={form.key("businessTradingName")}
          withAsterisk
        />
      </Flex>

      <Flex direction={{ base: "column", md: "row" }} align="center" gap={20}>
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
        <TextInputWithInsideLabel
          label="Business Address"
          w="100%"
          rightSection={<IconMapPin />}
          {...form.getInputProps("businessAddress")}
          key={form.key("businessAddress")}
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

      <Flex direction={{ base: "column", md: "row" }} align="center" gap={20}>
        <TextInputWithInsideLabel
          label="Email"
          w="100%"
          rightSection={<IconMail />}
          {...form.getInputProps("businessEmail")}
          key={form.key("businessEmail")}
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

      <RadioGroup
        label="Is this entity regulated? Does it hold any regulatory licenses? "
        {...form.getInputProps("isRegulated")}
        color="var(--prune-primary-600)"
        key={form.key("isRegulated")}
      >
        <Stack gap={6} mt="xs">
          <Radio label="Yes" value="yes" color="var(--prune-primary-600)" />
          <Radio label="No" value="no" color="var(--prune-primary-600)" />
        </Stack>
      </RadioGroup>
    </Box>
  );
}
