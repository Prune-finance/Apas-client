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

interface DocumentInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
  refData: ReferenceData;
  adminReference?: string;
  alreadyCompleted?: boolean;
}

function buildSection3Body(form: UseFormReturnType<OnboardingType>) {
  const v = form.getValues();
  return {
    incorporationCertificateId: v.cacCertificate || null,
    memartId: v.mermat || null,
    amlFrameworkId: v.amlCompliance || null,
    operationalLicenceId: v.operationalLicense || null,
  };
}

export const DocumentInfo = ({ setActive, active, form, refData, adminReference, alreadyCompleted }: DocumentInfo) => {
  const { handleSuccess, handleError } = useNotification();

  const docLabel = (kind: string, fallback: string) =>
    refData.companyDocuments.find((d) => d.value === kind)?.label ?? fallback;
  const docRequired = (kind: string) =>
    refData.companyDocuments.find((d) => d.value === kind)?.required ?? true;
  const [mountSnapshot] = useState(() => JSON.stringify(buildSection3Body(form)));
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const sectionBase = buildSectionBase(adminReference, 3);

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(sectionBase, buildSection3Body(form));
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

    if (alreadyCompleted && JSON.stringify(buildSection3Body(form)) === mountSnapshot) {
      setActive(active + 1);
      return;
    }

    setCompleting(true);
    try {
      await questAxios.post(`${sectionBase}/complete`, buildSection3Body(form));
      handleSuccess("Business Documents", "Business documents saved");
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
          Documents
        </Text>
        <SaveProgressBtn loading={saving} action={handleSaveProgress} />
      </Flex>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox
            title={docLabel("INCORPORATION_CERTIFICATE", "CAC Certificate")}
            required={docRequired("INCORPORATION_CERTIFICATE")}
            formKey="cacCertificate"
            form={form}
            uploadedFileUrl={form.getValues().cacCertificate}
            kind="INCORPORATION_CERTIFICATE"
            adminReference={adminReference}
          />
          <OnBoardingDocumentBox
            title={docLabel("MEMART", "Memart")}
            required={docRequired("MEMART")}
            formKey="mermat"
            form={form}
            uploadedFileUrl={form.getValues().mermat}
            kind="MEMART"
            adminReference={adminReference}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox
            title={docLabel("AML_FRAMEWORK", "AML Compliance Framework")}
            required={docRequired("AML_FRAMEWORK")}
            formKey="amlCompliance"
            form={form}
            uploadedFileUrl={form.getValues().amlCompliance || ""}
            kind="AML_FRAMEWORK"
            adminReference={adminReference}
          />
          <OnBoardingDocumentBox
            title={docLabel("OPERATIONAL_LICENCE", "Operational Licence")}
            required={docRequired("OPERATIONAL_LICENCE")}
            formKey="operationalLicense"
            form={form}
            uploadedFileUrl={form.getValues().operationalLicense || ""}
            kind="OPERATIONAL_LICENCE"
            adminReference={adminReference}
          />
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
