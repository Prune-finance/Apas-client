import { Box, Text } from "@mantine/core";
import DropzoneComponent from "@/ui/components/Dropzone";
import { OnboardingType } from "@/lib/schema/onboarding";

import { UseFormReturnType } from "@mantine/form";

interface DocumentBoxProps<T = OnboardingType> {
  title: string;
  form?: UseFormReturnType<T>;
  // formKey?:
  //   | "mermat"
  //   | "cacCertificate"
  //   | "amlCompliance"
  //   | "contactIdUrl"
  //   | "contactIdUrlBack"
  //   | "contactPOAUrl"
  //   | "operationalLicense";
  // formKey?: keyof OnboardingType
  formKey?: string;
  uploadedFileUrl?: string;
  required?: boolean;
  isAdmin?: boolean;
}

export default function OnBoardingDocumentBox<T>({
  title,
  form,
  formKey,
  uploadedFileUrl,
  required,
  isAdmin = false,
}: DocumentBoxProps<T>) {
  return (
    <Box flex={1}>
      {/* <Text fz={12} c="#344054" mb={10}>
        {title}
      </Text> */}

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
        uploadedFileUrl={uploadedFileUrl}
        isOnboarding={!isAdmin}
      />
      {form?.errors[formKey || "cacCertificate"] && (
        <Text fz={12} c="var(--prune-warning)" mt={5}>
          {form.errors[formKey || "cacCertificate"]}
        </Text>
      )}
    </Box>
  );
}
