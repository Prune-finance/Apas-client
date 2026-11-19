import { Box, Button, Flex, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { SaveProgressBtn, eksellStyle, buildSectionBase } from "./utils";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { extractApiErrors } from "./utils";
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
    refData.companyDocuments.find((d) => d.value === kind)?.required ?? false;
  const [mountSnapshot] = useState(() => JSON.stringify(buildSection3Body(form)));
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const sectionBase = buildSectionBase(adminReference, 3);


  const handleClearForm = () => {
    form.setValues({
      cacCertificate: "",
      mermat: "",
      amlCompliance: "",
      operationalLicense: null,
    });
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await questAxios.patch(sectionBase, buildSection3Body(form));
      handleSuccess("Progress Saved", "Your progress has been saved");
    } catch (error) {
      handleError("Save failed", extractApiErrors(error));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    const v = form.getValues();
    const errors: Record<string, string> = {};

    if (docRequired("INCORPORATION_CERTIFICATE") && !v.cacCertificate)
      errors.cacCertificate = `${docLabel("INCORPORATION_CERTIFICATE", "CAC Certificate")} is required`;
    if (docRequired("MEMART") && !v.mermat)
      errors.mermat = `${docLabel("MEMART", "Memart")} is required`;
    if (docRequired("AML_FRAMEWORK") && !v.amlCompliance)
      errors.amlCompliance = `${docLabel("AML_FRAMEWORK", "AML Compliance Framework")} is required`;
    if (docRequired("OPERATIONAL_LICENCE") && !v.operationalLicense)
      errors.operationalLicense = `${docLabel("OPERATIONAL_LICENCE", "Operational Licence")} is required`;

    if (Object.keys(errors).length > 0) {
      form.setErrors(errors);
      return;
    }

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
      handleError("An error occurred", extractApiErrors(error));
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
            uploadWithReference={Boolean(adminReference)}
          />
          <OnBoardingDocumentBox
            title={docLabel("MEMART", "Memart")}
            required={docRequired("MEMART")}
            formKey="mermat"
            form={form}
            uploadedFileUrl={form.getValues().mermat}
            kind="MEMART"
            adminReference={adminReference}
            uploadWithReference={Boolean(adminReference)}
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
            uploadWithReference={Boolean(adminReference)}
          />
          <OnBoardingDocumentBox
            title={docLabel("OPERATIONAL_LICENCE", "Operational Licence")}
            required={docRequired("OPERATIONAL_LICENCE")}
            formKey="operationalLicense"
            form={form}
            uploadedFileUrl={form.getValues().operationalLicense || ""}
            kind="OPERATIONAL_LICENCE"
            adminReference={adminReference}
            uploadWithReference={Boolean(adminReference)}
          />
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
          />
        </Flex>
      </Flex>
    </Box>
  );
};
