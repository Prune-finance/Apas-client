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
import Documents from "./(tabs)/Documents";
import Directors from "./(tabs)/Directors";
import Shareholders from "./(tabs)/Shareholders";
import { useSingleOnboardingBusiness } from "@/lib/hooks/eligibility-center";

export default function OnboardingProfile({
  params,
}: {
  params: { id: string };
}) {
  const { data, loading, revalidate } = useSingleOnboardingBusiness(params.id);
  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: "Eligibility Center", href: "/admin/eligibility-center" },
          {
            title: data?.businessName || "",
            href: `/admin/eligibility-center/${data?.id}`,
            loading: loading,
          },
        ]}
      />
      <ProfileHeader data={data} loading={loading} />
      <Tabs
        tabs={tabs}
        tt="capitalize"
        fz={12}
        fw={500}
        styles={{
          list: { marginBottom: "24px" },
        }}
      >
        {[CompanyProfile, Financial, Documents, Directors, Shareholders].map(
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
