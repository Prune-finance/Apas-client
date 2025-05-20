import { Alert, SimpleGrid } from "@mantine/core";

import PaperContainer from "../PaperContainer";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { IconAlertTriangle, IconPlus } from "@tabler/icons-react";
import { PanelWrapper } from "./utils";
import { OnboardingBusiness } from "@/lib/interface";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import createAxiosInstance from "@/lib/axios";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
}

export default function Documents({ data, loading, form }: ComponentProps) {
  const { handleError, handleSuccess } = useNotification();
  const axios = createAxiosInstance("auth");

  const businessDocs = [
    {
      label: "CAC Certificate",
      title: "CAC Certificate",
      value: data?.cacCertificate,
      formKey: "cacCertificate",
    },
    {
      label: "Memart",
      title: "Memart",
      value: data?.mermat,
      formKey: "mermat",
    },
    {
      label: "AML Compliance Framework",
      title: "AML Compliance Framework",
      value: data?.amlCompliance,
      formKey: "amlCompliance",
    },
    {
      label: "Operational License (optional)",
      title: "Operational License",
      value: data?.operationalLicense,
      formKey: "operationalLicense",
    },
  ];

  const handleDocumentApproval = async (
    type: "approve" | "reject",
    formKey:
      | "cacCertificate"
      | "amlCompliance"
      | "mermat"
      | "operationalLicense"
      | (string & {})
  ) => {
    try {
      await axios.patch(`/admin/onboardings/${data?.id}/approve-documents`, {
        ...data?.documentData,
        [formKey]: type === "approve",
      });

      handleSuccess(
        "Document",
        type === "approve" ? "Document approved" : "Document rejected"
      );
    } catch (error) {
      handleError("An error occurred", parseError(error));
    }
  };

  return (
    <PanelWrapper
      loading={loading}
      rows={data?.onboardingStatus === "COMPLETED" ? [1] : []}
      panelName="Document"
    >
      <PaperContainer title="Terms of use agreement">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <DocumentPreview label="" title="File.pdf....." />
        </SimpleGrid>
      </PaperContainer>

      <Alert
        title="All documents need to be reviewed and approved before activating this business."
        color="#003E9C"
        icon={<IconAlertTriangle />}
        c="var(--prune-text-gray-700)"
        styles={{
          root: {
            borderLeft: "4px solid #003E9C",
          },
          title: {
            fontSize: "16px",
            fontWeight: 400,
          },
        }}
        mt={24}
      />

      <PaperContainer
        title="Business Documents"
        mt={24}
        actionNode={
          <PrimaryBtn
            text="Add Document"
            fw={600}
            fz={12}
            leftSection={<IconPlus size={16} />}
          />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {businessDocs.map((doc, idx) => (
            <DocumentPreview
              key={idx}
              label={doc.label}
              title={doc.title}
              value={doc.value || ""}
              showActions
              formKey={doc.formKey}
              handleDocumentApproval={handleDocumentApproval}
            />
          ))}
        </SimpleGrid>
      </PaperContainer>
    </PanelWrapper>
  );
}
