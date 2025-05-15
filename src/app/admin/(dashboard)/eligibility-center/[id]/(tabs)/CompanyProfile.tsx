import {
  Box,
  Checkbox,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import React, { useState } from "react";
import PaperContainer from "../PaperContainer";
import {
  ProfileDateInput,
  ProfileTextarea,
  ProfileTextInput,
} from "@/ui/components/InputWithLabel";
import { DocumentPreview } from "@/app/(onboarding)/onboarding/DocumentPreview";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { PanelWrapper } from "./utils";
import { IconPencilMinus } from "@tabler/icons-react";
import { serviceCategories } from "@/lib/static";
import GBP from "@/assets/GB.png";
import USD from "@/assets/us.png";
import EUR from "@/assets/EU-icon.png";
import NGN from "@/assets/Nigeria.png";

export default function CompanyProfile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([1]);

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

      <ContactPerson />
      <CeoDetails />

      <Services />
    </PanelWrapper>
  );
}

const ContactPerson = () => {
  const [editing, setEditing] = useState(false);

  const actionNode = (
    <Group gap={10}>
      <SecondaryBtn
        fz={12}
        fw={600}
        text="Edit"
        action={() => setEditing((prev) => !prev)}
        leftSection={<IconPencilMinus size={16} />}
      />
      <PrimaryBtn fw={600} fz={12} text="Send KYC Link" />
    </Group>
  );

  return (
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
  );
};

const CeoDetails = () => {
  const [editing, setEditing] = useState(false);
  const actionNode = (
    <Group gap={10}>
      <SecondaryBtn
        fz={12}
        fw={600}
        text="Edit"
        action={() => setEditing((prev) => !prev)}
        leftSection={<IconPencilMinus size={16} />}
      />
      <PrimaryBtn fw={600} fz={12} text="Send KYC Link" />
    </Group>
  );

  return (
    <PaperContainer title="Ceo details" actionNode={actionNode} mt={20}>
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
        <ProfileDateInput
          label="Date of Birth"
          placeholder={`${dayjs().format("DD-MM-YYYY")}`}
          editing={editing}
          valueFormat="DD-MM-YYYY"
        />
        <DocumentPreview label="Identity Document" title="File.pdf....." />
        <DocumentPreview label="Proof of Address" title="File.pdf....." />
      </SimpleGrid>
    </PaperContainer>
  );
};

const Services = () => {
  return (
    <PaperContainer title="Services" mt={20}>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={24}>
        {serviceCategories.map((service, idx) => (
          <Stack key={idx}>
            <Checkbox
              label={service.title}
              checked
              color="var(--prune-primary-500)"
              iconColor="var(--prune-text-gray-700)"
            />
            <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
              Account Type:
            </Text>

            <Stack>
              {service.accounts.map((currency, idx) => (
                <Group key={idx} gap={8} style={{ opacity: 0.6 }}>
                  <Image
                    src={
                      CurrencyIcon[currency as keyof typeof CurrencyIcon].src
                    }
                    w={16}
                    h={16}
                    alt={currency}
                  />
                  <Text fz={14} fw={500} c="var(--prune-text-gray-500)">
                    {currency}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Stack>
        ))}
      </SimpleGrid>
    </PaperContainer>
  );
};

const CurrencyIcon = {
  GBP,
  USD,
  EUR,
  NGN,
};
