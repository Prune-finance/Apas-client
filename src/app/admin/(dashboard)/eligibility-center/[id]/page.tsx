"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { Box, TabsPanel, Text } from "@mantine/core";
import React, { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import { newOnboardingValue, OnboardingType, Tab } from "@/lib/schema";
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
import {
  useSingleQuestionnaire,
  QuestionnaireDetail,
} from "@/lib/hooks/eligibility-center";
import { OnboardingBusiness } from "@/lib/interface";
import { useForm } from "@mantine/form";

function adaptQuestionnaire(data: QuestionnaireDetail | null): OnboardingBusiness | null {
  if (!data) return null;
  const a = data.answers;
  const nameParts = (a.contactName ?? "").split(" ");
  const va = a.virtualAccounts;
  return {
    id: data.reference,
    businessName: a.legalBusinessName ?? null,
    businessTradingName: a.tradingName ?? null,
    businessType: null,
    businessIndustry: a.businessIndustry ?? null,
    businessCountry: a.countryCode ?? null,
    businessAddress: a.businessAddress ?? null,
    businessEmail: a.businessEmail ?? "",
    businessPhoneNumber: a.phoneNumber ?? null,
    businessWebsite: null,
    businessDescription: a.businessDescription ?? null,
    contactPersonFirstName: nameParts[0] ?? null,
    contactPersonLastName: nameParts.slice(1).join(" ") || null,
    contactPersonEmail: a.contactEmail ?? null,
    contactPersonPhoneNumber: a.contactPhoneNumber ?? null,
    contactPersonPOAType: null,
    contactPersonPOAUrl: null,
    contactPersonIdType: null,
    contactPersonIdUrl: null,
    contactPersonIdUrlBack: null,
    makeContactPersonInitiator: false,
    cacCertificate: null,
    mermat: null,
    amlCompliance: null,
    operationalLicense: null,
    ceoFirstName: null,
    ceoLastName: null,
    ceoEmail: null,
    ceoDOB: null,
    ceoPOAType: null,
    ceoPOAUrl: null,
    ceoIdType: null,
    ceoIdUrl: null,
    ceoIdUrlBack: null,
    directors: [],
    shareholders: [],
    createdAt: new Date(data.createdAt),
    password: "",
    updatedAt: new Date(data.createdAt),
    migrated: false,
    questionnaireId: data.reference,
    stageIdentifier: 0,
    geoFootprint: a.geographicFootprint ?? "",
    questionnaireSentAt: null,
    consentDesignation: "",
    consentEmail: "",
    consentSignature: "",
    consentSignedBy: "",
    consentPhoneNumber: "",
    documentData: {},
    documents: [],
    onboardingStatus: "PENDING",
    questionnaireStatus: data.status as OnboardingBusiness["questionnaireStatus"],
    decision: data.decision,
    processStatus: "In Progress",
    hasActualBusinessAccount: false,
    token: "",
    status: "In Progress",
    annualTurnover: a.annualTurnover ?? null,
    services: (a.services ?? []).map((s) => ({
      name: s.service,
      currencies: s.currencies,
    })),
    virtualAccounts: {
      day_one_requirement: va?.dayOneAccounts ?? 0,
      total_number_of_virtual_accounts: va?.fullCapacityAccounts ?? 0,
      max_value_per_transaction: {
        daily: Number(va?.singleAccountMaxDaily ?? 0),
        monthly: Number(va?.singleAccountMaxMonthly ?? 0),
        annually: Number(va?.singleAccountMaxAnnually ?? 0),
      },
      max_value_all_virtual_accounts: {
        daily: Number(va?.allAccountsMaxDaily ?? 0),
        monthly: Number(va?.allAccountsMaxMonthly ?? 0),
        annually: Number(va?.allAccountsMaxAnnually ?? 0),
      },
      total_highest_transaction_count: {
        daily: va?.highestTransactionCount ?? 0,
        monthly: 0,
        annually: 0,
      },
    },
    operationsAccounts: {
      estimated_balance: a.operationsBalance ?? "",
    },
  };
}

export default function OnboardingProfile({
  params,
}: {
  params: { id: string };
}) {
  const { data, loading, revalidate } = useSingleQuestionnaire(params.id);

  const adapted = adaptQuestionnaire(data);

  const initialValues: OnboardingType = {
    businessName: adapted?.businessName || "",
    businessCountry: adapted?.businessCountry || null,
    businessType: adapted?.businessType || null,
    businessIndustry: adapted?.businessIndustry || null,
    businessPhoneNumber: adapted?.businessPhoneNumber || "",
    businessPhoneNumberCode: "",
    businessTradingName: adapted?.businessTradingName || "",
    businessAddress: adapted?.businessAddress || "",
    businessEmail: adapted?.businessEmail || "",
    businessDescription: adapted?.businessDescription || "",
    businessWebsite: adapted?.businessWebsite || "",
    makeContactPersonInitiator: adapted?.makeContactPersonInitiator || false,
    ceoIdType: "",
    ceoIdUrl: "",
    ceoIdUrlBack: "",
    ceoPOAType: "",
    ceoPOAUrl: "",
    ceoDOB: null,
    contactPersonIdType: "",
    contactPersonPOAType: "",
    contactPersonIdUrl: "",
    contactPersonIdUrlBack: "",
    contactPersonPOAUrl: "",
    contactPersonPhoneNumber: adapted?.contactPersonPhoneNumber || "",
    contactPersonPhoneNumberCode: "",
    amlCompliance: "",
    operationalLicense: "",
    cacCertificate: "",
    mermat: "",
    ceoFirstName: "",
    ceoLastName: "",
    ceoEmail: "",
    contactPersonFirstName: adapted?.contactPersonFirstName || "",
    contactPersonLastName: adapted?.contactPersonLastName || "",
    contactPersonEmail: adapted?.contactPersonEmail || "",
    directors: [],
    shareholders: [],
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
            title: adapted?.businessName || "",
            href: `/admin/eligibility-center/${params.id}`,
            loading: loading,
          },
        ]}
      />
      <ProfileHeader data={adapted} loading={loading} revalidate={revalidate} />
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
                data={adapted}
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
