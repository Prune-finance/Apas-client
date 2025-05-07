"use client";

import { businessIndustries } from "@/lib/static";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  MakeInitiator,
  PhoneNumberInput,
  SelectInputWithInsideLabel,
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import {
  Box,
  Checkbox,
  Divider,
  Flex,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import React, { ReactNode, Suspense } from "react";
import countries from "@/assets/countries.json";
import { useForm, zodResolver } from "@mantine/form";
import {
  onboardingBasicInfoSchema,
  OnboardingBasicInfoType,
} from "@/lib/schema";
import OnBoardingDocumentBox from "@/app/(onboarding)/onboarding/onBoardingDocumentBox";
import { IconHelp, IconQuestionMark } from "@tabler/icons-react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

function EligibilityCenterNew() {
  const form = useForm<OnboardingBasicInfoType>({
    mode: "controlled",
    initialValues: {
      name: "",
      tradingName: "",
      country: "",
      legalEntity: "",
      businessIndustry: "",
      businessNumber: "+234",
      businessNumberCode: "+234",
      contactNumber: "+234",
      address: "",
      businessBio: "",
      contactEmail: "",
      contactFirstName: "",
      contactLastName: "",
      contactIdType: "",
      contactPOAType: "",
      contactIdUrl: "",
      contactIdUrlBack: "",
      contactPOAUrl: "",
      domain: "https://",
      contactCountryCode: "+234",
    },
    validate: zodResolver(onboardingBasicInfoSchema),
  });
  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: "Eligibility Center", href: "/admin/eligibility-center" },
          { title: "Create Profile", href: "/admin/eligibility-center/new" },
        ]}
      />

      <Text fz={18} fw={600} my={36}>
        Create New Profile
      </Text>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
        component="form"
        onSubmit={form.onSubmit((values) => console.log(values))}
      >
        <Text c="var(--prune-text-gray-700)" fz={16} fw={500}>
          Basic Information
        </Text>

        <FlexedInput>
          <TextInputWithInsideLabel
            label="Business Name"
            w="100%"
            placeholder="Enter business name"
            {...form.getInputProps("name")}
          />
          <TextInputWithInsideLabel
            label="Trading Name"
            w="100%"
            placeholder="Enter trading name"
            {...form.getInputProps("tradingName")}
          />
        </FlexedInput>

        <FlexedInput>
          <SelectInputWithInsideLabel
            label="Business Type"
            placeholder="Select business type"
            w="100%"
            data={["Corporate"]}
            searchable
            nothingFoundMessage="No options"
            {...form.getInputProps("legalEntity")}
          />
          <SelectInputWithInsideLabel
            label="Business Industry"
            placeholder="Select business industry"
            searchable
            nothingFoundMessage="No options"
            w="100%"
            data={businessIndustries}
            {...form.getInputProps("businessIndustry")}
          />
        </FlexedInput>

        <FlexedInput>
          <SelectInputWithInsideLabel
            label="Country"
            placeholder="Select country"
            w="100%"
            searchable
            nothingFoundMessage="No options"
            data={countries.map((country) => ({
              value: country.code,
              label: country.name,
            }))}
            {...form.getInputProps("country")}
          />
          <TextInputWithInsideLabel
            label="Address"
            w="100%"
            placeholder="Enter business address"
            {...form.getInputProps("address")}
          />
        </FlexedInput>

        <FlexedInput>
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            placeholder="Enter business email"
            {...form.getInputProps("contactEmail")}
          />
          <Box w="100%">
            <PhoneNumberInput
              form={form}
              phoneNumberKey="businessNumber"
              countryCodeKey="businessNumberCode"
            />
          </Box>
        </FlexedInput>

        <FlexedInput>
          <TextInputWithInsideLabel
            label="Business Website"
            placeholder="Enter business website"
            w="100%"
            {...form.getInputProps("domain")}
          />

          <TextareaWithInsideLabel
            label="Company's Description"
            w="100%"
            placeholder="Enter business description"
            {...form.getInputProps("businessBio")}
          />
        </FlexedInput>

        <Text c="var(--prune-text-gray-700)" fz={16} fw={500} mt={64}>
          Contact Person
        </Text>

        <FlexedInput>
          <TextInputWithInsideLabel
            label="First Name"
            w="100%"
            placeholder="Enter contact's first name"
            {...form.getInputProps("contactFirstName")}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            placeholder="Enter contact's last name"
            {...form.getInputProps("contactLastName")}
          />
        </FlexedInput>

        <FlexedInput>
          <TextareaWithInsideLabel
            label="Email"
            w="100%"
            {...form.getInputProps("contactEmail")}
            placeholder="Enter contact's email"
          />
          <Box w="100%">
            <PhoneNumberInput
              form={form}
              phoneNumberKey="contactNumber"
              countryCodeKey="contactCountryCode"
            />
          </Box>
        </FlexedInput>

        <FlexedInput>
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
        </FlexedInput>

        <FlexedInput>
          {form.values.contactIdType && (
            <>
              <OnBoardingDocumentBox<OnboardingBasicInfoType>
                title="Upload Identity Document"
                formKey="contactIdUrl"
                form={form}
                uploadedFileUrl={form.getValues().contactIdUrl || ""}
                {...form.getInputProps("contactIdUrl")}
              />

              {form.values.contactIdType !== "Passport" && (
                <OnBoardingDocumentBox<OnboardingBasicInfoType>
                  title="Upload Identity Document (Back)"
                  formKey="contactIdUrlBack"
                  form={form}
                  uploadedFileUrl={form.getValues().contactIdUrlBack || ""}
                  {...form.getInputProps("contactIdUrlBack")}
                />
              )}
            </>
          )}

          {form.values.contactPOAType && (
            <OnBoardingDocumentBox<OnboardingBasicInfoType>
              title="Upload Proof of Address"
              formKey="contactPOAUrl"
              form={form}
              uploadedFileUrl={form.getValues().contactPOAUrl || ""}
              {...form.getInputProps("contactPOAUrl")}
            />
          )}
        </FlexedInput>

        <MakeInitiator />

        <Divider color="var(--prune-text-gray-200)" />

        <Flex justify="space-between" align="center">
          <SecondaryBtn text="Clear Form" action={form.reset} fw={600} />

          <PrimaryBtn text="Save" type="submit" fw={600} />
        </Flex>
      </Box>
    </Box>
  );
}

export default function EligibilityCenterNewSus() {
  return (
    <Suspense>
      <EligibilityCenterNew />
    </Suspense>
  );
}

const FlexedInput = ({ children }: { children: ReactNode }) => {
  return (
    <Flex gap={24} w="100%">
      {children}
    </Flex>
  );
};
