"use client";

import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useRef } from "react";
import { isAxiosError } from "axios";
import { IconPlus, IconTrash, IconUser, IconUsers } from "@tabler/icons-react";
import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import OnBoardingDocumentBox from "@/ui/section/onboarding/shared/onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SaveProgressBtn } from "@/ui/section/onboarding/shared/utils";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { ReferenceData } from "@/ui/section/onboarding/shared/types";

const questAxios = createAxiosInstance("questionnaire");

type PersonEntry = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  identityType: string;
  identityDocumentId: string;
  identityDocumentBackId: string;
  proofOfAddressType: string;
  proofOfAddressDocumentId: string;
};

type PeopleForm = {
  ceoFirstName: string;
  ceoLastName: string;
  ceoEmail: string;
  ceoDOB: string;
  ceoIdentityType: string;
  ceoIdentityDocumentId: string;
  ceoIdentityDocumentBackId: string;
  ceoProofOfAddressType: string;
  ceoProofOfAddressDocumentId: string;
  directors: PersonEntry[];
  shareholders: PersonEntry[];
};

const emptyPerson = (): PersonEntry => ({
  id: crypto.randomUUID(),
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  identityType: "",
  identityDocumentId: "",
  identityDocumentBackId: "",
  proofOfAddressType: "",
  proofOfAddressDocumentId: "",
});

function formatDOB(date: string): string | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

const SUB_STEPS = ["CEO", "Directors", "Shareholders"] as const;

interface Props {
  adminReference: string;
  refData: ReferenceData;
  onBack: () => void;
  onComplete: () => void;
}

