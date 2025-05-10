"use client";

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
import Financial from "./(tabs)/Financial";

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
        {[CompanyProfile, Financial, Financial, Financial, Financial].map(
          (Component, idx) => (
            <TabsPanel key={idx} value={tabs[idx].value}>
              <Component />
            </TabsPanel>
          )
        )}
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
