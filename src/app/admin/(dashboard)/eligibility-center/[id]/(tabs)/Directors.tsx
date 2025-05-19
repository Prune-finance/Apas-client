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
import { Director as IDirector } from "@/lib/interface";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
}

export default function Directors({ data, loading, form }: ComponentProps) {
  const [rows, setRows] = useState([]);
  return (
    <PanelWrapper
      loading={loading}
      rows={data?.onboardingStatus === "COMPLETED" ? [1] : []}
      panelName="All Directors"
    >
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
        {data?.directors.map((director, idx) => (
          <Director key={idx} idx={idx + 1} director={director} />
        ))}
      </Stack>
    </PanelWrapper>
  );
}

interface DirectorProps {
  idx: number;
  director: IDirector;
}
const Director = ({ idx, director }: DirectorProps) => {
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
          label="First Name"
          placeholder={director.first_name}
          editing={editing}
        />
        <ProfileTextInput
          label="Last Name"
          placeholder={director.last_name}
          editing={editing}
        />
        <ProfileTextInput
          label="Email"
          placeholder={director.email}
          editing={editing}
        />
        {/* <ProfileTextInput
          label="Phone Number"
          placeholder={director.}
          editing={editing}
        /> */}
        <ProfileDateInput
          label="Date of Birth"
          placeholder={`${dayjs(director.date_of_birth).format("DD-MM-YYYY")}`}
          editing={editing}
          valueFormat="DD-MM-YYYY"
        />
        <DocumentPreview
          label="Identity Document"
          title={director.identityType || ""}
          value={director.identityFileUrl || ""}
        />
        <DocumentPreview
          label="Proof of Address"
          title={director.proofOfAddress || ""}
          value={director.proofOfAddressFileUrl || ""}
        />
      </SimpleGrid>
    </PaperContainer>
  );
};
