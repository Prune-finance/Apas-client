import { Box, Text } from "@mantine/core";
import DropzoneComponent from "@/ui/components/Dropzone";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import createAxiosInstance from "@/lib/axios";

const questAxios = createAxiosInstance("questionnaire");

interface DocumentBoxProps<T = OnboardingType> {
  title: string;
  form?: UseFormReturnType<T>;
  formKey?: string;
  uploadedFileUrl?: string;
  required?: boolean;
  isAdmin?: boolean;
  /** When set, uploads via questionnaire /business/onboarding/files with this kind */
  kind?: string;
  /** When set alongside kind, uses the admin upload endpoint */
  adminReference?: string;
}

export default function OnBoardingDocumentBox<T>({
  title,
  form,
  formKey,
  uploadedFileUrl,
  required,
  isAdmin = false,
  kind,
  adminReference,
}: DocumentBoxProps<T>) {
  const [displayUrl, setDisplayUrl] = useState(uploadedFileUrl || "");

  useEffect(() => {
    const val = uploadedFileUrl || "";
    // If val is a file ID (UUID, not an http URL), fetch the pre-signed view URL
    if (val && !val.startsWith("http") && kind) {
      const viewPath = isAdmin
        ? `/business/onboarding/admin/files/${val}`
        : `/business/onboarding/files/${val}`;
      questAxios
        .get(viewPath)
        .then((res) => setDisplayUrl(res.data.data.url))
        .catch(() => setDisplayUrl(""));
    } else {
      setDisplayUrl(val);
    }
  }, [uploadedFileUrl, kind, isAdmin]);

  return (
    <Box flex={1}>
      <Text fz={12} c="#344054" mb={10} inline>
        {title}
        {required && (
          <Text span c="var(--prune-warning)">
            *
          </Text>
        )}
      </Text>
      <DropzoneComponent
        otherForm={form}
        formKey={formKey}
        uploadedFileUrl={displayUrl}
        isOnboarding={!isAdmin && !kind}
        questionnaireKind={kind}
        questionnaireAdminReference={adminReference || (isAdmin && kind ? "admin" : undefined)}
      />
      {form?.errors[formKey || "cacCertificate"] && (
        <Text fz={12} c="var(--prune-warning)" mt={5}>
          {form.errors[formKey || "cacCertificate"]}
        </Text>
      )}
    </Box>
  );
}
