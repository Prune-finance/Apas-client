import { Box, Flex, Group, Stack, TabsPanel, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { IconEdit } from "@tabler/icons-react";
import TabsComponent from "@/ui/components/Tabs";
import BasicInfoCard from "./BasicInfoCard";
import CEOInfoCard from "./CeoInfoCard";
import DocumentInfoCard from "./DocumentInfoCard";
import DirectorInfoCard from "./DirectorInfoCard";
import ShareholderInfoCard from "./ShareholderInfoCard";
import { FiFileText, FiUser, FiUsers } from "react-icons/fi";
import { TbBuilding } from "react-icons/tb";
import { OnboardingType } from "@/lib/schema";
import { UseFormReturnType } from "@mantine/form";
import dayjs from "dayjs";

interface ReviewInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
  form: UseFormReturnType<OnboardingType>;
}

export const ReviewInfo = ({ setActive, active, form }: ReviewInfo) => {
  const {
    directors,
    shareholders,
    name,
    tradingName,
    contactNumber,
    address,
    amlCompliance,
    businessBio,
    businessIndustry,
    businessNumber,
    cacCertificate,
    ceoDOB,
    ceoEmail,
    ceoFirstName,
    ceoIdType,
    ceoIdUrl,
    ceoIdUrlBack,
    ceoLastName,
    ceoPOAType,
    ceoPOAUrl,
    contactCountryCode,
    contactEmail,
    contactFirstName,
    contactIdType,
    contactIdUrl,
    contactIdUrlBack,
    contactLastName,
    contactPOAType,
    contactPOAUrl,
    country,
    domain,
    legalEntity,
    mermat,
    operationalLicense,
  } = form.getValues();

  const basicInfo = {
    "Business Name": name,
    "Trading Name": tradingName,
    "Phone number": businessNumber,
    Email: contactEmail,
    "Business Type": legalEntity,
    "Business Industry": businessIndustry,
    "Business Website (URL)": domain,
    Country: country,
    "Business Address": address,
    "Business Bio": businessBio,
  };
  const ceoInfo = {
    "First name": ceoFirstName,
    "Last Name": ceoLastName,
    "Date of Birth": dayjs(ceoDOB).format("DD-MM-YYYY"),
    Email: ceoEmail,
    "Identity Type": ceoIdType,
    "Proof of Address": ceoPOAType,
  };
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Review
      </Text>

      <TabsComponent tabs={tabs} mt={24} tt="capitalize">
        <TabsPanel value={tabs[0]?.value}>
          <BasicInfoCard setActive={setActive} data={basicInfo} />
        </TabsPanel>
        <TabsPanel value={tabs[1]?.value}>
          <CEOInfoCard setActive={setActive} data={ceoInfo} />
        </TabsPanel>
        <TabsPanel value={tabs[2]?.value}>
          <DocumentInfoCard setActive={setActive} form={form} />
        </TabsPanel>
        <TabsPanel value={tabs[3]?.value}>
          <DirectorInfoCard setActive={setActive} form={form} />
        </TabsPanel>
        <TabsPanel value={tabs[4]?.value}>
          <ShareholderInfoCard setActive={setActive} form={form} />
        </TabsPanel>
      </TabsComponent>

      <Flex align="center" justify="flex-end" w="100%" mt={20}>
        <Flex align="center" justify="center" gap={20}>
          <SecondaryBtn
            text="Previous"
            fw={600}
            action={() => setActive(active - 1)}
            disabled={active === 0}
          />
          <PrimaryBtn
            text="Next"
            w={126}
            fw={600}
            action={() => setActive(active + 1)}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

const tabs = [
  {
    value: "Company Profile",
    icon: <TbBuilding size={16} />,
  },
  {
    value: "CEO",
    icon: <FiUser size={16} />,
  },
  {
    value: "Document",
    icon: <FiFileText size={16} />,
  },
  {
    value: "Directors",
    icon: <FiUsers size={16} />,
  },
  {
    value: "Key Shareholders",
    icon: <FiUsers size={16} />,
  },
];
