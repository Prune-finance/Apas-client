import { OnboardingType } from "@/lib/schema";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import React from "react";

interface BasicInfoCard {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturnType<OnboardingType>;
  active: number;
}

function BasicInfoCard({ setActive, form, active }: BasicInfoCard) {
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
    "Business Website (URL)": businessWebsite,
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
          disabled={active === 7}
        />
      </Flex>
      <Stack gap={10} mt={20}>
        {Object.entries(basicInfo).map(([key, value]) => (
          <Group key={key} justify="space-between" align="start">
            <Text c="#667085" fz={12}>
              {key}:
            </Text>
            <Text
              c="#344054"
              ta="right"
              w={244}
              fz={12}
              tt="none"
              // miw="100%"
            >
              {value}
            </Text>
          </Group>
        ))}
      </Stack>
    </Box>
  );
}

export default BasicInfoCard;
