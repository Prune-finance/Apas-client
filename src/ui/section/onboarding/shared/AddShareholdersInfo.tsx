import { Box, Flex, Stack, Text, ThemeIcon } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
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
import { isAxiosError } from "axios";
import { ReferenceData } from "./types";

const questAxios = createAxiosInstance("questionnaire");

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
  return `${mm}-${dd}-${yyyy}`;
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

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(sectionBase, buildSection5Body(form));
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
          Add Shareholder
        </Text>
        <Flex align="center" gap={12}>
          <SaveProgressBtn loading={saving} action={handleSaveProgress} />
          <PrimaryBtn
            text="Add Shareholder"
            leftSection={<IconPlus size={18} />}
            fw={600}
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
              key={form.key(`shareholders.${index}.first_name`)}
              {...form.getInputProps(`shareholders.${index}.first_name`)}
            />
            <TextInputWithInsideLabel
              label="Last Name"
              w="100%"
              standard={noFloatingLabel}
              key={form.key(`shareholders.${index}.last_name`)}
              {...form.getInputProps(`shareholders.${index}.last_name`)}
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
              label="Date of Birth"
              w="100%"
              standard={noFloatingLabel}
              minDate={new Date("1900-01-01")}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
              key={form.key(`shareholders.${index}.date_of_birth`)}
              {...form.getInputProps(`shareholders.${index}.date_of_birth`)}
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
                />
                {shareholder.identityType !== "PASSPORT" && (
                  <OnBoardingDocumentBox
                    title="Upload Identity Document (Back)"
                    formKey={`shareholders.${index}.identityFileUrlBack`}
                    uploadedFileUrl={shareholder.identityFileUrlBack || ""}
                    form={form}
                    kind="IDENTITY"
                    adminReference={adminReference}
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
              />
            )}
          </Flex>
        </Stack>
      ))}

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
