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

export default function Shareholders() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  return (
    <PanelWrapper loading={loading} rows={rows} panelName="All Shareholders">
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
        {Array.from({ length: 4 }).map((_, idx) => (
          <Shareholder key={idx} idx={idx + 1} />
        ))}
      </Stack>
    </PanelWrapper>
  );
}

interface ShareholderProps {
  idx: number;
}
const Shareholder = ({ idx }: ShareholderProps) => {
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
