import {
  MakeInitiator,
  PhoneNumberInput,
  SelectInputWithInsideLabel,
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SaveProgressBtn, eksellStyle, buildSectionBase } from "./utils";
import { UseFormReturnType } from "@mantine/form";
import { OnboardingType } from "@/lib/schema";
import countries from "@/assets/countries.json";
import { useState } from "react";
import { businessIndustries } from "@/lib/static";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { isAxiosError } from "axios";
import { ReferenceData } from "./types";

const questAxios = createAxiosInstance("questionnaire");

interface BusinessInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
  refData: ReferenceData;
  adminReference?: string;
  onReferenceObtained?: (ref: string) => void;
  noFloatingLabel?: boolean;
  isAdmin?: boolean;
  alreadyCompleted?: boolean;
}

function buildSection1Body(form: UseFormReturnType<OnboardingType>) {
  const v = form.getValues();
  return {
    businessName: v.businessName,
    tradingName: v.businessTradingName,
    businessType: v.businessType,
    businessIndustry: v.businessIndustry,
    countryCode: v.businessCountry,
    businessAddress: v.businessAddress,
    businessEmail: v.businessEmail,
    businessPhoneCountryCode: v.businessPhoneNumberCode,
    businessPhoneNumber: v.businessPhoneNumber,
    businessWebsite: (v.businessWebsite && v.businessWebsite !== "https://" && v.businessWebsite !== "http://")
      ? v.businessWebsite
      : undefined,
    businessDescription: v.businessDescription,
    contactIsInitiator: v.makeContactPersonInitiator,
    contactPerson: {
      firstName: v.contactPersonFirstName,
      lastName: v.contactPersonLastName,
      email: v.contactPersonEmail,
      phoneCountryCode: v.contactPersonPhoneNumberCode,
      phoneNumber: v.contactPersonPhoneNumber,
      identityType: v.contactPersonIdType || undefined,
      proofOfAddressType: v.contactPersonPOAType || undefined,
      identityDocumentId: v.contactPersonIdUrl || undefined,
      proofOfAddressDocumentId: v.contactPersonPOAUrl || undefined,
    },
  };
}

