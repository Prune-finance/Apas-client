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

interface ReviewInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
}

export const ReviewInfo = ({ setActive, active }: ReviewInfo) => {
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Review
      </Text>

      <TabsComponent tabs={tabs} mt={24}>
        <TabsPanel value={tabs[0]?.value}>
          <BasicInfoCard setActive={setActive} data={basicInfo} />
        </TabsPanel>
        <TabsPanel value={tabs[1]?.value}>
          <CEOInfoCard setActive={setActive} data={ceoInfo} />
        </TabsPanel>
        <TabsPanel value={tabs[2]?.value}>
          <DocumentInfoCard setActive={setActive} data={ceoInfo} />
        </TabsPanel>
        <TabsPanel value={tabs[3]?.value}>
          <DirectorInfoCard setActive={setActive} data={ceoInfo} />
        </TabsPanel>
        <TabsPanel value={tabs[4]?.value}>
          <ShareholderInfoCard setActive={setActive} data={ceoInfo} />
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

const basicInfo = {
  "Business Name": "1905 Logistics",
  "Trading Name": "1905 Logistics",
  "Phone number": "+234123456789",
  Email: "hello@1905logistics.com",
  "Business Type": "Corporate",
  "Business Industry": "Logistics",
  "Business Website (URL)": "https://www.1905logistics.com",
  Country: "Nigeria",
  "Business Address":
    "32 Adetokunbo Ademola Street, Victoria Island, Lagos Nigeria",
  "Business Bio":
    "Sarah Chen, CEO of Quantum Dynamics, is a tech industry veteran who transformed an AI startup into a global market leader. With MIT and Harvard credentials, she drove the company's expansion into 15 markets with double-digit growth.",
};
const ceoInfo = {
  "First name": "Sofia",
  "Last Name": "Martinez",
  "Date of Birth": "19-08-1954",
  Email: "sofiamartinez007@gmail.com",
  "Identity Type": "International Passport",
  "Proof of Address": " Utility Bill",
};

const tabs = [
  {
    value: "Company Profile",
  },
  {
    value: "CEO",
  },
  {
    value: "Document",
  },
  {
    value: "Directors",
  },
  {
    value: "Key Shareholders",
  },
];
