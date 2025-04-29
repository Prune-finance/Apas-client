import {
  SelectInputWithInsideLabel,
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { UseFormReturnType } from "@mantine/form";
import { OnboardingType } from "@/lib/schema";
import countries from "@/assets/countries.json";
import { useState } from "react";

interface BusinessInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
}

export const BusinessInfo = ({ setActive, active, form }: BusinessInfo) => {
  const [IdCheck, setIdCheck] = useState({
    isContactIdType: false,
    isContactPOAType: false,
    isPassport: true,
  });

  form.watch("contactIdType", ({ value }) => {
    if (value) {
      setIdCheck({
        ...IdCheck,
        isContactIdType: true,
        isPassport: true,
      });

      if (value === "Passport") {
        setIdCheck({
          ...IdCheck,
          isPassport: false,
        });
      }

      return;
    }

    if (!value) {
      setIdCheck({
        ...IdCheck,
        isContactIdType: false,
        isPassport: false,
      });
    }
  });

  form.watch("contactPOAType", ({ value }) => {
    if (value) return setIdCheck({ ...IdCheck, isContactPOAType: true });

    setIdCheck({
      ...IdCheck,
      isContactPOAType: false,
    });
  });
  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(() => {
        setActive(active + 1);
      })}
    >
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Business Information
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Business Name"
            w="100%"
            {...form.getInputProps("name")}
          />
          <TextInputWithInsideLabel
            label="Trading Name"
            w="100%"
            {...form.getInputProps("tradingName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Business Type"
            data={["Corporate"]}
            w="100%"
            {...form.getInputProps("legalEntity")}
          />
          <SelectInputWithInsideLabel
            label="Business Industry"
            w="100%"
            searchable
            data={businessIndustries}
            {...form.getInputProps("businessIndustry")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Country"
            w="100%"
            searchable
            data={countries.map((country) => country.name)}
            {...form.getInputProps("country")}
          />
          <TextInputWithInsideLabel
            label="Address"
            w="100%"
            {...form.getInputProps("address")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            {...form.getInputProps("contactEmail")}
          />
          <TextInputWithInsideLabel
            label="Phone Number"
            w="100%"
            {...form.getInputProps("businessNumber")}
          />
        </Flex>

        <Flex gap={24} w="50%">
          <TextInputWithInsideLabel
            label="Business Website"
            w="100%"
            {...form.getInputProps("domain")}
          />
        </Flex>

        <Flex gap={24} w="100%" mb={48}>
          <TextareaWithInsideLabel
            label="Company's Description"
            w="100%"
            autosize
            maxRows={7}
            minRows={5}
            {...form.getInputProps("businessBio")}
          />
        </Flex>
      </Stack>

      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Contact Person
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="First Name"
            w="100%"
            {...form.getInputProps("contactFirstName")}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            {...form.getInputProps("contactLastName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            {...form.getInputProps("contactEmail")}
          />
          <TextInputWithInsideLabel
            label="Phone Number"
            w="100%"
            {...form.getInputProps("contactNumber")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Identity Type"
            data={["ID Card", "Passport", "Residence Permit"]}
            w="100%"
            {...form.getInputProps("contactIdType")}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            data={["Utility Bill"]}
            {...form.getInputProps("contactPOAType")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          {IdCheck.isContactIdType && (
            <>
              <OnBoardingDocumentBox
                title="Upload Identity Document"
                formKey="contactIdUrl"
                form={form}
                uploadedFileUrl={form.getValues().contactIdUrl || ""}
                {...form.getInputProps("contactIdUrl")}
              />

              {IdCheck.isPassport && (
                <OnBoardingDocumentBox
                  title="Upload Identity Document (Back)"
                  formKey="contactIdUrlBack"
                  form={form}
                  uploadedFileUrl={form.getValues().contactIdUrlBack || ""}
                  {...form.getInputProps("contactIdUrlBack")}
                />
              )}
            </>
          )}

          {IdCheck.isContactPOAType && (
            <OnBoardingDocumentBox
              title="Upload Proof of Address"
              formKey="contactPOAUrl"
              form={form}
              uploadedFileUrl={form.getValues().contactPOAUrl || ""}
              {...form.getInputProps("contactPOAUrl")}
            />
          )}
        </Flex>
      </Stack>

      <Flex align="center" justify="space-between" w="100%" mt={20}>
        <SecondaryBtn text="Clear Form" fw={600} />

        <Flex align="center" justify="center" gap={20}>
          <SecondaryBtn
            text="Previous"
            fw={600}
            action={() => setActive(active - 1)}
            disabled={active === 0}
          />
          <PrimaryBtn
            text="Next"
            w={126}
            fw={600}
            type="submit"
            // action={() => {
            //   if (form.validate().hasErrors) return;
            //   setActive(active + 1);
            // }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

const businessIndustries: string[] = [
  "Agriculture",
  "Automotive",
  "Banking & Financial Services",
  "Construction",
  "Consulting",
  "Consumer Goods",
  "E-commerce",
  "Education",
  "Energy & Utilities",
  "Entertainment & Media",
  "Environmental Services",
  "Fashion & Apparel",
  "Food & Beverage",
  "Government",
  "Healthcare & Medical",
  "Hospitality",
  "Insurance",
  "Legal Services",
  "Logistics & Transportation",
  "Manufacturing",
  "Marketing & Advertising",
  "Nonprofit & NGOs",
  "Pharmaceuticals & Biotechnology",
  "Real Estate",
  "Retail",
  "Software & Technology",
  "Telecommunications",
  "Travel & Tourism",
  "Wholesale & Distribution",
];
