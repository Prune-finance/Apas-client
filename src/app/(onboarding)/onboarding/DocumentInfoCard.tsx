import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import { DocumentPreview } from "./DocumentPreview";
import { UseFormReturnType } from "@mantine/form";
import { OnboardingType } from "@/lib/schema";

interface DocumentInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturnType<OnboardingType>;
  active: number;
}

function DocumentInfoCard({ setActive, form, active }: DocumentInfoCard) {
  const { mermat, cacCertificate, amlCompliance, operationalLicense } =
    form.values;
  return (
    <Box p={24} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          Business Document
        </Text>

        <PrimaryBtn
          variant="outline"
          c="#758604"
          text="Edit"
          rightSection={<IconEdit size={18} color="#758604" />}
          fw={600}
          action={() => setActive(2)}
          disabled={active === 7}
        />
      </Flex>

      <Box mt={24}>
        <Flex gap={24} w="100%" mt={16}>
          <DocumentPreview
            label="CAC Certificate"
            title="CAC Certificate"
            value={cacCertificate}
          />
          <DocumentPreview label="Memart" title="Memart" value={mermat} />
        </Flex>
        <Flex gap={24} w="100%" mt={16}>
          <DocumentPreview
            label="AML Compliance Framework"
            title="AML Compliance Framework"
            value={amlCompliance}
          />
          {operationalLicense && (
            <DocumentPreview
              label="Operational License"
              title="Operational License"
              value={operationalLicense}
            />
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default DocumentInfoCard;
