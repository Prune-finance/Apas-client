import { OnboardingType } from "@/lib/schema";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Stack, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import React from "react";

interface BasicInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturnType<OnboardingType>;
}

function BasicInfoCard({ setActive, form }: BasicInfoCard) {
  const {
    businessName,
    businessType,
    businessAddress,
    businessCountry,
    businessDescription,
    businessEmail,
    businessIndustry,
    businessPhoneNumber,
    businessWebsite,
    businessTradingName,
  } = form.values;

  const basicInfo = {
    "Business Name": businessName,
    "Trading Name": businessTradingName,
    "Phone number": businessPhoneNumber,
    Email: businessEmail,
    "Business Type": businessType,
    "Business Industry": businessIndustry,
    "Business Website (Optional)": businessWebsite,
    Country: businessCountry,
    "Business Address": businessAddress,
    "Business Bio": businessDescription,
  };
  return (
    <Box p={24} bg="#F2F4F7" mt={24} style={{ borderRadius: 8 }}>
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
          <Flex key={key} justify="space-between" align="flex-start" gap={12}>
            <Text c="#667085" fz={12} style={{ flexShrink: 0 }}>
              {key}:
            </Text>
            <Text
              c="#344054"
              ta="right"
              fz={12}
              tt="none"
              style={{ flex: 1, wordBreak: "break-word", overflowWrap: "anywhere", minWidth: 0 }}
            >
              {value}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

export default BasicInfoCard;
