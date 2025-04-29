import {
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";

interface DocumentInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
}

export const DocumentInfo = ({ setActive, active, form }: DocumentInfo) => {
  console.log(form.errors);
  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(() => {
        setActive(active + 1);
      })}
    >
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Documents
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox
            title="CAC Certificate"
            required
            formKey="cacCertificate"
            form={form}
            uploadedFileUrl={form.getValues().cacCertificate}
            {...form.getInputProps("cacCertificate")}
          />
          <OnBoardingDocumentBox
            title="Memart"
            required
            formKey="mermat"
            form={form}
            uploadedFileUrl={form.getValues().mermat}
            {...form.getInputProps("mermat")}
          />
        </Flex>

        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox
            title="AML Compliance Framework"
            required
            formKey="amlCompliance"
            form={form}
            uploadedFileUrl={form.getValues().amlCompliance || ""}
            {...form.getInputProps("amlCompliance")}
          />
          <OnBoardingDocumentBox
            title="Operational License (Optional)"
            formKey="operationalLicense"
            form={form}
            uploadedFileUrl={form.getValues().operationalLicense || ""}
            {...form.getInputProps("operationalLicense")}
          />
        </Flex>
      </Stack>

      <Flex align="center" justify="space-between" w="100%" mt={20}>
        <SecondaryBtn text="Clear Form" fw={600} />

        <Flex align="center" justify="center" gap={20}>
          <SecondaryBtn
            text="Previous"
            fw={600}
            action={() => setActive(active - 1)}
            disabled={active === 0}
          />
          <PrimaryBtn text="Next" w={126} fw={600} type="submit" />
        </Flex>
      </Flex>
    </Box>
  );
};
