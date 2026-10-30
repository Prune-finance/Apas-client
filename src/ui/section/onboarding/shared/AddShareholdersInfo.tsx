import { Box, Button, Flex, Stack, Text, ThemeIcon } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn } from "@/ui/components/Buttons";
import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { SaveProgressBtn, eksellStyle, buildSectionBase } from "./utils";
import { OnboardingShareholderValues, OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { extractApiErrors } from "./utils";
import { ReferenceData } from "./types";

const questAxios = createAxiosInstance("questionnaire");

const nameError = (value: string | undefined, label: string, formError: React.ReactNode) => {
  const raw = value ?? "";
  if (raw.length > 50) return `${label} cannot exceed 50 characters`;
  if (raw.length > 0 && raw.trim().length === 0) return `${label} cannot be only spaces`;
  if (raw.length > 0 && raw.length < 2) return `${label} must be at least 2 characters`;
  return formError;
};

interface AddShareholdersInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
  shareholders: OnboardingType["shareholders"];
  refData: ReferenceData;
  adminReference?: string;
  noFloatingLabel?: boolean;
  alreadyCompleted?: boolean;
}

function formatDOB(date: any): string | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function buildSection5Body(form: UseFormReturnType<OnboardingType>) {
  return {
    shareholders: (form.getValues().shareholders ?? []).map((s) => ({
      firstName: s.first_name,
      lastName: s.last_name,
      email: s.email,
      dateOfBirth: formatDOB(s.date_of_birth),
      identityType: s.identityType || undefined,
      proofOfAddressType: s.proofOfAddress || undefined,
      identityDocumentId: s.identityFileUrl || undefined,
      proofOfAddressDocumentId: s.proofOfAddressFileUrl || undefined,
    })),
  };
}

