"use client";

import { Alert, Box, Flex, Loader, Text, ThemeIcon, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { CustomPaper } from "../CustomPaper";
import Navbar from "../Navbar";
import {
  BusinessInfo,
  CEOInfo,
  DocumentInfo,
  AddDirectorsInfo,
  AddShareholdersInfo,
  TermsOfUseInfo,
  ReferenceData,
  DEFAULT_REF_DATA,
} from "@/ui/section/onboarding/shared";
import { ReviewInfo } from "./ReviewInfo";
import { useForm, zodResolver } from "@mantine/form";
import {
  CEOSchema,
  newOnboardingValue,
  onboardingBasicInfoSchema,
  onboardingDirectors,
  OnboardingDirectorValues,
  onboardingDocumentSchema,
  onboardingShareholders,
  OnboardingType,
} from "@/lib/schema";
import OnboardingStore from "@/lib/store/onboarding";
import useAxios from "@/lib/hooks/useAxios";
import countries from "@/assets/countries.json";


interface OnboardingProfile {
  reference: string;
  email: string;
  status: string;
  submittedAt: string | null;
  progress: {
    lastCompletedSection: number;
    nextSection: number;
    isComplete: boolean;
    sections: { number: number; title: string; completed: boolean }[];
  };
  business: {
    businessName: string;
    tradingName: string;
    businessType: string | null;
    businessIndustry: string;
    countryCode: string;
    businessAddress: string;
    businessEmail: string;
    businessPhoneCountryCode: string;
    businessPhoneNumber: string;
    businessWebsite: string | null;
    businessDescription: string;
    contactIsInitiator: boolean;
  };
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    identityType: string | null;
    proofOfAddressType: string | null;
    identityDocument: { id: string; kind: string; fileName: string } | null;
    proofOfAddressDocument: { id: string; kind: string; fileName: string } | null;
  };
  ceo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    dateOfBirth: string | null;
    identityType: string | null;
    proofOfAddressType: string | null;
    identityDocument: { id: string; kind: string; fileName: string } | null;
    identityDocumentBack: { id: string; kind: string; fileName: string } | null;
    proofOfAddressDocument: { id: string; kind: string; fileName: string } | null;
  } | null;
  documents: {
    incorporationCertificate: { id: string; kind: string; fileName: string } | null;
    memart: { id: string; kind: string; fileName: string } | null;
    amlFramework: { id: string; kind: string; fileName: string } | null;
    operationalLicence: { id: string; kind: string; fileName: string } | null;
  };
  directors: any[];
  shareholders: any[];
  consent: any | null;
  documentReview: {
    state: string;
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  } | null;
}
import { IconExclamationMark, IconClockHour3 } from "@tabler/icons-react";

