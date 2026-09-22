import { QuestionnaireType } from "@/lib/schema";
import { PhoneNumberInput } from "@/ui/components/InputWithLabel/QuestInputs";
import { Box, Checkbox, Flex, Stack, Text } from "@mantine/core";
import { IconBriefcase, IconMapPin, IconMail } from "@tabler/icons-react";
import { useEffect } from "react";
import {
  SelectInputWithInsideLabel,
  TextInputWithInsideLabel,
  TextareaWithInsideLabel,
} from "@/ui/components/InputWithLabel/QuestInputs";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { countriesWithCode } from "@/lib/countries-codes-flags";

export const SUPPORTED_ISO_CODES = new Set(["NG", "GB", "FR", "DE", "IT", "ES", "BJ", "ML", "TG", "CI", "US"]);

// Derive country options from the existing dial-code list (flag emoji encodes ISO-2 code)
const COUNTRY_OPTIONS = (() => {
  const seen = new Set<string>();
  return countriesWithCode
    .map((c) => {
      const parts = c.label.split(" ");
      const emoji = parts[0];
      const name = parts.slice(1).join(" ");
      const a = emoji.codePointAt(0);
      const b = emoji.codePointAt(2);
      if (a === undefined || b === undefined) return null;
      const iso = String.fromCharCode(65 + (a - 0x1f1e6), 65 + (b - 0x1f1e6));
      if (iso.length !== 2) return null;
      return { value: iso, label: name };
    })
    .filter((c): c is { value: string; label: string } => {
      if (c === null || seen.has(c.value)) return false;
      seen.add(c.value);
      return true;
    })
    .sort((a, b) => a.label.localeCompare(b.label));
})();

const INDUSTRY_OPTIONS = [
  "Financial Services / FinTech",
  "Banking",
  "Insurance",
  "Technology / Software",
  "E-commerce / Retail",
  "Logistics & Transportation",
  "Healthcare",
  "Pharmaceuticals",
  "Education / EdTech",
  "Real Estate",
  "Construction",
  "Manufacturing",
  "Agriculture / Agribusiness",
  "Food & Beverage",
  "Hospitality / Hotels",
  "Travel & Tourism",
  "Telecommunications",
  "Media & Entertainment",
  "Marketing & Advertising",
  "Professional Services / Consulting",
  "Legal Services",
  "Accounting",
  "Energy / Oil & Gas",
  "Renewable Energy",
  "Automotive",
  "Aviation",
  "Import & Export / Trading",
  "Consumer Goods",
  "Fashion & Apparel",
  "Beauty & Cosmetics",
  "Sports & Fitness",
  "Security Services",
  "Government / Public Sector",
  "Nonprofit / NGO",
  "Mining",
  "Telecommunications & IT Services",
  "Cybersecurity",
  "Artificial Intelligence",
  "Cryptocurrency / Blockchain",
  "Business Process Outsourcing (BPO)",
].map((item) => ({ value: item, label: item }));

export default function BasicInfo() {
  const form = useQuestionnaireFormContext();

  const countryValue = form.values.businessCountry;
  const countryNotSupported =
    Boolean(countryValue) && !SUPPORTED_ISO_CODES.has(countryValue.toUpperCase());

  // When the selected country changes, sync the phone dial code
  useEffect(() => {
    const iso = form.values.businessCountry; // e.g. "NG"
    if (!iso || iso.length !== 2) return;

    // Re-build the flag emoji from the ISO code to find the exact dial code entry
    const upper = iso.toUpperCase();
    const flagEmoji = String.fromCodePoint(
      0x1f1e6 + upper.charCodeAt(0) - 65,
      0x1f1e6 + upper.charCodeAt(1) - 65
    );
    const match = countriesWithCode.find((c) => c.label.startsWith(flagEmoji));
    if (match) form.setFieldValue("countryCode", match.value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.businessCountry]);

  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Flex direction={{ base: "column", md: "row" }} align="center" gap={24}>
        <TextInputWithInsideLabel
          label="Legal Business Name"
          w="100%"
          leftSection={<IconBriefcase />}
          {...form.getInputProps("businessName")}
          key={form.key("businessName")}
          withAsterisk
        />
        <TextInputWithInsideLabel
          label="Company Email"
          w="100%"
          leftSection={<IconMail />}
          {...form.getInputProps("businessEmail")}
          key={form.key("businessEmail")}
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
          data={COUNTRY_OPTIONS}
          searchable
          {...form.getInputProps("businessCountry")}
          key={form.key("businessCountry")}
          withAsterisk
          error={
            countryNotSupported
              ? "We currently only support: Nigeria, United Kingdom, France, Germany, Italy, Spain, Benin, Mali, Togo, Côte d'Ivoire, United States of America."
              : form.errors.businessCountry
          }
        />
      </Flex>

      <SelectInputWithInsideLabel
        label="Business Industry"
        w="100%"
        searchable
        data={INDUSTRY_OPTIONS}
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
          withAsterisk
        />
      )}
    </Box>
  );
}
