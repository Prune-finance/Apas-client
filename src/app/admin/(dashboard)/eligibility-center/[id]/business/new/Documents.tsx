import { Box, Flex, SimpleGrid, Text } from "@mantine/core";

import { UseFormReturnType } from "@mantine/form";
import { NewBusinessType } from "@/lib/schema";
import DropzoneComponent from "@/ui/components/Dropzone";

type Props = {
  form: UseFormReturnType<NewBusinessType>;
};

export default function Documents({ form }: Props) {
  console.log(form.values);
  console.log(form.errors);
  return (
    <Box>
      <Text fz={16} fw={600} c="var(--prune-text-gray-700)">
        Documents:
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt={24} spacing={20}>
        <DocumentBox
          title="Upload Certificate of Incorporation"
          form={form}
          formKey="cacCertificate"
          uploadedFileUrl={form.values.cacCertificate}
          required
        />

        <DocumentBox
          title=" Upload MEMART"
          form={form}
          formKey="mermat"
          uploadedFileUrl={form.values.mermat}
          required
        />

        <DocumentBox
          title="Corporate Proof of Address (Electricity or Water Bill)"
          form={form}
          formKey="companyPOAUrl"
          uploadedFileUrl={form.values.companyPOAUrl}
          required
        />

        <DocumentBox
          title="Shareholders POA (Optional)"
          form={form}
          formKey="shareholderParticular"
          uploadedFileUrl={form.values.shareholderParticular ?? ""}
        />

        <DocumentBox
          title="Directors POA (Optional)"
          form={form}
          formKey="directorParticular"
          uploadedFileUrl={form.values.directorParticular ?? ""}
        />

        <DocumentBox
          title="Operational License (Optional)"
          form={form}
          formKey="operationalLicense"
          uploadedFileUrl={form.values.operationalLicense ?? ""}
        />

        <DocumentBox
          title="AML Compliance Framework (Optional)"
          form={form}
          formKey="amlCompliance"
          uploadedFileUrl={form.values.amlCompliance ?? ""}
        />
      </SimpleGrid>
    </Box>
  );
}

interface DocumentBoxProps {
  title: string;
  form: UseFormReturnType<NewBusinessType>;
  formKey:
    | "mermat"
    | "cacCertificate"
    | "amlCompliance"
    | "directorParticular"
    | "operationalLicense"
    | "shareholderParticular"
    | "companyPOAUrl";

  uploadedFileUrl: string;
  required?: boolean;
}

const DocumentBox = ({
  title,
  form,
  formKey,
  uploadedFileUrl,
  required,
}: DocumentBoxProps) => {
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
      {form.errors[formKey] && (
        <Text fz={12} c="var(--prune-warning)" mt={5}>
          {form.errors[formKey]}
        </Text>
      )}
    </Box>
  );
};
