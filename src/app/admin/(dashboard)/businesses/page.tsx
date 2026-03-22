import { Tab } from "@/lib/schema";
import TabsComponent from "@/ui/components/Tabs";
import { Box, TabsPanel, Title } from "@mantine/core";
import { Suspense } from "react";
import OnboardedBusinesses from "./(tabs)/Onboarded";
import OnboardingBusinesses from "./(tabs)/Onboarding";
import ApiActiveBusinesses from "./(tabs)/ApiActive";
import AccountActiveBusinesses from "./(tabs)/AccountActive";

function Businesses() {
  return (
    <Box px={20}>
      <Title order={2}>Businesses</Title>

      <TabsComponent tabs={tabs} mt={32}>
        {[OnboardedBusinesses, OnboardingBusinesses, ApiActiveBusinesses, AccountActiveBusinesses].map((Component, index) => (
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
  { title: "Onboarded Businesses", value: "onboarded" },
  { title: "Onboarding Businesses", value: "onboarding" },
  { title: "API Active Businesses", value: "api" },
  { title: "Account Active Businesses", value: "account" },
];
