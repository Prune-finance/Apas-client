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
  title?: string;
}

export const ReviewInfo = ({ setActive, active, form, title }: ReviewInfo) => {
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        {title || "Review"}
      </Text>

      <TabsComponent tabs={tabs} mt={24} tt="capitalize">
        {[
          BasicInfoCard,
          CEOInfoCard,
          DocumentInfoCard,
          DirectorInfoCard,
          ShareholderInfoCard,
        ].map((Component, index) => (
          <TabsPanel value={tabs[index]?.value} key={index}>
            <Component setActive={setActive} form={form} />
          </TabsPanel>
        ))}
      </TabsComponent>

      {active === 5 && (
        <Flex align="center" justify="flex-end" w="100%" mt={20}>
          <Flex align="center" justify="center" gap={20}>
            <SecondaryBtn
              text="Previous"
              fw={600}
              action={() => setActive(active - 1)}
            />
            <PrimaryBtn
              text="Next"
              w={126}
              fw={600}
              action={() => setActive(active + 1)}
            />
          </Flex>
        </Flex>
      )}
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
