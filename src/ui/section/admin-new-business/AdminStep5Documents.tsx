"use client";

import { Box, Flex, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useRef } from "react";
import { isAxiosError } from "axios";
import OnBoardingDocumentBox from "@/ui/section/onboarding/shared/onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { SaveProgressBtn } from "@/ui/section/onboarding/shared/utils";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";

const questAxios = createAxiosInstance("questionnaire");

type DocsForm = {
  incorporationCertificateId: string;
  memartId: string;
  amlFrameworkId: string;
  operationalLicenceId: string;
};

interface Props {
  adminReference: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function AdminStep5Documents({ adminReference, onBack, onComplete }: Props) {
  const { handleSuccess, handleError } = useNotification();
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const hasSaved = useRef(false);

  const form = useForm<DocsForm>({
    initialValues: {
      incorporationCertificateId: "",
      memartId: "",
      amlFrameworkId: "",
      operationalLicenceId: "",
    },
  });

  const buildPayload = () => {
    const v = form.getValues();
    return {
      incorporationCertificateId: v.incorporationCertificateId || null,
      memartId: v.memartId || null,
      amlFrameworkId: v.amlFrameworkId || null,
      operationalLicenceId: v.operationalLicenceId || null,
    };
  };

  const isFormReady = Boolean(
    form.values.incorporationCertificateId &&
      form.values.memartId &&
      form.values.amlFrameworkId
  );

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(`/business/onboarding/admin/${adminReference}/steps/5`, buildPayload());
      handleSuccess("Progress Saved", "Your progress has been saved");
    } catch (error) {
      handleError("Save failed", isAxiosError(error) ? (error.response?.data?.issues?.[0]?.message ?? error.response?.data?.message ?? "Something went wrong") : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!isFormReady) {
      handleError("Validation", "Please upload all required documents");
      return;
    }
    if (hasSaved.current && !form.isDirty()) {
      onComplete();
      return;
    }
    setCompleting(true);
    try {
      await questAxios.post(`/business/onboarding/admin/${adminReference}/steps/5/complete`, buildPayload());
      hasSaved.current = true;
      form.resetDirty();
      handleSuccess("Documents", "Documents uploaded successfully");
      onComplete();
    } catch (error) {
      handleError("An error occurred", isAxiosError(error) ? (error.response?.data?.issues?.[0]?.message ?? error.response?.data?.message ?? "Something went wrong") : "Something went wrong");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700} style={{ fontFamily: "'EksellDisplay', serif" }}>
        Documents
      </Text>
      <Text fz={13} c="var(--prune-text-gray-500)" mt={4} mb={28}>
        Upload the required business documents.
      </Text>

      <Stack gap={24}>
        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox<DocsForm>
            title="Certificate of Incorporation"
            formKey="incorporationCertificateId"
            form={form}
            uploadedFileUrl={form.values.incorporationCertificateId}
            required
            kind="INCORPORATION_CERTIFICATE"
            adminReference={adminReference}
            uploadWithReference
          />
          <OnBoardingDocumentBox<DocsForm>
            title="Memorandum and Articles of Association (MEMART)"
            formKey="memartId"
            form={form}
            uploadedFileUrl={form.values.memartId}
            required
            kind="MEMART"
            adminReference={adminReference}
            uploadWithReference
          />
        </Flex>
        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox<DocsForm>
            title="AML Compliance Framework"
            formKey="amlFrameworkId"
            form={form}
            uploadedFileUrl={form.values.amlFrameworkId}
            required
            kind="AML_FRAMEWORK"
            adminReference={adminReference}
            uploadWithReference
          />
          <OnBoardingDocumentBox<DocsForm>
            title="Operational Licence (Optional)"
            formKey="operationalLicenceId"
            form={form}
            uploadedFileUrl={form.values.operationalLicenceId}
            kind="OPERATIONAL_LICENCE"
            adminReference={adminReference}
            uploadWithReference
          />
        </Flex>
      </Stack>

      <Flex justify="space-between" mt={32}>
        <SaveProgressBtn loading={saving} action={handleSaveProgress} />
        <Flex gap={12}>
          <SecondaryBtn text="Previous" action={onBack} fw={600} />
          <PrimaryBtn
            text="Save & Continue"
            fw={600}
            action={handleSaveAndContinue}
            loading={completing}
            disabled={!isFormReady}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
