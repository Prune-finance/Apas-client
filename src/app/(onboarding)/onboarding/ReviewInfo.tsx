import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { IconEdit } from "@tabler/icons-react";

interface ReviewInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
}

export const ReviewInfo = ({ setActive, active }: ReviewInfo) => {
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

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Review
      </Text>

      <Box p={16} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
        <Flex align="center" justify="space-between" w="100%">
          <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
            Basic Information
          </Text>

          <PrimaryBtn
            variant="outline"
            c="#758604"
            text="Edit"
            rightSection={<IconEdit size={18} color="#758604" />}
            fw={600}
            action={() => setActive(0)}
          />
        </Flex>
        <Stack gap={10} mt={20}>
          {Object.entries(basicInfo).map(([key, value]) => (
            <Group key={key} justify="space-between" align="start">
              <Text c="var(--prune-text-gray-700)" fz={12}>
                {key}:
              </Text>
              <Text
                c="var(--prune-text-gray-500)"
                ta="left"
                w={244}
                fz={12}
                // miw="100%"
              >
                {value}
              </Text>
            </Group>
          ))}
        </Stack>
      </Box>

      <Flex align="center" justify="space-between" w="100%" mt={20}>
        <SecondaryBtn text="Clear Form" fw={600} />

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
