import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Button, Flex, Stack, Text } from "@mantine/core";

const nameError = (value: string | undefined, label: string, formError: React.ReactNode) => {
  const raw = value ?? "";
  if (raw.length > 50) return `${label} cannot exceed 50 characters`;
  if (raw.length > 0 && raw.trim().length === 0) return `${label} cannot be only spaces`;
  if (raw.length > 0 && raw.length < 2) return `${label} must be at least 2 characters`;
  return formError;
};
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn } from "@/ui/components/Buttons";
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
  return `${dd}-${mm}-${yyyy}`;
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

  const isFormReady = (() => {
    if (!form.isValid()) return false;
    const v = form.getValues();
    if (!v.ceoIdUrl) return false;
    if (v.ceoIdType !== "PASSPORT" && !v.ceoIdUrlBack) return false;
    if (!v.ceoPOAUrl) return false;
    return true;
  })();

  const handleClearForm = () => {
    form.setValues({
      ceoFirstName: "",
      ceoLastName: "",
      ceoEmail: "",
      ceoDOB: null,
      ceoIdType: "",
      ceoPOAType: "",
      ceoIdUrl: "",
      ceoIdUrlBack: "",
      ceoPOAUrl: "",
    });
  };

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
            error={nameError(form.values.ceoFirstName, "CEO first name", form.errors.ceoFirstName)}
          />
          <TextInputWithInsideLabel
            label="Last Name"
            w="100%"
            standard={noFloatingLabel}
            {...form.getInputProps("ceoLastName")}
            error={nameError(form.values.ceoLastName, "CEO last name", form.errors.ceoLastName)}
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
            maxDate={new Date()}
            {...form.getInputProps("ceoDOB")}
            error={(() => {
              const dob = form.values.ceoDOB;
              if (!dob) return form.errors.ceoDOB;
              const cutoff = new Date();
              cutoff.setFullYear(cutoff.getFullYear() - 18);
              return new Date(dob as string | Date) > cutoff
                ? "CEO must be at least 18 years old"
                : form.errors.ceoDOB;
            })()}
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
                uploadWithReference={Boolean(adminReference)}
              />
              {form.values.ceoIdType !== "PASSPORT" && (
                <OnBoardingDocumentBox
                  title="Upload Identity Document (Back)"
                  form={form}
                  formKey="ceoIdUrlBack"
                  uploadedFileUrl={form.values.ceoIdUrlBack}
                  kind="IDENTITY"
                  adminReference={adminReference}
                  uploadWithReference={Boolean(adminReference)}
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
              uploadWithReference={Boolean(adminReference)}
            />
          )}
        </Flex>
      </Stack>

      <Flex align="center" justify="space-between" w="100%" mt={20}>
        <Button
          radius={9999}
          px={18}
          h={40}
          fz={14}
          fw={500}
          c="#344054"
          onClick={handleClearForm}
          styles={{ root: { backgroundColor: "#fff", border: "1px solid #EAECF0", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" } }}
        >
          Clear Form
        </Button>
        <Flex gap={20} align="center">
          <Button
            radius={9999}
            px={18}
            h={40}
            fz={14}
            fw={500}
            c="#344054"
            onClick={() => setActive(active - 1)}
            styles={{ root: { backgroundColor: "#F2F4F7", border: "1px solid #EAECF0", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" } }}
          >
            Previous
          </Button>
          <PrimaryBtn
            text="Save & Continue"
            fw={600}
            action={handleSaveAndContinue}
            loading={completing}
            disabled={!isFormReady}
            styles={{ root: { "&[data-disabled]": { backgroundColor: "#EAECF0", color: "#98A2B3", opacity: 1 } } }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