export const BusinessInfo = ({ setActive, active, form, refData, adminReference, onReferenceObtained, noFloatingLabel, isAdmin, alreadyCompleted }: BusinessInfo) => {
  const { handleSuccess, handleError } = useNotification();
  const [mountSnapshot] = useState(() => JSON.stringify(buildSection1Body(form)));
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const { contactPersonIdType, contactPersonPOAType } = form.getValues();
  const [IdCheck, setIdCheck] = useState({
    isContactIdType: Boolean(contactPersonIdType) || false,
    isContactPOAType: Boolean(contactPersonPOAType) || false,
    isPassport: contactPersonIdType === "PASSPORT",
  });

  form.watch("contactPersonIdType", ({ value }) => {
    setIdCheck({
      isContactIdType: Boolean(value),
      isContactPOAType: IdCheck.isContactPOAType,
      isPassport: value === "PASSPORT",
    });
  });

  form.watch("contactPersonPOAType", ({ value }) => {
    setIdCheck({ ...IdCheck, isContactPOAType: Boolean(value) });
  });

  const sectionBase = buildSectionBase(adminReference, 1);

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      const res = await questAxios.patch(sectionBase, buildSection1Body(form));
      const ref = res.data?.data?.reference;
      if (ref) onReferenceObtained?.(ref);
      handleSuccess("Progress Saved", "Your progress has been saved");
    } catch (error) {
      handleError(
        "Save failed",
        isAxiosError(error) ? error.response?.data?.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    if (alreadyCompleted && JSON.stringify(buildSection1Body(form)) === mountSnapshot) {
      setActive(active + 1);
      return;
    }

    setCompleting(true);
    try {
      const res = await questAxios.post(`${sectionBase}/complete`, buildSection1Body(form));
      const ref = res.data?.data?.reference;
      if (ref) onReferenceObtained?.(ref);
      handleSuccess("Business Information", "Business information saved");
      setActive(active + 1);
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
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={eksellStyle}>
          Business Information
        </Text>
        <SaveProgressBtn loading={saving} action={handleSaveProgress} />
      </Flex>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Business Name"
            w="100%"
            placeholder="Enter Business Name"
            standard={noFloatingLabel}
            {...form.getInputProps("businessName")}
          />
          <TextInputWithInsideLabel
            label="Trading Name"
            w="100%"
            placeholder="Enter Trading Name"
            standard={noFloatingLabel}
            {...form.getInputProps("businessTradingName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Business Type"
            data={refData.businessTypes}
            w="100%"
            searchable
            placeholder="Select Business Type"
            standard={noFloatingLabel}
            {...form.getInputProps("businessType")}
          />
          <SelectInputWithInsideLabel
            label="Business Industry"
            w="100%"
            searchable
            placeholder="Select Business Industry"
            data={businessIndustries}
            standard={noFloatingLabel}
            {...form.getInputProps("businessIndustry")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Country"
            w="100%"
            searchable
            placeholder="Select Country"
            data={countries.map((country) => country.name)}
            standard={noFloatingLabel}
            {...form.getInputProps("businessCountry")}
          />
          <TextInputWithInsideLabel
            label="Address"
            w="100%"
            placeholder="Enter Address"
            standard={noFloatingLabel}
            {...form.getInputProps("businessAddress")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            placeholder="Enter Email"
            standard={noFloatingLabel}
            {...form.getInputProps("businessEmail")}
          />

          <Box w="100%">
            <PhoneNumberInput<OnboardingType>
              form={form}
              phoneNumberKey="businessPhoneNumber"
              countryCodeKey="businessPhoneNumberCode"
            />
          </Box>
        </Flex>

        <Flex gap={24} w="50%">
          <TextInputWithInsideLabel
            label="Business Website (Optional)"
            w="100%"
            placeholder="Enter Business Website"
            standard={noFloatingLabel}
            {...form.getInputProps("businessWebsite")}
          />
        </Flex>

        <Flex gap={24} w="100%" mb={48}>
          <TextareaWithInsideLabel
            label="Company's Description"
            w="100%"
            autosize
            maxRows={7}
            minRows={5}
            placeholder="Enter Company's Description"
            standard={noFloatingLabel}
            {...form.getInputProps("businessDescription")}
          />
        </Flex>
      </Stack>

      <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={eksellStyle}>
        Contact Person
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="First Name"
            w="100%"
            placeholder="Enter First Name"
            standard={noFloatingLabel}
            {...form.getInputProps("contactPersonFirstName")}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            placeholder="Enter Last Name"
            standard={noFloatingLabel}
            {...form.getInputProps("contactPersonLastName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            placeholder="Enter Email"
            standard={noFloatingLabel}
            {...form.getInputProps("contactPersonEmail")}
          />
          <Box w="100%">
            <PhoneNumberInput<OnboardingType>
              form={form}
              phoneNumberKey="contactPersonPhoneNumber"
              countryCodeKey="contactPersonPhoneNumberCode"
            />
          </Box>
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Identity Type"
            data={refData.identityTypes}
            w="100%"
            searchable
            placeholder="Select Identity Type"
            standard={noFloatingLabel}
            {...form.getInputProps("contactPersonIdType")}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            searchable
            placeholder="Select Proof of Address"
            data={refData.proofOfAddressTypes}
            standard={noFloatingLabel}
            {...form.getInputProps("contactPersonPOAType")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          {form.values.contactPersonIdType && (
            <>
              <OnBoardingDocumentBox
                title="Upload Identity Document"
                formKey="contactPersonIdUrl"
                form={form}
                uploadedFileUrl={form.getValues().contactPersonIdUrl || ""}
                kind="IDENTITY"
                adminReference={adminReference}
                isAdmin={isAdmin}
              />

              {form.values.contactPersonIdType !== "PASSPORT" && (
                <OnBoardingDocumentBox
                  title="Upload Identity Document (Back)"
                  formKey="contactPersonIdUrlBack"
                  form={form}
                  uploadedFileUrl={form.getValues().contactPersonIdUrlBack || ""}
                  kind="IDENTITY"
                  adminReference={adminReference}
                  isAdmin={isAdmin}
                />
              )}
            </>
          )}

          {form.values.contactPersonPOAType && (
            <OnBoardingDocumentBox
              title="Upload Proof of Address"
              formKey="contactPersonPOAUrl"
              form={form}
              uploadedFileUrl={form.getValues().contactPersonPOAUrl || ""}
              kind="PROOF_OF_ADDRESS"
              adminReference={adminReference}
              isAdmin={isAdmin}
            />
          )}
        </Flex>

        <MakeInitiator
          {...form.getInputProps("makeContactPersonInitiator", {
            type: "checkbox",
          })}
        />
      </Stack>

      <Flex align="center" justify="flex-end" w="100%" mt={20}>
        <PrimaryBtn
          text="Save & Continue"
          w={160}
          fw={600}
          action={handleSaveAndContinue}
          loading={completing}
        />
      </Flex>
    </Box>
  );
};
