import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import { DocumentPreview } from "./DocumentPreview";
import { camelCaseToTitleCase } from "@/lib/utils";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import dayjs from "dayjs";

interface CEOInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturnType<OnboardingType>;
  active: number;
}

function CEOInfoCard({ setActive, form, active }: CEOInfoCard) {
  const {
    ceoFirstName,
    ceoLastName,
    ceoDOB,
    ceoEmail,
    ceoIdType,
    ceoIdUrl,
    ceoIdUrlBack,
    ceoPOAType,
    ceoPOAUrl,
  } = form.values;

  const ceoInfo = {
    "First name": ceoFirstName,
    "Last Name": ceoLastName,
    "Date of Birth": dayjs(ceoDOB).format("DD-MM-YYYY"),
    Email: ceoEmail,
    "Identity Type": ceoIdType,
    "Proof of Address": ceoPOAType,
  };

  return (
    <Box p={24} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
      <Flex align="center" justify="space-between" w="100%">
        <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
          CEO
        </Text>

        <PrimaryBtn
          variant="outline"
          c="#758604"
          text="Edit"
          rightSection={<IconEdit size={18} color="#758604" />}
          fw={600}
          action={() => setActive(1)}
          disabled={active === 7}
        />
      </Flex>
      <Stack gap={10} mt={20}>
        {Object.entries(ceoInfo).map(([key, value]) => (
          <Group key={key} justify="space-between" align="start">
            <Text c="#667085" fz={12}>
              {key}:
            </Text>
            <Text
              c="#344054"
              ta="right"
              w={244}
              fz={12}
              // miw="100%"
              tt="none"
            >
              {value}
            </Text>
          </Group>
        ))}
      </Stack>

      <Box mt={24}>
        <Text c="var(--prune-text-gray-700)" fz={14} fw={600}>
          Uploaded Documents
        </Text>

        <Flex gap={24} w="100%" mt={16}>
          <DocumentPreview
            label="Identity Document"
            title={ceoIdType || ""}
            value={ceoIdUrl}
          />
          <DocumentPreview
            label="Proof of Address"
            title={ceoPOAType || ""}
            value={ceoPOAUrl}
          />
        </Flex>
      </Box>
    </Box>
  );
}

export default CEOInfoCard;
