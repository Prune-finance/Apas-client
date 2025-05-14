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
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";
import { useRouter } from "next/navigation";
import { OnboardingBusinessData } from "@/lib/hooks/eligibility-center";

function EligibilityCenterNew() {
  const { handleSuccess } = useNotification();
  const { push } = useRouter();

  const form = useForm<OnboardingBasicInfoType>({
    mode: "controlled",
    initialValues: {
      businessName: "",
      businessTradingName: "",
      businessCountry: null,
      businessType: null,
      businessIndustry: null,
      businessPhoneNumber: "+234",
      contactPersonPhoneNumber: "+234",
      businessAddress: "",
      businessDescription: "",
      businessEmail: "",
      contactPersonEmail: "",
      businessWebsite: "https://",
      contactPersonFirstName: "",
      contactPersonLastName: "",
      contactPersonIdType: null,
      contactPersonPOAType: null,
      contactPersonIdUrl: "",
      contactPersonIdUrlBack: "",
      contactPersonPOAUrl: "",
      contactPersonPhoneNumberCode: "+234",
      businessPhoneNumberCode: "+234",
      makeContactPersonInitiator: false,
    },
    validate: zodResolver(onboardingBasicInfoSchema),
  });

  const {
    contactPersonIdUrlBack,
    contactPersonPhoneNumberCode,
    businessPhoneNumberCode,
    ...rest
  } = form.values;

  const { queryFn, loading } = useAxios<Partial<OnboardingBusinessData>>({
    baseURL: "auth",
    endpoint: "/admin/onboardings/create-business-profile",
    method: "POST",
    body: { ...rest },
    onSuccess: (data) => {
      handleSuccess("New Profile", "Profile created successfully");
      form.reset();

      push(`/admin/eligibility-center/${data.id}`);
    },
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
        onSubmit={form.onSubmit(() => queryFn())}
      >
        <Text c="var(--prune-text-gray-700)" fz={16} fw={500}>
          Basic Information
        </Text>

        <FlexedInput>
          <TextInputWithInsideLabel
            label="Business Name"
            w="100%"
            placeholder="Enter business name"
            {...form.getInputProps("businessName")}
          />
          <TextInputWithInsideLabel
            label="Trading Name"
            w="100%"
            placeholder="Enter trading name"
            {...form.getInputProps("businessTradingName")}
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
            {...form.getInputProps("businessType")}
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
            {...form.getInputProps("businessCountry")}
          />
          <TextInputWithInsideLabel
            label="Address"
            w="100%"
            placeholder="Enter business address"
            {...form.getInputProps("businessAddress")}
          />
        </FlexedInput>

        <FlexedInput>
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            placeholder="Enter business email"
            {...form.getInputProps("businessEmail")}
          />
          <Box w="100%">
            <PhoneNumberInput
              form={form}
              phoneNumberKey="businessPhoneNumber"
              countryCodeKey="businessPhoneNumberCode"
            />
          </Box>
        </FlexedInput>

        <FlexedInput>
          <TextInputWithInsideLabel
            label="Business Website"
            placeholder="Enter business website"
            w="100%"
            {...form.getInputProps("businessWebsite")}
          />

          <TextareaWithInsideLabel
            label="Company's Description"
            w="100%"
            placeholder="Enter business description"
            {...form.getInputProps("businessDescription")}
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
            {...form.getInputProps("contactPersonFirstName")}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            placeholder="Enter contact's last name"
            {...form.getInputProps("contactPersonLastName")}
          />
        </FlexedInput>

        <FlexedInput>
          <TextareaWithInsideLabel
            label="Email"
            w="100%"
            {...form.getInputProps("contactPersonEmail")}
            placeholder="Enter contact's email"
          />
          <Box w="100%">
            <PhoneNumberInput
              form={form}
              phoneNumberKey="contactPersonPhoneNumber"
              countryCodeKey="contactPersonPhoneNumberCode"
            />
          </Box>
        </FlexedInput>

        <FlexedInput>
          <SelectInputWithInsideLabel
            label="Identity Type"
            data={["ID Card", "Passport", "Residence Permit"]}
            w="100%"
            {...form.getInputProps("contactPersonIdType")}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            data={["Utility Bill"]}
            {...form.getInputProps("contactPersonPOAType")}
          />
        </FlexedInput>

        <FlexedInput>
          {form.values.contactPersonIdType && (
            <>
              <OnBoardingDocumentBox<OnboardingBasicInfoType>
                title="Upload Identity Document"
                formKey="contactPersonIdUrl"
                form={form}
                isAdmin
                uploadedFileUrl={form.getValues().contactPersonIdUrl || ""}
                {...form.getInputProps("contactPersonIdUrl")}
              />

              {form.values.contactPersonIdType !== "Passport" && (
                <OnBoardingDocumentBox<OnboardingBasicInfoType>
                  title="Upload Identity Document (Back)"
                  formKey="contactPersonIdUrlBack"
                  form={form}
                  isAdmin
                  uploadedFileUrl={
                    form.getValues().contactPersonIdUrlBack || ""
                  }
                  {...form.getInputProps("contactPersonIdUrlBack")}
                />
              )}
            </>
          )}

          {form.values.contactPersonPOAType && (
            <OnBoardingDocumentBox<OnboardingBasicInfoType>
              title="Upload Proof of Address"
              formKey="contactPersonPOAUrl"
              form={form}
              uploadedFileUrl={form.getValues().contactPersonPOAUrl || ""}
              isAdmin
              {...form.getInputProps("contactPersonPOAUrl")}
            />
          )}
        </FlexedInput>

        <MakeInitiator {...form.getInputProps("makeContactPersonInitiator")} />

        <Divider color="var(--prune-text-gray-200)" />

        <Flex justify="space-between" align="center">
          <SecondaryBtn text="Clear Form" action={form.reset} fw={600} />

          <PrimaryBtn text="Save" type="submit" fw={600} loading={loading} />
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