export default function AdminStep4People({ adminReference, refData, onBack, onComplete }: Props) {
  const { handleSuccess, handleError } = useNotification();
  const [subStep, setSubStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const hasSaved = useRef(false);

  const form = useForm<PeopleForm>({
    initialValues: {
      ceoFirstName: "",
      ceoLastName: "",
      ceoEmail: "",
      ceoDOB: "",
      ceoIdentityType: "",
      ceoIdentityDocumentId: "",
      ceoIdentityDocumentBackId: "",
      ceoProofOfAddressType: "",
      ceoProofOfAddressDocumentId: "",
      directors: [emptyPerson()],
      shareholders: [emptyPerson()],
    },
    validate: {
      ceoFirstName: (v) => (!v.trim() ? "First name is required" : null),
      ceoLastName: (v) => (!v.trim() ? "Last name is required" : null),
      ceoEmail: (v) => (!v.trim() ? "Email is required" : !/^\S+@\S+\.\S+$/.test(v) ? "Invalid email" : null),
    },
  });

  const buildPayload = () => {
    const v = form.getValues();
    return {
      ceo: {
        firstName: v.ceoFirstName,
        lastName: v.ceoLastName,
        email: v.ceoEmail,
        dateOfBirth: formatDOB(v.ceoDOB),
        identityType: v.ceoIdentityType || undefined,
        proofOfAddressType: v.ceoProofOfAddressType || undefined,
        identityDocumentId: v.ceoIdentityDocumentId || undefined,
        identityDocumentBackId: v.ceoIdentityDocumentBackId || undefined,
        proofOfAddressDocumentId: v.ceoProofOfAddressDocumentId || undefined,
      },
      directors: v.directors.map((d) => ({
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email || undefined,
        dateOfBirth: formatDOB(d.dateOfBirth),
        identityType: d.identityType || undefined,
        proofOfAddressType: d.proofOfAddressType || undefined,
        identityDocumentId: d.identityDocumentId || undefined,
        identityDocumentBackId: d.identityDocumentBackId || undefined,
        proofOfAddressDocumentId: d.proofOfAddressDocumentId || undefined,
      })),
      shareholders: v.shareholders.map((s) => ({
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email || undefined,
        dateOfBirth: formatDOB(s.dateOfBirth),
        identityType: s.identityType || undefined,
        proofOfAddressType: s.proofOfAddressType || undefined,
        identityDocumentId: s.identityDocumentId || undefined,
        identityDocumentBackId: s.identityDocumentBackId || undefined,
        proofOfAddressDocumentId: s.proofOfAddressDocumentId || undefined,
      })),
    };
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(`/business/onboarding/admin/${adminReference}/steps/4`, buildPayload());
      handleSuccess("Progress Saved", "Your progress has been saved");
    } catch (error) {
      handleError("Save failed", isAxiosError(error) ? error.response?.data?.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) {
      setSubStep(0);
      return;
    }
    if (hasSaved.current && !form.isDirty()) {
      onComplete();
      return;
    }
    setCompleting(true);
    try {
      await questAxios.post(`/business/onboarding/admin/${adminReference}/steps/4/complete`, buildPayload());
      hasSaved.current = true;
      form.resetDirty();
      handleSuccess("People", "People information saved");
      onComplete();
    } catch (error) {
      handleError("An error occurred", isAxiosError(error) ? error.response?.data?.message : "Something went wrong");
    } finally {
      setCompleting(false);
    }
  };

  const handleNextSubStep = () => {
    if (subStep === 0) {
      const { hasErrors } = form.validate();
      if (hasErrors) return;
    }
    setSubStep((s) => Math.min(s + 1, 2));
  };

  return (
    <Box>
      {/* Sub-step progress bar */}
      <Flex gap={0} mb={32} align="center">
        {SUB_STEPS.map((label, idx) => {
          const isActive = idx === subStep;
          const isDone = idx < subStep;
          return (
            <Flex key={label} align="center" style={{ flex: idx < 2 ? "1 0 0" : undefined }}>
              <Flex
                direction="column"
                align="center"
                gap={6}
                style={{ cursor: isDone ? "pointer" : "default" }}
                onClick={() => isDone && setSubStep(idx)}
              >
                <Box
                  w={28}
                  h={28}
                  style={{
                    borderRadius: "50%",
                    background: isActive
                      ? "var(--prune-primary-700)"
                      : isDone
                      ? "var(--prune-primary-50)"
                      : "#F2F4F7",
                    border: isActive
                      ? "2px solid var(--prune-primary-700)"
                      : isDone
                      ? "2px solid var(--prune-primary-700)"
                      : "2px solid #D0D5DD",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Text
                    fz={12}
                    fw={600}
                    c={isActive ? "#fff" : isDone ? "var(--prune-primary-700)" : "#667085"}
                  >
                    {idx + 1}
                  </Text>
                </Box>
                <Text
                  fz={12}
                  fw={isActive ? 600 : 400}
                  c={isActive ? "var(--prune-primary-700)" : "#667085"}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {label}
                </Text>
              </Flex>
              {idx < 2 && (
                <Box
                  h={2}
                  style={{
                    flex: 1,
                    background: isDone ? "var(--prune-primary-700)" : "#EAECF0",
                    margin: "0 8px",
                    marginBottom: 22,
                  }}
                />
              )}
            </Flex>
          );
        })}
      </Flex>

      {/* CEO Sub-step */}
      {subStep === 0 && (
        <CEOSubStep form={form} refData={refData} adminReference={adminReference} />
      )}

      {/* Directors Sub-step */}
      {subStep === 1 && (
        <PersonListSubStep
          title="Directors"
          description="Add the directors of this business."
          icon={<IconUser size={16} />}
          listKey="directors"
          form={form}
          refData={refData}
          adminReference={adminReference}
        />
      )}

      {/* Shareholders Sub-step */}
      {subStep === 2 && (
        <PersonListSubStep
          title="Shareholders"
          description="Add the shareholders of this business."
          icon={<IconUsers size={16} />}
          listKey="shareholders"
          form={form}
          refData={refData}
          adminReference={adminReference}
        />
      )}

      <Flex justify="space-between" mt={32}>
        <SaveProgressBtn loading={saving} action={handleSaveProgress} />
        <Flex gap={12}>
          <SecondaryBtn
            text="Previous"
            action={subStep === 0 ? onBack : () => setSubStep((s) => s - 1)}
            fw={600}
          />
          {subStep < 2 ? (
            <PrimaryBtn text="Next" fw={600} action={handleNextSubStep} />
          ) : (
            <PrimaryBtn
              text="Save & Continue"
              fw={600}
              action={handleSaveAndContinue}
              loading={completing}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

function CEOSubStep({
  form,
  refData,
  adminReference,
}: {
  form: ReturnType<typeof useForm<PeopleForm>>;
  refData: ReferenceData;
  adminReference: string;
}) {
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={{ fontFamily: "'EksellDisplay', serif" }} mb={24}>
        CEO Details
      </Text>
      <Stack gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="First Name" w="100%" placeholder="Enter First Name" withAsterisk {...form.getInputProps("ceoFirstName")} />
          <TextInputWithInsideLabel label="Last Name" w="100%" placeholder="Enter Last Name" withAsterisk {...form.getInputProps("ceoLastName")} />
        </Flex>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="Email" w="100%" placeholder="Enter Email" withAsterisk {...form.getInputProps("ceoEmail")} />
          <DateInputWithInsideLabel
            label="Date of Birth"
            w="100%"
            placeholder="DD/MM/YYYY"
            {...form.getInputProps("ceoDOB")}
          />
        </Flex>
        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel
            label="Identity Type"
            data={refData.identityTypes}
            w="100%"
            searchable
            placeholder="Select Identity Type"
            {...form.getInputProps("ceoIdentityType")}
          />
          <SelectInputWithInsideLabel
            label="Proof of Address"
            w="100%"
            searchable
            placeholder="Select Proof of Address"
            data={refData.proofOfAddressTypes}
            {...form.getInputProps("ceoProofOfAddressType")}
          />
        </Flex>
        <Flex gap={24} w="100%">
          {form.values.ceoIdentityType && (
            <>
              <OnBoardingDocumentBox<PeopleForm>
                title="Upload Identity Document"
                formKey="ceoIdentityDocumentId"
                form={form}
                uploadedFileUrl={form.values.ceoIdentityDocumentId}
                kind="IDENTITY"
                adminReference={adminReference}
                uploadWithReference
              />
              {form.values.ceoIdentityType !== "PASSPORT" && (
                <OnBoardingDocumentBox<PeopleForm>
                  title="Upload Identity Document (Back)"
                  formKey="ceoIdentityDocumentBackId"
                  form={form}
                  uploadedFileUrl={form.values.ceoIdentityDocumentBackId}
                  kind="IDENTITY"
                  adminReference={adminReference}
                  uploadWithReference
                />
              )}
            </>
          )}
          {form.values.ceoProofOfAddressType && (
            <OnBoardingDocumentBox<PeopleForm>
              title="Upload Proof of Address"
              formKey="ceoProofOfAddressDocumentId"
              form={form}
              uploadedFileUrl={form.values.ceoProofOfAddressDocumentId}
              kind="PROOF_OF_ADDRESS"
              adminReference={adminReference}
              uploadWithReference
            />
          )}
        </Flex>
      </Stack>
    </Box>
  );
}

function PersonListSubStep({
  title,
  description,
  listKey,
  form,
  refData,
  adminReference,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  listKey: "directors" | "shareholders";
  form: ReturnType<typeof useForm<PeopleForm>>;
  refData: ReferenceData;
  adminReference: string;
}) {
  const people = form.values[listKey];

  const addPerson = () => {
    form.insertListItem(listKey, emptyPerson());
  };

  const removePerson = (idx: number) => {
    form.removeListItem(listKey, idx);
  };

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={{ fontFamily: "'EksellDisplay', serif" }} mb={6}>
        {title}
      </Text>
      <Text fz={13} c="var(--prune-text-gray-500)" mb={24}>{description}</Text>

      <Stack gap={32}>
        {people.map((person, idx) => (
          <Box
            key={person.id}
            p={20}
            style={{ border: "1px solid #EAECF0", borderRadius: 12 }}
          >
            <Flex justify="space-between" align="center" mb={20}>
              <Text fz={14} fw={600} c="var(--prune-text-gray-700)">
                {title.slice(0, -1)} {idx + 1}
              </Text>
              <UnstyledButton onClick={() => removePerson(idx)}>
                <ThemeIcon color="red" variant="light" radius={6}>
                  <IconTrash size={14} />
                </ThemeIcon>
              </UnstyledButton>
            </Flex>

            <Stack gap={20}>
              <Flex gap={24} w="100%">
                <TextInputWithInsideLabel
                  label="First Name"
                  w="100%"
                  placeholder="Enter First Name"
                  withAsterisk
                  {...form.getInputProps(`${listKey}.${idx}.firstName`)}
                />
                <TextInputWithInsideLabel
                  label="Last Name"
                  w="100%"
                  placeholder="Enter Last Name"
                  withAsterisk
                  {...form.getInputProps(`${listKey}.${idx}.lastName`)}
                />
              </Flex>
              <Flex gap={24} w="100%">
                <TextInputWithInsideLabel
                  label="Email (Optional)"
                  w="100%"
                  placeholder="Enter Email"
                  {...form.getInputProps(`${listKey}.${idx}.email`)}
                />
                <DateInputWithInsideLabel
                  label="Date of Birth"
                  w="100%"
                  placeholder="DD/MM/YYYY"
                  {...form.getInputProps(`${listKey}.${idx}.dateOfBirth`)}
                />
              </Flex>
              <Flex gap={24} w="100%">
                <SelectInputWithInsideLabel
                  label="Identity Type"
                  data={refData.identityTypes}
                  w="100%"
                  searchable
                  placeholder="Select Identity Type"
                  {...form.getInputProps(`${listKey}.${idx}.identityType`)}
                />
                <SelectInputWithInsideLabel
                  label="Proof of Address"
                  w="100%"
                  searchable
                  placeholder="Select Proof of Address"
                  data={refData.proofOfAddressTypes}
                  {...form.getInputProps(`${listKey}.${idx}.proofOfAddressType`)}
                />
              </Flex>
              <Flex gap={24} w="100%">
                {person.identityType && (
                  <>
                    <OnBoardingDocumentBox<PeopleForm>
                      title="Upload Identity Document"
                      formKey={`${listKey}.${idx}.identityDocumentId`}
                      form={form}
                      uploadedFileUrl={person.identityDocumentId}
                      kind="IDENTITY"
                      adminReference={adminReference}
                      uploadWithReference
                    />
                    {person.identityType !== "PASSPORT" && (
                      <OnBoardingDocumentBox<PeopleForm>
                        title="Upload Identity Document (Back)"
                        formKey={`${listKey}.${idx}.identityDocumentBackId`}
                        form={form}
                        uploadedFileUrl={person.identityDocumentBackId}
                        kind="IDENTITY"
                        adminReference={adminReference}
                        uploadWithReference
                      />
                    )}
                  </>
                )}
                {person.proofOfAddressType && (
                  <OnBoardingDocumentBox<PeopleForm>
                    title="Upload Proof of Address"
                    formKey={`${listKey}.${idx}.proofOfAddressDocumentId`}
                    form={form}
                    uploadedFileUrl={person.proofOfAddressDocumentId}
                    kind="PROOF_OF_ADDRESS"
                    adminReference={adminReference}
                    uploadWithReference
                  />
                )}
              </Flex>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Button
        variant="subtle"
        leftSection={<IconPlus size={14} />}
        mt={24}
        color="var(--prune-primary-700)"
        fw={600}
        fz={13}
        onClick={addPerson}
      >
        Add {title.slice(0, -1)}
      </Button>
    </Box>
  );
}
