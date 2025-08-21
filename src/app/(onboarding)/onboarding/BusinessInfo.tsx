import {
  MakeInitiator,
  PhoneNumberInput,
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
import { businessIndustries } from "@/lib/static";
import useAxios from "@/lib/hooks/useAxios";
import useNotification from "@/lib/hooks/notification";

interface BusinessInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
}

export const BusinessInfo = ({ setActive, active, form }: BusinessInfo) => {
  const { handleSuccess } = useNotification();
  const { contactPersonIdType, contactPersonPOAType } = form.getValues();
  const [IdCheck, setIdCheck] = useState({
    isContactIdType: Boolean(contactPersonIdType) || false,
    isContactPOAType: Boolean(contactPersonPOAType) || false,
    isPassport: contactPersonIdType === "Passport" ? true : false,
  });

  form.watch("contactPersonIdType", ({ value }) => {
    if (value) {
      setIdCheck({
        ...IdCheck,
        isContactIdType: true,
        isPassport: false,
      });

      if (value === "Passport") {
        setIdCheck({
          ...IdCheck,
          isContactIdType: true,
          isPassport: true,
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

  form.watch("contactPersonPOAType", ({ value }) => {
    if (value) return setIdCheck({ ...IdCheck, isContactPOAType: true });

    setIdCheck({
      ...IdCheck,
      isContactPOAType: false,
    });
  });

  const { queryFn, loading } = useAxios({
    baseURL: "auth",
    endpoint: "/onboarding/business-information",
    method: "POST",
    body: {
      businessName: form.getValues().businessName,
      businessTradingName: form.getValues().businessTradingName,
      businessType: form.getValues().businessType,
      businessIndustry: form.getValues().businessIndustry,
      businessCountry: form.getValues().businessCountry,
      businessAddress: form.getValues().businessAddress,
      businessEmail: form.getValues().businessEmail,
      businessPhoneNumber: form.getValues().businessPhoneNumber,
      businessWebsite: form.getValues().businessWebsite,
      businessDescription: form.getValues().businessDescription,
      contactPersonFirstName: form.getValues().contactPersonFirstName,
      contactPersonLastName: form.getValues().contactPersonLastName,
      contactPersonEmail: form.getValues().contactPersonEmail,
      contactPersonPhoneNumber: form.getValues().contactPersonPhoneNumber,
      contactPersonPOAType: form.getValues().contactPersonPOAType,
      contactPersonPOAUrl: form.getValues().contactPersonPOAUrl,
      contactPersonIdType: form.getValues().contactPersonIdType,
      contactPersonIdUrl: form.getValues().contactPersonIdUrl,
      makeContactPersonInitiator: form.getValues().makeContactPersonInitiator,
    },
    onSuccess: (data) => {
      setActive(active + 1);
      handleSuccess("Business Information", "Business information saved");
    },
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(() => queryFn())}>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Business Information
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Business Name"
            w="100%"
            placeholder="Enter Business Name"
            {...form.getInputProps("businessName")}
          />
          <TextInputWithInsideLabel
            label="Trading Name"
            w="100%"
            placeholder="Enter Trading Name"
            {...form.getInputProps("businessTradingName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Business Type"
            data={["Corporate"]}
            w="100%"
            searchable
            placeholder="Select Business Type"
            {...form.getInputProps("businessType")}
          />
          <SelectInputWithInsideLabel
            label="Business Industry"
            w="100%"
            searchable
            placeholder="Select Business Industry"
            data={businessIndustries}
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
            {...form.getInputProps("businessCountry")}
          />
          <TextInputWithInsideLabel
            label="Address"
            w="100%"
            placeholder="Enter Address"
            {...form.getInputProps("businessAddress")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            placeholder="Enter Email"
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
            label="Business Website"
            w="100%"
            placeholder="Enter Business Website"
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
            {...form.getInputProps("businessDescription")}
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
            placeholder="Enter First Name"
            {...form.getInputProps("contactPersonFirstName")}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            placeholder="Enter Last Name"
            {...form.getInputProps("contactPersonLastName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            placeholder="Enter Email"
            {...form.getInputProps("contactPersonEmail")}
          />
          {/* <TextInputWithInsideLabel
            label="Phone Number"
            w="100%"
            {...form.getInputProps("contactNumber")}
          /> */}
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
            data={["ID Card", "Passport", "Residence Permit"]}
            w="100%"
            searchable
            placeholder="Select Identity Type"
            {...form.getInputProps("contactPersonIdType")}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            searchable
            placeholder="Select Proof of Address"
            data={["Utility Bill"]}
            {...form.getInputProps("contactPersonPOAType")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          {form.values.contactPersonIdType && (
            <>
              <OnBoardingDocumentBox
                title="Upload Identity Document"
                formKey="contactIdUrl"
                form={form}
                uploadedFileUrl={form.getValues().contactPersonIdUrl || ""}
                {...form.getInputProps("contactPersonIdUrl")}
              />

              {form.values.contactPersonIdType !== "Passport" && (
                <OnBoardingDocumentBox
                  title="Upload Identity Document (Back)"
                  formKey="contactIdUrlBack"
                  form={form}
                  uploadedFileUrl={
                    form.getValues().contactPersonIdUrlBack || ""
                  }
                  {...form.getInputProps("contactPersonIdUrlBack")}
                />
              )}
            </>
          )}

          {form.values.contactPersonPOAType && (
            <OnBoardingDocumentBox
              title="Upload Proof of Address"
              formKey="contactPOAUrl"
              form={form}
              uploadedFileUrl={form.getValues().contactPersonPOAUrl || ""}
              {...form.getInputProps("contactPersonPOAUrl")}
            />
          )}
        </Flex>

        <MakeInitiator
          {...form.getInputProps("makeContactPersonInitiator", {
            type: "checkbox",
          })}
        />
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
            loading={loading}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
