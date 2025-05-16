import React, { useState } from "react";
import { PanelWrapper } from "./utils";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import {
  ProfileTextInput,
  ProfileDateInput,
} from "@/ui/components/InputWithLabel";
import { Flex, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import PaperContainer from "../PaperContainer";
import { Director, OnboardingBusiness } from "@/lib/interface";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";

interface ComponentProps {
  data: OnboardingBusiness | null;
  loading: boolean;
  form: UseFormReturnType<OnboardingType>;
}
export default function Shareholders({ data, loading, form }: ComponentProps) {
  return (
    <PanelWrapper
      loading={loading}
      rows={data?.onboardingStatus === "COMPLETED" ? [1] : []}
      panelName="All Shareholders"
    >
      <Flex justify="space-between" align="center">
        <Text fw={600} fz={16} c="var(--prune-text-gray-700)">
          All Shareholders
        </Text>
        <PrimaryBtn
          text="Add Shareholder"
          fw={600}
          fz={12}
          leftSection={<IconPlus size={16} />}
        />
      </Flex>

      <Stack mt={24} gap={24}>
        {data?.shareholders.map((shareholder, idx) => (
          <Shareholder key={idx} idx={idx + 1} shareholder={shareholder} />
        ))}
      </Stack>
    </PanelWrapper>
  );
}

interface ShareholderProps {
  idx: number;
  shareholder: Director;
}
const Shareholder = ({ idx, shareholder }: ShareholderProps) => {
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
    <PaperContainer title={`Shareholder ${idx}`} actionNode={actionNode}>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        <ProfileTextInput
          label="First Name"
          placeholder={shareholder.first_name}
          editing={editing}
        />
        <ProfileTextInput
          label="Last Name"
          placeholder={shareholder.last_name}
          editing={editing}
        />
        <ProfileTextInput
          label="Email"
          placeholder={shareholder.email}
          editing={editing}
        />
        {/* <ProfileTextInput
          label="Phone Number"
          placeholder={"+234123456789"}
          editing={editing}
        /> */}
        <ProfileDateInput
          label="Date of Birth"
          placeholder={`${dayjs(shareholder.date_of_birth).format(
            "DD-MM-YYYY"
          )}`}
          editing={editing}
          valueFormat="DD-MM-YYYY"
        />
        <DocumentPreview
          label="Identity Document"
          title={shareholder.identityType || ""}
          value={shareholder.identityFileUrl || ""}
          editing={editing}
        />
        <DocumentPreview
          label="Proof of Address"
          title={shareholder.proofOfAddress || ""}
          value={shareholder.proofOfAddressFileUrl || ""}
          editing={editing}
        />
      </SimpleGrid>
    </PaperContainer>
  );
};
