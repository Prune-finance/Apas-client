import { Box, Flex, Stack, Text, ThemeIcon } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { SaveProgressBtn, eksellStyle, buildSectionBase } from "./utils";
import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { OnboardingDirectorValues, OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { isAxiosError } from "axios";
import { ReferenceData } from "./types";

const questAxios = createAxiosInstance("questionnaire");

interface AddDirectorsInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
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

function buildSection4Body(form: UseFormReturnType<OnboardingType>) {
  return {
    directors: form.getValues().directors.map((d) => ({
      firstName: d.first_name,
      lastName: d.last_name,
      email: d.email,
      dateOfBirth: formatDOB(d.date_of_birth),
      identityType: d.identityType || undefined,
      proofOfAddressType: d.proofOfAddress || undefined,
      identityDocumentId: d.identityFileUrl || undefined,
      proofOfAddressDocumentId: d.proofOfAddressFileUrl || undefined,
    })),
  };
}

export const AddDirectorsInfo = ({
  setActive,
  active,
  form,
  refData,
  adminReference,
  noFloatingLabel,
  alreadyCompleted,
}: AddDirectorsInfo) => {
  const { handleSuccess, handleError } = useNotification();
  const [mountSnapshot] = useState(() => JSON.stringify(buildSection4Body(form)));
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const sectionBase = buildSectionBase(adminReference, 4);

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(sectionBase, buildSection4Body(form));
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

    if (alreadyCompleted && JSON.stringify(buildSection4Body(form)) === mountSnapshot) {
      setActive(active + 1);
      return;
    }

    setCompleting(true);
    try {
      await questAxios.post(`${sectionBase}/complete`, buildSection4Body(form));
      handleSuccess("Business Directors", "Directors saved");
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
          Add Directors
        </Text>
        <Flex align="center" gap={12}>
          <SaveProgressBtn loading={saving} action={handleSaveProgress} />
          <PrimaryBtn
            text="Add Directors"
            leftSection={<IconPlus size={18} />}
            fw={600}
            action={() => {
              form.insertListItem("directors", {
                ...OnboardingDirectorValues,
                id: crypto.randomUUID(),
              });
            }}
          />
        </Flex>
      </Flex>

      {form.getValues().directors?.map((director, index) => (
        <Stack mt={30} gap={24} key={director.id ?? index}>
          <Flex justify="space-between" align="center" w="100%">
            <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={eksellStyle}>
              Director {index + 1}
            </Text>

            {index !== 0 && (
              <ThemeIcon
                color="var(--prune-warning)"
                style={{ cursor: "pointer" }}
                variant="transparent"
                size={25}
                onClick={() => form.removeListItem("directors", index)}
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
              key={form.key(`directors.${index}.first_name`)}
              {...form.getInputProps(`directors.${index}.first_name`)}
            />
            <TextInputWithInsideLabel
              label="Last Name"
              w="100%"
              standard={noFloatingLabel}
              key={form.key(`directors.${index}.last_name`)}
              {...form.getInputProps(`directors.${index}.last_name`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            <TextInputWithInsideLabel
              label="Email"
              w="100%"
              standard={noFloatingLabel}
              key={form.key(`directors.${index}.email`)}
              {...form.getInputProps(`directors.${index}.email`)}
            />
            <DateInputWithInsideLabel
              label="Date of Birth"
              w="100%"
              standard={noFloatingLabel}
              minDate={new Date("1900-01-01")}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
              key={form.key(`directors.${index}.date_of_birth`)}
              {...form.getInputProps(`directors.${index}.date_of_birth`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            <SelectInputWithInsideLabel
              label="Identity Type"
              w="100%"
              data={refData.identityTypes}
              standard={noFloatingLabel}
              key={form.key(`directors.${index}.identityType`)}
              {...form.getInputProps(`directors.${index}.identityType`)}
            />
            <SelectInputWithInsideLabel
              label="Proof of Address"
              w="100%"
              data={refData.proofOfAddressTypes}
              standard={noFloatingLabel}
              key={form.key(`directors.${index}.proofOfAddress`)}
              {...form.getInputProps(`directors.${index}.proofOfAddress`)}
            />
          </Flex>

          <Flex gap={24} w="100%">
            {director.identityType && (
              <>
                <OnBoardingDocumentBox
                  title="Upload Identity Document"
                  formKey={`directors.${index}.identityFileUrl`}
                  form={form}
                  uploadedFileUrl={director.identityFileUrl || ""}
                  kind="IDENTITY"
                  adminReference={adminReference}
                />
                {director.identityType !== "PASSPORT" && (
                  <OnBoardingDocumentBox
                    title="Upload Identity Document (Back)"
                    formKey={`directors.${index}.identityFileUrlBack`}
                    form={form}
                    uploadedFileUrl={director.identityFileUrlBack || ""}
                    kind="IDENTITY"
                    adminReference={adminReference}
                  />
                )}
              </>
            )}

            {director.proofOfAddress && (
              <OnBoardingDocumentBox
                title="Upload Proof of Address"
                formKey={`directors.${index}.proofOfAddressFileUrl`}
                form={form}
                uploadedFileUrl={director.proofOfAddressFileUrl || ""}
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
