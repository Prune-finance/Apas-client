import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { Box, TabsPanel, Text } from "@mantine/core";
import React from "react";
import ProfileHeader from "./ProfileHeader";
import { Tab } from "@/lib/schema";
import {
  IconBuildingSkyscraper,
  IconCoins,
  IconFileText,
  IconUsers,
} from "@tabler/icons-react";
import Tabs from "@/ui/components/Tabs";
import CompanyProfile from "./(tabs)/CompanyProfile";

export default function OnboardingProfile() {
  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: "Eligibility Center", href: "/admin/eligibility-center" },
          {
            title: "1905 Logistics",
            href: "/admin/eligibility-center/1",
            loading: false,
          },
        ]}
      />
      <ProfileHeader />
      <Tabs
        tabs={tabs}
        tt="capitalize"
        fz={12}
        fw={500}
        styles={{
          list: { marginBottom: "24px" },
        }}
      >
        {[1, 2, 3, 4, 5].map((tab, idx) => (
          <TabsPanel key={tab} value={tabs[idx].value}>
            <CompanyProfile />
          </TabsPanel>
        ))}
      </Tabs>
    </Box>
  );
}

const tabs: Tab[] = [
  {
    title: "Company Profile",
    value: "company-profile",
    icon: <IconBuildingSkyscraper size={16} />,
  },
  {
    title: "Financials",
    value: "financials",
    icon: <IconCoins size={16} />,
  },
  {
    title: "Documents",
    value: "documents",
    icon: <IconFileText size={16} />,
  },
  {
    title: "Directors",
    value: "directors",
    icon: <IconUsers size={16} />,
  },
  {
    title: "Key Shareholders",
    value: "shareholders",
    icon: <IconUsers size={16} />,
  },
];