export const AddShareholdersInfo = ({
  setActive,
  active,
  form,
  shareholders,
  refData,
  adminReference,
  noFloatingLabel,
  alreadyCompleted,
}: AddShareholdersInfo) => {
  const { handleSuccess, handleError } = useNotification();
  const [mountSnapshot] = useState(() => JSON.stringify(buildSection5Body(form)));
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const sectionBase = buildSectionBase(adminReference, 5);


  const handleClearForm = () => {
    form.setFieldValue("shareholders", [{ ...OnboardingShareholderValues, id: crypto.randomUUID() }]);
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(sectionBase, buildSection5Body(form));
      handleSuccess("Progress Saved", "Your progress has been saved");
    } catch (error) {
      handleError("Save failed", extractApiErrors(error));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    // The button stays enabled: on click, mark every missing field (uploads included) in red
    const { errors, hasErrors } = form.validate();
    const v = form.getValues();
    const docErrors: Record<string, string> = {};
    (v.shareholders ?? []).forEach((p, i) => {
      const base = `shareholders.${i}`;
      if (!p.identityType) docErrors[`${base}.identityType`] = "Identity type is required";
      else if (!p.identityFileUrl) docErrors[`${base}.identityFileUrl`] = "Identity document is required";
      if (p.identityType && p.identityType !== "PASSPORT" && !p.identityFileUrlBack)
        docErrors[`${base}.identityFileUrlBack`] = "Back of identity document is required";
      if (!p.proofOfAddress) docErrors[`${base}.proofOfAddress`] = "Proof of address is required";
      else if (!p.proofOfAddressFileUrl)
        docErrors[`${base}.proofOfAddressFileUrl`] = "Proof of address document is required";
    });
    if (hasErrors || Object.keys(docErrors).length > 0) {
      form.setErrors({ ...errors, ...docErrors });
      return;
    }

    if (alreadyCompleted && JSON.stringify(buildSection5Body(form)) === mountSnapshot) {
      setActive(active + 1);
      return;
    }

    setCompleting(true);
    try {
      await questAxios.post(`${sectionBase}/complete`, buildSection5Body(form));
      handleSuccess("Business Shareholders", "Shareholders saved");
      setActive(active + 1);
    } catch (error) {
      handleError("An error occurred", extractApiErrors(error));
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Box>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={eksellStyle}>
          Add Shareholder
        </Text>
        <Flex align="center" gap={12}>
          <SaveProgressBtn loading={saving} action={handleSaveProgress} />
          <PrimaryBtn
            text="Add Shareholder"
            icon={IconPlus}
            showIcon
            h={36}
            fz={13}
            fw={500}
            action={() => {
              form.insertListItem("shareholders", {
                ...OnboardingShareholderValues,
                id: crypto.randomUUID(),
              });
            }}
          />
        </Flex>
      </Flex>

      {form.getValues().shareholders?.map((shareholder, index) => (
        <Stack mt={30} gap={24} key={shareholder.id ?? index}>
          <Flex justify="space-between" align="center" w="100%">
            <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={eksellStyle}>
              Shareholder {index + 1}
            </Text>
            {index !== 0 && (
              <ThemeIcon
                color="var(--prune-warning)"
                style={{ cursor: "pointer" }}
                variant="transparent"
                size={25}
                onClick={() => form.removeListItem("shareholders", index)}
              >
                <IconTrash />
              </ThemeIcon>
            )}
          </Flex>

          <Flex gap={24} w="100%">
            <TextInputWithInsideLabel
              label="First Name"
              w="100%"
              standard={noFloatingLabel}
              withAsterisk
              key={form.key(`shareholders.${index}.first_name`)}
              {...form.getInputProps(`shareholders.${index}.first_name`)}
              error={nameError(
                (form.values.shareholders ?? [])[index]?.first_name,
                "Shareholder's first name",
                form.errors[`shareholders.${index}.first_name`]
              )}
            />
            <TextInputWithInsideLabel
              label="Last Name"
              w="100%"
              standard={noFloatingLabel}
              withAsterisk
              key={form.key(`shareholders.${index}.last_name`)}
              {...form.getInputProps(`shareholders.${index}.last_name`)}
              error={nameError(
                (form.values.shareholders ?? [])[index]?.last_name,
                "Shareholder's last name",
                form.errors[`shareholders.${index}.last_name`]
              )}
            />
          </Flex>

          <Flex gap={24} w="100%">
            <TextInputWithInsideLabel
              label="Email"
              w="100%"
              standard={noFloatingLabel}
              key={form.key(`shareholders.${index}.email`)}
              {...form.getInputProps(`shareholders.${index}.email`)}
            />
            <DateInputWithInsideLabel
              minimumAge={18}
              label="Date of Birth"
              w="100%"
              standard={noFloatingLabel}
              maxDate={new Date()}
              key={form.key(`shareholders.${index}.date_of_birth`)}
              {...form.getInputProps(`shareholders.${index}.date_of_birth`)}
              error={(() => {
                const dob = (form.values.shareholders ?? [])[index]?.date_of_birth;
                if (!dob) return form.errors[`shareholders.${index}.date_of_birth`];
                const cutoff = new Date();
                cutoff.setFullYear(cutoff.getFullYear() - 18);
                return new Date(dob as string | Date) > cutoff
                  ? "Shareholder must be at least 18 years old"
                  : form.errors[`shareholders.${index}.date_of_birth`];
              })()}
            />
          </Flex>

          <Flex gap={24} w="100%">
            <SelectInputWithInsideLabel
              label="Identity Type"
              w="100%"
              data={refData.identityTypes}
              standard={noFloatingLabel}
              key={form.key(`shareholders.${index}.identityType`)}
              {...form.getInputProps(`shareholders.${index}.identityType`)}
            />
            <SelectInputWithInsideLabel
              label="Proof of Address"
              w="100%"
              data={refData.proofOfAddressTypes}
              standard={noFloatingLabel}
              key={form.key(`shareholders.${index}.proofOfAddress`)}
              {...form.getInputProps(`shareholders.${index}.proofOfAddress`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            {shareholder.identityType && (
              <>
                <OnBoardingDocumentBox
                  title="Upload Identity Document"
                  formKey={`shareholders.${index}.identityFileUrl`}
                  uploadedFileUrl={shareholder.identityFileUrl || ""}
                  form={form}
                  kind="IDENTITY"
                  adminReference={adminReference}
                  uploadWithReference={Boolean(adminReference)}
                />
                {shareholder.identityType !== "PASSPORT" && (
                  <OnBoardingDocumentBox
                    title="Upload Identity Document (Back)"
                    formKey={`shareholders.${index}.identityFileUrlBack`}
                    uploadedFileUrl={shareholder.identityFileUrlBack || ""}
                    form={form}
                    kind="IDENTITY"
                    adminReference={adminReference}
                    uploadWithReference={Boolean(adminReference)}
                  />
                )}
              </>
            )}
            {shareholder.proofOfAddress && (
              <OnBoardingDocumentBox
                title="Upload Proof of Address"
                formKey={`shareholders.${index}.proofOfAddressFileUrl`}
                uploadedFileUrl={shareholder.proofOfAddressFileUrl || ""}
                form={form}
                kind="PROOF_OF_ADDRESS"
                adminReference={adminReference}
                uploadWithReference={Boolean(adminReference)}
              />
            )}
          </Flex>
        </Stack>
      ))}

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
          />
        </Flex>
      </Flex>
    </Box>
  );
};
