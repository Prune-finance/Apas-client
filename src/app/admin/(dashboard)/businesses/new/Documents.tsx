import form from "@/app/auth/[id]/register/form";
import { Box, Flex, Text } from "@mantine/core";

import { UseFormReturnType } from "@mantine/form";
import { NewBusinessType } from "@/lib/schema";
import DropzoneComponent from "@/ui/components/Dropzone";

type Props = {
  form: UseFormReturnType<NewBusinessType>;
};

export default function Documents({ form }: Props) {
  return (
    <Box>
      <Text fz={16} fw={600} c="var(--prune-text-gray-700)">
        Documents:
      </Text>

      <Flex mt={24} gap={20}>
        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10} inline>
            Upload CAC Certificate
            <Text span c="var(--prune-warning)">
              *
            </Text>
          </Text>
          <DropzoneComponent
            form={form}
            formKey="cacCertificate"
            uploadedFileUrl={form.values.cacCertificate}
          />
        </Box>

        <Box flex={1}>
          <Text fz={12} c="#344054" inline mb={10}>
            Upload MEMART
            <Text span c="var(--prune-warning)">
              *
            </Text>
          </Text>
          <DropzoneComponent
            form={form}
            formKey="mermat"
            uploadedFileUrl={form.values.mermat}
          />
        </Box>

        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10} inline>
            POS(Particulars of Shareholders)
            <Text span c="var(--prune-warning)">
              *
            </Text>
          </Text>
          <DropzoneComponent
            form={form}
            formKey="shareholderParticular"
            uploadedFileUrl={form.values.shareholderParticular}
          />
        </Box>
      </Flex>

      <Flex mt={24} gap={20}>
        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10} inline>
            POS(Particulars of Directors)
            <Text span c="var(--prune-warning)">
              *
            </Text>
          </Text>
          <DropzoneComponent
            form={form}
            formKey="directorParticular"
            uploadedFileUrl={form.values.directorParticular}
          />
        </Box>

        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10}>
            Operational License( Optional )
          </Text>
          <DropzoneComponent
            form={form}
            formKey="operationalLicense"
            uploadedFileUrl={form.values.operationalLicense ?? ""}
          />
        </Box>

        <Box flex={1}>
          <Text fz={12} c="#344054" mb={10}>
            AML Compliance Framework( Optional )
          </Text>
          <DropzoneComponent
            form={form}
            formKey="amlCompliance"
            uploadedFileUrl={form.values.amlCompliance ?? ""}
          />
        </Box>
      </Flex>

      {/* <Flex mt={24} gap={20}>
            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                CAC Certificate
              </Text>
              <DropzoneComponent />
            </Box>

            <Box flex={1}>
              <Text fz={12} c="#344054" mb={10}>
                Mermat
              </Text>
              <DropzoneComponent />
            </Box>
          </Flex> */}
    </Box>
  );
}
