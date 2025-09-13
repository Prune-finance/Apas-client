"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { Box, TabsPanel, Text } from "@mantine/core";
import React, { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import { newOnboardingValue, OnboardingType, Tab } from "@/lib/schema/";
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
import { useForm } from "@mantine/form";

export default function OnboardingProfile({
  params,
}: {
  params: { id: string };
}) {
  const { data, loading, revalidate } = useSingleOnboardingBusiness(params.id);

  const initialValues: OnboardingType = {
    businessName: data?.businessName || "",
    businessCountry: data?.businessCountry || null,
    businessType: data?.businessType || null,
    businessIndustry: data?.businessIndustry || null,
    businessPhoneNumber: data?.businessPhoneNumber || "",
    businessPhoneNumberCode: "",
    businessTradingName: data?.businessTradingName || "",
    businessAddress: data?.businessAddress || "",
    businessEmail: data?.businessEmail || "",
    businessDescription: data?.businessDescription || "",
    businessWebsite: data?.businessWebsite || "",
    makeContactPersonInitiator: data?.makeContactPersonInitiator || false,
    ceoIdType: data?.ceoIdType || "",
    ceoIdUrl: data?.ceoIdUrl || "",
    ceoIdUrlBack: data?.ceoIdUrlBack || "",
    ceoPOAType: data?.ceoPOAType || "",
    ceoPOAUrl: data?.ceoPOAUrl || "",
    ceoDOB: data?.ceoDOB ? new Date(data.ceoDOB) : null,
    contactPersonIdType: data?.contactPersonIdType || "",
    contactPersonPOAType: data?.contactPersonPOAType || "",
    contactPersonIdUrl: data?.contactPersonIdUrl || "",
    contactPersonIdUrlBack: data?.contactPersonIdUrlBack || "",
    contactPersonPOAUrl: data?.contactPersonPOAUrl || "",
    contactPersonPhoneNumber: data?.contactPersonPhoneNumber || "",
    contactPersonPhoneNumberCode: "",
    amlCompliance: data?.amlCompliance || "",
    operationalLicense: data?.operationalLicense || "",
    cacCertificate: data?.cacCertificate || "",
    mermat: data?.mermat || "",
    ceoFirstName: data?.ceoFirstName || "",
    ceoLastName: data?.ceoLastName || "",
    ceoEmail: data?.ceoEmail || "",
    contactPersonFirstName: data?.contactPersonFirstName || "",
    contactPersonLastName: data?.contactPersonLastName || "",
    contactPersonEmail: data?.contactPersonEmail || "",
    directors:
      data?.directors.map((director) => ({
        ...director,
        date_of_birth: director.date_of_birth
          ? new Date(director.date_of_birth)
          : null,
      })) || [],
    shareholders:
      data?.shareholders.map((shareholder) => ({
        ...shareholder,
        date_of_birth: shareholder.date_of_birth
          ? new Date(shareholder.date_of_birth)
          : null,
      })) || [],
  };

  const form = useForm<OnboardingType>({
    initialValues: newOnboardingValue,
  });

  useEffect(() => {
    form.setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      <ProfileHeader data={data} loading={loading} revalidate={revalidate} />
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
              <Component
                data={data}
                loading={loading}
                form={form}
                revalidate={revalidate}
              />
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
