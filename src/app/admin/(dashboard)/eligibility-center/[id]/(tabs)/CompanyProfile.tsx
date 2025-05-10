import { Box, Flex, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { useState } from "react";
import PaperContainer from "../PaperContainer";
import {
  ProfileTextarea,
  ProfileTextInput,
} from "@/ui/components/InputWithLabel";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { PanelWrapper } from "./utils";

export default function CompanyProfile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const actionNode = (
    <Group gap={10}>
      <SecondaryBtn
        fz={12}
        fw={600}
        text="Edit"
        action={() => setEditing(!editing)}
      />
      <PrimaryBtn fw={600} fz={12} text="Send KYC Link" />
    </Group>
  );
  const summaryData = {
    "Application submitted": dayjs().format("DD-MM-YYYY"),
    "Submitted by": "Sarah Samuel",
  };
  return (
    <PanelWrapper loading={loading} rows={rows} panelName="Company Profile">
      <Text tt="uppercase" fz={12} fw={600} c="var(--prune-text-gray-800)">
        Summary
      </Text>
      <Flex gap={16} align="center" mt={12}>
        {Object.entries(summaryData).map(([key, value]) => (
          <Stack key={key} gap={12}>
            <Text fz={12} fw={400} c="var(--prune-text-gray-600)" tt="none">
              {key}
            </Text>
            <Text fz={14} fw={600} c="var(--prune-text-gray-800)">
              {value}
            </Text>
          </Stack>
        ))}
      </Flex>

      <PaperContainer title="Basic information" mt={20}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <ProfileTextInput
            label="Business Name"
            placeholder="1905 Logistics"
            editing
          />
          <ProfileTextInput label="Trading Name" placeholder="1905 Logistics" />
          <ProfileTextInput label="Industry" placeholder="Logistics" />
          <ProfileTextInput label="Country" placeholder="Nigeria" />
          <ProfileTextInput
            label="Address"
            placeholder="32, Ademola Adetokunbo, Victoria..."
          />
          <ProfileTextInput
            label="Email"
            placeholder="1905Logistics@gmail.com"
          />
          <ProfileTextInput label="Phone Number" placeholder="+2348163320000" />
        </SimpleGrid>

        <ProfileTextarea
          mt={24}
          label="Business Description"
          placeholder="Lorem ipsum dolor sit amet consectetur. Purus porta sollicitudin accumsan duis in. Curabitur mus turpis pharetra id. Diam ultrices at vitae pretium. Neque pretium adipiscing diam volutpat feugiat volutpat nulla. Feugiat tellus risus est vel sit sit ut ut. Porta adipiscing consectetur parturient sed a lacinia nec."
        />
      </PaperContainer>

      <PaperContainer
        title="Contact Person Information"
        actionNode={actionNode}
        mt={20}
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <ProfileTextInput
            label="First Name"
            placeholder="Tobi"
            editing={editing}
          />
          <ProfileTextInput
            label="Last Name"
            placeholder="Khalid"
            editing={editing}
          />
          <ProfileTextInput
            label="Email"
            placeholder="1905Logistics@gmail.com"
            editing={editing}
          />
          <ProfileTextInput
            label="Phone Number"
            placeholder="+2348163320000"
            editing={editing}
          />
          <DocumentPreview label="Identity Document" title="File.pdf....." />
          <DocumentPreview label="Proof of Address" title="File.pdf....." />
        </SimpleGrid>
      </PaperContainer>
    </PanelWrapper>
  );
}
