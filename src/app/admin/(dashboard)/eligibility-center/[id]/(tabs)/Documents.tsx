import {
  ActionIcon,
  Alert,
  Box,
  Flex,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";

import PaperContainer from "../PaperContainer";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  IconAlertTriangle,
  IconDownload,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { PanelWrapper } from "./utils";
import { OnboardingBusiness } from "@/lib/interface";
import {
  OnboardingType,
  otherDocumentSchema,
  OtherDocumentType,
  otherDocumentValues,
} from "@/lib/schema";
import { useForm, UseFormReturnType, zodResolver } from "@mantine/form";
import useNotification from "@/lib/hooks/notification";
import { parseError } from "@/lib/actions/auth";
import createAxiosInstance from "@/lib/axios";
import DropzoneComponent from "@/ui/components/Dropzone";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

const axios = createAxiosInstance("auth");
interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
  revalidate?: () => Promise<void>;
}

export default function Documents({
  data,
  loading,
  form,
  revalidate,
}: ComponentProps) {
  const { handleError, handleSuccess } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loadingRejection, setLoadingRejection] = useState(false);

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
    if (type === "approve") {
      setLoadingApproval(true);
    }
    if (type === "reject") {
      setLoadingRejection(true);
    }

    try {
      await axios.patch(`/admin/onboardings/${data?.id}/approve-documents`, {
        documentData: { ...data?.documentData, [formKey]: type === "approve" },
      });

      handleSuccess(
        "Document",
        type === "approve" ? "Document approved" : "Document rejected"
      );
      revalidate && (await revalidate());
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setLoadingApproval(false);
      setLoadingRejection(false);
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
            action={open}
            leftSection={<IconPlus size={16} />}
          />
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24}>
          {[
            ...businessDocs,
            ...(data?.documents?.map((d) => ({
              value: d.url,
              label: d.title,
              title: d.title,
              formKey: d.title,
            })) || []),
          ].map((doc, idx) => (
            <DocumentPreview
              key={idx}
              label={doc.label}
              title={doc.title}
              value={doc.value || ""}
              showActions
              formKey={doc.formKey}
              handleDocumentApproval={handleDocumentApproval}
              documentStatus={
                doc.formKey && data?.documentData?.[doc.formKey] !== undefined
                  ? data?.documentData[doc.formKey]
                    ? "APPROVED"
                    : "REJECTED"
                  : null
              }
            >
              <Flex justify="end" align="center" my={16} gap={20}>
                {doc.value && (
                  <ActionIcon
                    color="var(--prune-text-gray-700)"
                    variant="light"
                    radius="md"
                    size={40}
                    component={Link}
                    href={doc.value}
                    download
                  >
                    <IconDownload />
                  </ActionIcon>
                )}
                <PrimaryBtn
                  text="Reject"
                  color="var(--prune-warning)"
                  fw={600}
                  c="#fff"
                  action={() => {
                    handleDocumentApproval &&
                      doc.formKey &&
                      handleDocumentApproval("reject", doc.formKey);
                  }}
                  loading={loadingRejection}
                />
                <PrimaryBtn
                  text="Approve Document"
                  fw={600}
                  action={() => {
                    handleDocumentApproval &&
                      doc.formKey &&
                      handleDocumentApproval("approve", doc.formKey);
                  }}
                  loading={loadingApproval}
                />
              </Flex>
            </DocumentPreview>
          ))}
        </SimpleGrid>
      </PaperContainer>

      <NewDocumentModal
        opened={opened}
        close={close}
        data={data}
        revalidate={revalidate}
      />
    </PanelWrapper>
  );
}

interface NewDocumentModalProps {
  opened: boolean;
  close: () => void;
  data: OnboardingBusiness | null;
  revalidate?: () => Promise<void>;
}
const NewDocumentModal = ({
  opened,
  close,
  data,
  revalidate,
}: NewDocumentModalProps) => {
  const [processing, setProcessing] = useState(false);

  const { handleError, handleSuccess } = useNotification();

  const form = useForm<OtherDocumentType>({
    initialValues: otherDocumentValues,
    validate: zodResolver(otherDocumentSchema),
  });

  const handleUpload = async () => {
    setProcessing(true);

    const { name, url } = form.values;
    try {
      await axios.post(`/admin/onboardings/${data?.id}/additional-documents`, {
        documents: [...(data?.documents || []), { title: name, url }],
      });
      handleSuccess("Document", "Document added successfully");
      revalidate && (await revalidate());
      close();
      form.reset();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const closeButtonProps = {
    mr: 10,
    children: (
      <ActionIcon
        radius="xl"
        variant="filled"
        color="var(--prune-text-gray-100)"
        size={32}
      >
        <IconX color="var(--prune-text-gray-500)" stroke={1.5} />
      </ActionIcon>
    ),
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        form.reset();
      }}
      closeButtonProps={closeButtonProps}
      title={
        <Text fz={20} fw={600}>
          New Document
        </Text>
      }
      padding={32}
      centered
    >
      <Box
        component="form"
        onSubmit={form.onSubmit(() => handleUpload())}
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
      >
        <TextInput
          placeholder="Enter Document Name"
          {...form.getInputProps("name")}
          size="lg"
          radius={4}
          errorProps={{ fz: 12 }}
        />

        <Box>
          <DropzoneComponent
            otherDocumentForm={form}
            formKey="url"
            uploadedFileUrl={form.values.url}
          />
          {form.errors.url && (
            <Text c="var(--prune-warning)" fz={12} mt={0} p={0}>
              {form.errors.url}
            </Text>
          )}
        </Box>

        <Flex gap={16}>
          <SecondaryBtn
            fullWidth
            text="Cancel"
            action={() => {
              close();
              form.reset();
            }}
            fw={600}
          />
          <PrimaryBtn
            fullWidth
            text="Submit"
            type="submit"
            loading={processing}
            fw={600}
          />
        </Flex>
      </Box>
    </Modal>
  );
};
