import { Tab } from "@/lib/schema/";
import TabsComponent from "@/ui/components/Tabs";
import { Box, TabsPanel, Title } from "@mantine/core";
import { Suspense } from "react";
import OnboardedBusinesses from "./(tabs)/Onboarded";
import OnboardingBusinesses from "./(tabs)/Onboarding";

function Businesses() {
  return (
    <Box px={20}>
      <Title order={2}>Businesses</Title>

      <TabsComponent tabs={tabs} mt={32}>
        {[OnboardedBusinesses, OnboardingBusinesses].map((Component, index) => (
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
  { title: "Onboarded Business", value: "onboarded" },
  { title: "Onboarding Businesses", value: "onboarding" },
];
