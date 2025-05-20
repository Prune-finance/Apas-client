import { Alert, Group, SimpleGrid, Stack } from "@mantine/core";
import React, { useState } from "react";
import PaperContainer from "../PaperContainer";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { PrimaryBtn } from "@/ui/components/Buttons";
import {
  IconAlertTriangle,
  IconCheck,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { PanelWrapper } from "./utils";
import { OnboardingBusiness } from "@/lib/interface";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import { FileRows } from "../../../account-requests/[id]/[requestId]/FileTextInput";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
}

export default function Documents({ data, loading, form }: ComponentProps) {
  const [rows, setRows] = useState([]);
  const businessDocs = [
    {
      label: "CAC Certificate",
      title: "CAC Certificate",
      value: data?.cacCertificate,
    },
    { label: "Memart", title: "Memart", value: data?.mermat },
    {
      label: "AML Compliance Framework",
      title: "AML Compliance Framework",
      value: data?.amlCompliance,
    },
    {
      label: "Operational License (optional)",
      title: "Operational License",
      value: data?.operationalLicense,
    },
  ];
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
            />
          ))}
        </SimpleGrid>
      </PaperContainer>
    </PanelWrapper>
  );
}
