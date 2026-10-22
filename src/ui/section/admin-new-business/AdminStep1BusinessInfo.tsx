"use client";

import {
  SelectInputWithInsideLabel,
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { PhoneNumberInput } from "@/ui/components/InputWithLabel/QuestInputs";
import CustomRadio from "@/ui/components/CustomRadio";
import { Box, Flex, RadioGroup, SimpleGrid, Stack, Switch, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { PrimaryBtn } from "@/ui/components/Buttons";
import OnBoardingDocumentBox from "@/ui/section/onboarding/shared/onBoardingDocumentBox";
import countries from "@/assets/countries.json";
import { countriesWithCode } from "@/lib/countries-codes-flags";
import { businessIndustries } from "@/lib/static";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { ReferenceData } from "@/ui/section/onboarding/shared/types";

const questAxios = createAxiosInstance("questionnaire");
const eksellStyle = { fontFamily: "'EksellDisplay', serif" } as const;

type AdminStep1Values = {
  businessName: string;
  tradingName: string;
  businessType: string;
  businessIndustry: string;
  country: string;
  businessAddress: string;
  businessEmail: string;
  phoneNumberCode: string;
  phoneNumber: string;
  businessWebsite: string;
  businessDescription: string;
  isRegulated: boolean;
  regulatoryLicence: string;
  annualTurnover: string;
  contactFirstName: string;
  contactLastName: string;
  contactDesignation: string;
  contactEmail: string;
  contactPhoneNumberCode: string;
  contactPhoneNumber: string;
  contactIdentityType: string;
  contactIdentityDocumentId: string;
  contactIdentityDocumentBackId: string;
  contactProofOfAddressType: string;
  contactProofOfAddressDocumentId: string;
};

interface Props {
  refData: ReferenceData;
  onComplete: (adminReference: string) => void;
  adminReference?: string;
  initialValues?: Partial<AdminStep1Values>;
}

interface RefOption { value: string; label: string }

export default function AdminStep1BusinessInfo({ refData, onComplete, adminReference, initialValues }: Props) {
  const { handleSuccess, handleError } = useNotification();
  const [completing, setCompleting] = useState(false);
  const [monetaryBands, setMonetaryBands] = useState<RefOption[]>([]);

  useEffect(() => {
    questAxios
      .get("/business/questionnaire/reference-data", {
        params: { include: "monetaryBands" },
      })
      .then(({ data: res }) => {
        setMonetaryBands(res.data?.monetaryBands ?? []);
      })
      .catch(() => {});
  }, []);

  const form = useForm<AdminStep1Values>({
    initialValues: {
      businessName: "",
      tradingName: "",
      businessType: "",
      businessIndustry: "",
      country: "",
      businessAddress: "",
      businessEmail: "",
      phoneNumberCode: "+234",
      phoneNumber: "",
      businessWebsite: "",
      businessDescription: "",
      isRegulated: false,
      regulatoryLicence: "",
      annualTurnover: "",
      contactFirstName: "",
      contactLastName: "",
      contactDesignation: "",
      contactEmail: "",
      contactPhoneNumberCode: "+234",
      contactPhoneNumber: "",
      contactIdentityType: "",
      contactIdentityDocumentId: "",
      contactIdentityDocumentBackId: "",
      contactProofOfAddressType: "",
      contactProofOfAddressDocumentId: "",
    },
    validate: {
      businessName: (v) => (!v.trim() ? "Business name is required" : null),
      businessType: (v) => (!v ? "Business type is required" : null),
      businessIndustry: (v) => (!v ? "Business industry is required" : null),
      country: (v) => (!v ? "Country is required" : null),
      businessAddress: (v) => (!v.trim() ? "Address is required" : null),
      businessEmail: (v) => (!v.trim() ? "Email is required" : !/^\S+@\S+\.\S+$/.test(v) ? "Invalid email" : null),
      phoneNumber: (v) => (!v.trim() ? "Phone number is required" : null),
      businessDescription: (v) => (!v.trim() ? "Description is required" : null),
      contactFirstName: (v) => (!v.trim() ? "First name is required" : null),
      contactLastName: (v) => (!v.trim() ? "Last name is required" : null),
      contactEmail: (v) => (!v.trim() ? "Email is required" : !/^\S+@\S+\.\S+$/.test(v) ? "Invalid email" : null),
      contactPhoneNumber: (v) => (!v.trim() ? "Phone number is required" : null),
    },
  });

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setValues((current) => ({ ...current, ...initialValues }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  form.watch("country", ({ value }) => {
    if (!value) return;
    const match = countriesWithCode.find(
      (c) => c.label.split(" ").slice(1).join(" ").toLowerCase() === value.toLowerCase()
    );
    if (match) form.setFieldValue("phoneNumberCode", match.value);
  });

  const v = form.getValues();
  const isFormReady =
    form.isValid() &&
    (!v.contactIdentityType || v.contactIdentityDocumentId) &&
    (!v.contactIdentityType || v.contactIdentityType === "PASSPORT" || v.contactIdentityDocumentBackId) &&
    (!v.contactProofOfAddressType || v.contactProofOfAddressDocumentId);

  const buildPayload = () => {
    const v = form.getValues();
    return {
      businessName: v.businessName,
      tradingName: v.tradingName,
      businessType: v.businessType,
      businessIndustry: v.businessIndustry,
      countryCode: v.country,
      businessAddress: v.businessAddress,
      businessEmail: v.businessEmail,
      phoneCountryCode: v.phoneNumberCode,
      phoneNumber: v.phoneNumber,
      businessWebsite: v.businessWebsite || undefined,
      businessDescription: v.businessDescription,
      isRegulated: v.isRegulated,
      regulatoryLicence: v.isRegulated ? (v.regulatoryLicence || undefined) : undefined,
      annualTurnover: v.annualTurnover || undefined,
      contactPerson: {
        name: `${v.contactFirstName} ${v.contactLastName}`.trim(),
        designation: v.contactDesignation || undefined,
        phoneCountryCode: v.contactPhoneNumberCode,
        phoneNumber: v.contactPhoneNumber,
        email: v.contactEmail,
        identityType: v.contactIdentityType || undefined,
        proofOfAddressType: v.contactProofOfAddressType || undefined,
        identityDocumentId: v.contactIdentityDocumentId || undefined,
        identityDocumentBackId: v.contactIdentityDocumentBackId || undefined,
        proofOfAddressDocumentId: v.contactProofOfAddressDocumentId || undefined,
      },
    };
  };

  const handleSaveAndContinue = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    setCompleting(true);
    try {
      const endpoint = adminReference
        ? `/business/onboarding/admin/${adminReference}/steps/1/complete`
        : "/business/onboarding/admin/steps/1/complete";
      const res = await questAxios.post(endpoint, buildPayload());
      const ref = adminReference ?? res.data?.data?.reference;
      handleSuccess("Business Information", "Business information saved");
      onComplete(ref ?? "");
    } catch (error) {
      handleError(
        "An error occurred",
        isAxiosError(error) ? error.response?.data?.message : "Something went wrong"
      );
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={eksellStyle}>
        Business Information
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Business Name"
            w="100%"
            placeholder="Enter Business Name"
            withAsterisk
            {...form.getInputProps("businessName")}
          />
          <TextInputWithInsideLabel
            label="Trading Name"
            w="100%"
            placeholder="Enter Trading Name"
            {...form.getInputProps("tradingName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Business Type"
            data={refData.businessTypes}
            w="100%"
            searchable
            placeholder="Select Business Type"
            withAsterisk
            {...form.getInputProps("businessType")}
          />
          <SelectInputWithInsideLabel
            label="Business Industry"
            w="100%"
            searchable
            placeholder="Select Business Industry"
            data={businessIndustries}
            withAsterisk
            {...form.getInputProps("businessIndustry")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Country"
            w="100%"
            searchable
            placeholder="Select Country"
            data={countries.map((c) => c.name)}
            withAsterisk
            {...form.getInputProps("country")}
          />
          <TextInputWithInsideLabel
            label="Address"
            w="100%"
            placeholder="Enter Address"
            withAsterisk
            {...form.getInputProps("businessAddress")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            placeholder="Enter Email"
            withAsterisk
            {...form.getInputProps("businessEmail")}
          />
          <Box w="100%">
            <PhoneNumberInput<AdminStep1Values>
              form={form}
              phoneNumberKey="phoneNumber"
              countryCodeKey="phoneNumberCode"
              inputHeight={54}
              unfocusedBorderColor="#f2f4f7"
              inputBackground="#fcfcfd"
              alwaysShowLabel
            />
          </Box>
        </Flex>

        <Flex gap={24} w="50%">
          <TextInputWithInsideLabel
            label="Business Website (Optional)"
            w="100%"
            placeholder="Enter Business Website"
            {...form.getInputProps("businessWebsite")}
          />
        </Flex>

        <Flex gap={24} w="100%" mb={16}>
          <TextareaWithInsideLabel
            label="Company's Description"
            w="100%"
            autosize
            maxRows={7}
            minRows={5}
            placeholder="Enter Company's Description"
            maxLength={500}
            withAsterisk
            {...form.getInputProps("businessDescription")}
          />
        </Flex>

        <Flex gap={24} w="100%" align="center" mb={form.values.isRegulated ? 0 : 16}>
          <Switch
            label="Is the business regulated?"
            checked={form.values.isRegulated}
            onChange={(e) => form.setFieldValue("isRegulated", e.currentTarget.checked)}
            color="var(--prune-primary-700)"
            styles={{ label: { fontSize: 14, color: "var(--prune-text-gray-700)" } }}
          />
        </Flex>

        {form.values.isRegulated && (
          <Flex gap={24} w="50%" mb={16}>
            <TextInputWithInsideLabel
              label="Regulatory Licence"
              w="100%"
              placeholder="Enter Regulatory Licence"
              {...form.getInputProps("regulatoryLicence")}
            />
          </Flex>
        )}

        {monetaryBands.length > 0 && (
          <Box>
            <RadioGroup
              name="annualTurnover"
              label="What is this entity's annual turnover?"
              {...form.getInputProps("annualTurnover")}
              key={form.key("annualTurnover")}
              errorProps={{ mt: 10 }}
              labelProps={{
                fz: 14,
                fw: 500,
                c: "var(--prune-text-gray-700)",
                mb: 16,
              }}
            >
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={12}>
                {monetaryBands.map((option) => (
                  <CustomRadio key={option.value} value={option.value} label={option.label} />
                ))}
              </SimpleGrid>
            </RadioGroup>
          </Box>
        )}
      </Stack>

      <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={eksellStyle} mt={32}>
        Contact Person
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="First Name"
            w="100%"
            placeholder="Enter First Name"
            withAsterisk
            {...form.getInputProps("contactFirstName")}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            placeholder="Enter Last Name"
            withAsterisk
            {...form.getInputProps("contactLastName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Designation"
            w="100%"
            placeholder="Enter Designation"
            {...form.getInputProps("contactDesignation")}
          />
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            placeholder="Enter Email"
            withAsterisk
            {...form.getInputProps("contactEmail")}
          />
        </Flex>

        <Box w="50%">
          <PhoneNumberInput<AdminStep1Values>
            form={form}
            phoneNumberKey="contactPhoneNumber"
            countryCodeKey="contactPhoneNumberCode"
            inputHeight={54}
            unfocusedBorderColor="#f2f4f7"
            inputBackground="#fcfcfd"
            alwaysShowLabel
          />
        </Box>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Identity Type"
            data={refData.identityTypes}
            w="100%"
            searchable
            placeholder="Select Identity Type"
            {...form.getInputProps("contactIdentityType")}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            searchable
            placeholder="Select Proof of Address"
            data={refData.proofOfAddressTypes}
            {...form.getInputProps("contactProofOfAddressType")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          {form.values.contactIdentityType && (
            <>
              <OnBoardingDocumentBox<AdminStep1Values>
                title="Upload Identity Document"
                formKey="contactIdentityDocumentId"
                form={form}
                uploadedFileUrl={form.values.contactIdentityDocumentId}
                kind="IDENTITY"
                isAdmin
              />
              {form.values.contactIdentityType !== "PASSPORT" && (
                <OnBoardingDocumentBox<AdminStep1Values>
                  title="Upload Identity Document (Back)"
                  formKey="contactIdentityDocumentBackId"
                  form={form}
                  uploadedFileUrl={form.values.contactIdentityDocumentBackId}
                  kind="IDENTITY"
                  isAdmin
                />
              )}
            </>
          )}
          {form.values.contactProofOfAddressType && (
            <OnBoardingDocumentBox<AdminStep1Values>
              title="Upload Proof of Address"
              formKey="contactProofOfAddressDocumentId"
              form={form}
              uploadedFileUrl={form.values.contactProofOfAddressDocumentId}
              kind="PROOF_OF_ADDRESS"
              isAdmin
            />
          )}
        </Flex>
      </Stack>

      <Flex justify="flex-end" w="100%" mt={32}>
        <PrimaryBtn
          text="Save & Continue"
          fw={600}
          action={handleSaveAndContinue}
          loading={completing}
          disabled={!isFormReady}
        />
      </Flex>
    </Box>
  );
}