export default function Onboarding() {
  const [active, setActive] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [directors, setDirectors] = useState<OnboardingType["directors"]>();
  const [shareholders, setShareholders] =
    useState<OnboardingType["shareholders"]>();
  const { setBusiness, setData } = OnboardingStore();
  const [refData, setRefData] = useState<ReferenceData>(DEFAULT_REF_DATA);

  const form = useForm<OnboardingType>({
    mode: "controlled",
    initialValues: newOnboardingValue,
    validate: (values) => {
      if (active === 0) return zodResolver(onboardingBasicInfoSchema)(values);
      if (active === 1) return zodResolver(CEOSchema)(values);
      if (active === 2) return zodResolver(onboardingDocumentSchema)(values);
      if (active === 3) return zodResolver(onboardingDirectors)(values);
      if (active === 4) return zodResolver(onboardingShareholders)(values);

      return {};
    },
  });

  useAxios<ReferenceData>({
    baseURL: "questionnaire",
    endpoint: "/business/onboarding/reference-data",
    method: "GET",
    dependencies: [],
    onSuccess: (data) => setRefData(data),
  });

  const { data: profile, loading: profileLoading } = useAxios<OnboardingProfile>({
    baseURL: "questionnaire",
    endpoint: "/business/onboarding/profile",
    method: "GET",
    dependencies: [],
    enabled: false,
    onSuccess: (data) => {
      if (data.business?.businessName) {
        setBusiness({ businessName: data.business.businessName } as any);
      }
      const next = data.progress?.isComplete
        ? 5
        : Math.max(0, (data.progress?.nextSection ?? 1) - 1);
      setActive(next);
    },
  });

  useEffect(() => {
    if (!profile) return;

    if (profile.reference) setReference(profile.reference);

    const b = profile.business;
    const cp = profile.contactPerson;
    const ceo = profile.ceo;
    const docs = profile.documents;

    const formValues = {
      // Business info
      businessName: b?.businessName || "",
      businessTradingName: b?.tradingName || "",
      businessAddress: b?.businessAddress || "",
      businessPhoneNumber: b?.businessPhoneNumber || "",
      businessEmail: b?.businessEmail || "",
      makeContactPersonInitiator: b?.contactIsInitiator || false,
      businessDescription: b?.businessDescription || "",
      businessIndustry: b?.businessIndustry || "",
      businessCountry: countries.find((c) => c.code === b?.countryCode)?.name || null,
      businessType: b?.businessType || null,
      businessWebsite: b?.businessWebsite || "https://",
      businessPhoneNumberCode: b?.businessPhoneCountryCode || "+234",

      // Contact person
      contactPersonFirstName: cp?.firstName || "",
      contactPersonLastName: cp?.lastName || "",
      contactPersonEmail: cp?.email || "",
      contactPersonPhoneNumber: cp?.phoneNumber || "",
      contactPersonPhoneNumberCode: cp?.phoneCountryCode || "+234",
      contactPersonIdType: cp?.identityType || "",
      contactPersonPOAType: cp?.proofOfAddressType || "",
      contactPersonIdUrl: cp?.identityDocument?.id || "",
      contactPersonIdUrlBack: "",
      contactPersonPOAUrl: cp?.proofOfAddressDocument?.id || "",

      // Documents
      cacCertificate: docs?.incorporationCertificate?.id || "",
      mermat: docs?.memart?.id || "",
      amlCompliance: docs?.amlFramework?.id || "",
      operationalLicense: docs?.operationalLicence?.id || "",

      // CEO
      ceoFirstName: ceo?.firstName || "",
      ceoLastName: ceo?.lastName || "",
      ceoEmail: ceo?.email || "",
      ceoIdType: ceo?.identityType || "",
      ceoPOAType: ceo?.proofOfAddressType || "",
      ceoIdUrl: ceo?.identityDocument?.id || "",
      ceoIdUrlBack: ceo?.identityDocumentBack?.id || "",
      ceoPOAUrl: ceo?.proofOfAddressDocument?.id || "",
      ceoDOB: ceo?.dateOfBirth ? new Date(ceo.dateOfBirth) : null,

      // Arrays
      directors:
        (profile.directors || []).length > 0
          ? profile.directors.map((director) => ({
              ...director,
              id: crypto.randomUUID(),
              date_of_birth: director.date_of_birth
                ? new Date(director.date_of_birth)
                : null,
              first_name: director.first_name || "",
              last_name: director.last_name || "",
              email: director.email || "",
              identityType: director.identityType || null,
              proofOfAddress: director.proofOfAddress || null,
              identityFileUrl: director.identityFileUrl || null,
              identityFileUrlBack: director.identityFileUrlBack || null,
              proofOfAddressFileUrl: director.proofOfAddressFileUrl || null,
            }))
          : [{ ...OnboardingDirectorValues, id: crypto.randomUUID() }],
      shareholders:
        (profile.shareholders || []).length > 0
          ? profile.shareholders.map((shareholder) => ({
              ...shareholder,
              id: crypto.randomUUID(),
              date_of_birth: shareholder.date_of_birth
                ? new Date(shareholder.date_of_birth)
                : null,
              first_name: shareholder.first_name || "",
              last_name: shareholder.last_name || "",
              email: shareholder.email || "",
              identityType: shareholder.identityType || null,
              proofOfAddress: shareholder.proofOfAddress || null,
              identityFileUrl: shareholder.identityFileUrl || null,
              identityFileUrlBack: shareholder.identityFileUrlBack || null,
              proofOfAddressFileUrl: shareholder.proofOfAddressFileUrl || null,
            }))
          : [{ ...OnboardingDirectorValues, id: crypto.randomUUID() }],
    };

    form.setValues(formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const isSectionCompleted = (stepIndex: number) =>
    profile?.progress?.sections?.some(
      (s) => s.number === stepIndex + 1 && s.completed
    ) ?? false;

  return (
    <Box>
      <Flex gap={20}>
        <Box h="100%">
          <Navbar active={active} />
        </Box>

        <Box flex={1}>
          <CustomPaper>
            {profileLoading ? (
              <Flex justify="center" align="center" h={300}>
                <Loader color="rgba(151, 173, 5)" size="lg" type="dots" />
              </Flex>
            ) : profile?.documentReview?.state === "IN_REVIEW" || showReview ? (
              <Flex direction="column" align="center" justify="center" py={48} px={24}>
                {/* Icon */}
                <Box
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#FFF3CD",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <IconClockHour3 size={40} color="#D67507" stroke={1.5} />
                </Box>

                {/* Heading */}
                <Title order={3} fw={700} c="var(--prune-text-gray-700)" ta="center" mb={8}>
                  Application Under Review
                </Title>
                <Text fz={14} c="var(--prune-text-gray-500)" ta="center" maw={480} mb={36}>
                  Your submitted documents are currently being reviewed by our
                  team. You will receive an email notification once a decision
                  has been made. This usually takes 24–48 hours.
                </Text>

              </Flex>
            ) : (
              <>
                {active === 0 && (
                  <BusinessInfo
                    setActive={setActive}
                    active={active}
                    form={form}
                    refData={refData}
                    onReferenceObtained={(ref) => setReference(ref)}
                    alreadyCompleted={isSectionCompleted(0)}
                  />
                )}
                {active === 1 && (
                  <CEOInfo
                    setActive={setActive}
                    active={active}
                    form={form}
                    refData={refData}
                    alreadyCompleted={isSectionCompleted(1)}
                  />
                )}
                {active === 2 && (
                  <DocumentInfo
                    setActive={setActive}
                    active={active}
                    form={form}
                    refData={refData}
                    alreadyCompleted={isSectionCompleted(2)}
                  />
                )}
                {active === 3 && (
                  <AddDirectorsInfo
                    setActive={setActive}
                    active={active}
                    form={form}
                    refData={refData}
                    alreadyCompleted={isSectionCompleted(3)}
                  />
                )}
                {active === 4 && (
                  <AddShareholdersInfo
                    setActive={setActive}
                    active={active}
                    form={form}
                    shareholders={shareholders}
                    refData={refData}
                    alreadyCompleted={isSectionCompleted(4)}
                  />
                )}
                {active === 5 && (
                  <ReviewInfo setActive={setActive} active={active} form={form} />
                )}
                {active === 6 && (
                  <TermsOfUseInfo
                    setActive={setActive}
                    active={active}
                    form={form}
                    onSuccess={() => setShowReview(true)}
                  />
                )}
                {active === 7 && (
                  <Box>
                    <Alert
                      title="Awaiting Admin Approval"
                      mb={64}
                      color="#D67507"
                      p={16}
                      variant="outline"
                      icon={
                        <ThemeIcon radius="xl" size={24} color="#D67507">
                          <IconExclamationMark />
                        </ThemeIcon>
                      }
                      styles={{
                        root: { background: "#FFF9E6", padding: "16px" },
                        title: {
                          color: "var(--prune-text-gray-700)",
                          fontSize: "14px",
                          fontWeight: 700,
                        },
                        message: {
                          color: "var(--prune-text-gray-500)",
                          fontSize: "12px",
                          fontWeight: 400,
                        },
                      }}
                    >
                      You will get an email regarding your application status within
                      24-48 hours, once account creation has been approved
                    </Alert>

                    <ReviewInfo
                      setActive={setActive}
                      active={active}
                      form={form}
                      title="Summary"
                    />
                  </Box>
                )}
              </>
            )}
          </CustomPaper>
        </Box>
      </Flex>
    </Box>
  );
}
