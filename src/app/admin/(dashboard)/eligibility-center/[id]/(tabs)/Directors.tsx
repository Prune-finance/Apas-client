import React, { useState } from "react";
import { PanelWrapper } from "./utils";
import { Flex, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import PaperContainer from "../PaperContainer";
import {
  ProfileDateInput,
  ProfileTextInput,
} from "@/ui/components/InputWithLabel";
import dayjs from "dayjs";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { OnboardingBusiness } from "@/lib/interface";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
}

export default function Directors({ data, loading, form }: ComponentProps) {
  const [rows, setRows] = useState([]);
  return (
    <PanelWrapper loading={loading} rows={rows} panelName="All Directors">
      <Flex justify="space-between" align="center">
        <Text fw={600} fz={16} c="var(--prune-text-gray-700)">
          All Directors
        </Text>
        <PrimaryBtn
          text="Add Director"
          fw={600}
          fz={12}
          leftSection={<IconPlus size={16} />}
        />
      </Flex>

      <Stack mt={24} gap={24}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <Director key={idx} idx={idx + 1} />
        ))}
      </Stack>
    </PanelWrapper>
  );
}

interface DirectorProps {
  idx: number;
}
const Director = ({ idx }: DirectorProps) => {
  const [editing, setEditing] = useState(false);

  const actionNode = (
    <Group gap={10}>
      <SecondaryBtn
        text="Edit"
        fw={600}
        fz={12}
        leftSection={<IconPencilMinus size={16} />}
        action={() => setEditing((prev) => !prev)}
      />
      <SecondaryBtn
        text="Remove"
        fw={600}
        fz={12}
        leftSection={<IconTrash size={16} />}
      />
    </Group>
  );
  return (
    <PaperContainer title={`Director ${idx}`} actionNode={actionNode}>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <ProfileTextInput
          label="Name"
          placeholder="Moses Simon"
          editing={editing}
        />
        <ProfileTextInput
          label="Email"
          placeholder="moses.simon@1905.com"
          editing={editing}
        />
        <ProfileTextInput
          label="Phone Number"
          placeholder="+234123456789"
          editing={editing}
        />
        <ProfileDateInput
          label="Date of Birth"
          placeholder={`${dayjs().format("DD-MM-YYYY")}`}
          editing={editing}
          valueFormat="DD-MM-YYYY"
        />
        <DocumentPreview label="Identity Document" title="Passport" />
        <DocumentPreview label="Proof of Address" title="Utility Bill" />
      </SimpleGrid>
    </PaperContainer>
  );
};
