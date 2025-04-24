import { Box, Text } from "@mantine/core";
import DropzoneComponent from "@/ui/components/Dropzone";
import { NewBusinessType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";

interface DocumentBoxProps {
  title: string;
  form?: UseFormReturnType<NewBusinessType>;
  formKey?:
    | "mermat"
    | "cacCertificate"
    | "amlCompliance"
    | "directorParticular"
    | "operationalLicense"
    | "shareholderParticular"
    | "companyPOAUrl";

  uploadedFileUrl?: string;
  required?: boolean;
}

export default function OnBoardingDocumentBox({
  title,
  form,
  formKey,
  uploadedFileUrl,
  required,
}: DocumentBoxProps) {
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
        form={form}
        formKey={formKey}
        uploadedFileUrl={uploadedFileUrl}
      />
      {/* {form.errors[formKey] && (
        <Text fz={12} c="var(--prune-warning)" mt={5}>
          {form.errors[formKey]}
        </Text>
      )} */}
    </Box>
  );
}
