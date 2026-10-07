"use client";

import { Tab } from "@/lib/schema";
import TabsComponent from "@/ui/components/Tabs";
import { Box, Flex, Text, TabsPanel, Title } from "@mantine/core";
import { Suspense } from "react";
import OnboardedBusinesses from "./(tabs)/Onboarded";
import OnboardingBusinesses from "./(tabs)/Onboarding";
import ApiActiveBusinesses from "./(tabs)/ApiActive";
import AccountActiveBusinesses from "./(tabs)/AccountActive";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

function Businesses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "onboarded";

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    router.push(`/admin/businesses?tab=${value}`);
  };

  return (
    <Box px={20}>
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Title order={2} fw={700}>Businesses</Title>
          <Text fz={14} c="var(--prune-text-gray-500)" mt={4}>
            View and manage all businesses on the platform.
          </Text>
        </Box>
        <PrimaryBtn
          text="New Business"
          link="/admin/businesses/new"
          leftSection={<IconPlus size={16} />}
          fw={600}
          fz={14}
        />
      </Flex>

      <TabsComponent
        tabs={tabs}
        mt={32}
        value={currentTab}
        onChange={handleTabChange}
      >
        {[
          OnboardedBusinesses,
          OnboardingBusinesses,
          ApiActiveBusinesses,
          AccountActiveBusinesses,
        ].map((Component, index) => (
          <TabsPanel value={tabs[index].value} key={index}>
            <Component />
          </TabsPanel>
        ))}
      </TabsComponent>
    </Box>
  );
}

export default function BusinessesSuspense() {
  return (
    <Suspense>
      <Businesses />
    </Suspense>
  );
}

const tabs: Tab[] = [
  { title: "Onboarded", value: "onboarded" },
  { title: "Onboarding", value: "onboarding" },
  { title: "API Active", value: "api" },
  { title: "Account Active", value: "account" },
];
