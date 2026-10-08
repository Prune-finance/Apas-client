import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SaveProgressBtn, eksellStyle, buildSectionBase } from "./utils";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { isAxiosError } from "axios";
import { ReferenceData } from "./types";

const questAxios = createAxiosInstance("questionnaire");

interface CEOInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
  refData: ReferenceData;
  adminReference?: string;
  noFloatingLabel?: boolean;
  alreadyCompleted?: boolean;
}

function formatDOB(date: Date | string | null | undefined): string | undefined {
  if (!date) return undefined;
  const d = new Date(date as any);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

function buildSection2Body(form: UseFormReturnType<OnboardingType>) {
  const v = form.getValues();
  return {
    firstName: v.ceoFirstName,
    lastName: v.ceoLastName,
    email: v.ceoEmail,
    dateOfBirth: formatDOB(v.ceoDOB),
    identityType: v.ceoIdType || undefined,
    proofOfAddressType: v.ceoPOAType || undefined,
    identityDocumentId: v.ceoIdUrl || undefined,
    proofOfAddressDocumentId: v.ceoPOAUrl || undefined,
  };
}

export const CEOInfo = ({ setActive, active, form, refData, adminReference, noFloatingLabel, alreadyCompleted }: CEOInfo) => {
  const { handleSuccess, handleError } = useNotification();
  const [mountSnapshot] = useState(() => JSON.stringify(buildSection2Body(form)));
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const { ceoIdType, ceoPOAType } = form.getValues();
  const [IdCheck, setIdCheck] = useState({
    isCeoIdType: Boolean(ceoIdType),
    isCeoPOAType: Boolean(ceoPOAType),
    isPassport: ceoIdType === "PASSPORT",
  });

  form.watch("ceoIdType", ({ value }) => {
    setIdCheck({
      isCeoIdType: Boolean(value),
      isCeoPOAType: IdCheck.isCeoPOAType,
      isPassport: value === "PASSPORT",
    });
  });

  form.watch("ceoPOAType", ({ value }) => {
    setIdCheck({ ...IdCheck, isCeoPOAType: Boolean(value) });
  });

  const sectionBase = buildSectionBase(adminReference, 2);

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(sectionBase, buildSection2Body(form));
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

    if (alreadyCompleted && JSON.stringify(buildSection2Body(form)) === mountSnapshot) {
      setActive(active + 1);
      return;
    }

    setCompleting(true);
    try {
      await questAxios.post(`${sectionBase}/complete`, buildSection2Body(form));
      handleSuccess("CEO Details", "CEO details saved");
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
          CEO Details
        </Text>
        <SaveProgressBtn loading={saving} action={handleSaveProgress} />
      </Flex>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="First Name"
            w="100%"
            standard={noFloatingLabel}
            {...form.getInputProps("ceoFirstName")}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            standard={noFloatingLabel}
            {...form.getInputProps("ceoLastName")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel
            label="Email"
            w="100%"
            standard={noFloatingLabel}
            {...form.getInputProps("ceoEmail")}
          />
          <DateInputWithInsideLabel
            label="Date of Birth"
            w="100%"
            standard={noFloatingLabel}
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
            {...form.getInputProps("ceoDOB")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Identity Type"
            w="100%"
            data={refData.identityTypes}
            standard={noFloatingLabel}
            {...form.getInputProps("ceoIdType")}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            data={refData.proofOfAddressTypes}
            standard={noFloatingLabel}
            {...form.getInputProps("ceoPOAType")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          {form.values.ceoIdType && (
            <>
              <OnBoardingDocumentBox
                title="Upload Identity Document"
                form={form}
                formKey="ceoIdUrl"
                uploadedFileUrl={form.values.ceoIdUrl}
                kind="IDENTITY"
                adminReference={adminReference}
              />
              {form.values.ceoIdType !== "PASSPORT" && (
                <OnBoardingDocumentBox
                  title="Upload Identity Document (Back)"
                  form={form}
                  formKey="ceoIdUrlBack"
                  uploadedFileUrl={form.values.ceoIdUrlBack}
                  kind="IDENTITY"
                  adminReference={adminReference}
                />
              )}
            </>
          )}
          {form.values.ceoPOAType && (
            <OnBoardingDocumentBox
              title="Upload Proof of Address"
              formKey="ceoPOAUrl"
              form={form}
              uploadedFileUrl={form.values.ceoPOAUrl}
              kind="PROOF_OF_ADDRESS"
              adminReference={adminReference}
            />
          )}
        </Flex>
      </Stack>

      <Flex align="center" justify="flex-end" w="100%" mt={20} gap={20}>
        <SecondaryBtn
          text="Previous"
          fw={600}
          action={() => setActive(active - 1)}
          disabled={active === 0}
        />
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
