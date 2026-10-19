"use client";

import { Alert, Box, Flex, Loader, ThemeIcon } from "@mantine/core";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import ChangesRequestedScreen from "./ChangesRequestedScreen";
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


export interface ProfileDocFile {
  id: string;
  kind: string;
  fileName: string;
  review?: { status: string; reason?: string; fix?: string } | null;
}

export interface OnboardingProfile {
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
    identityDocument: ProfileDocFile | null;
    proofOfAddressDocument: ProfileDocFile | null;
  };
  ceo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    identityType: string | null;
    proofOfAddressType: string | null;
    identityDocument: ProfileDocFile | null;
    identityDocumentBack: ProfileDocFile | null;
    proofOfAddressDocument: ProfileDocFile | null;
  } | null;
  documents: {
    incorporationCertificate: ProfileDocFile | null;
    memart: ProfileDocFile | null;
    amlFramework: ProfileDocFile | null;
    operationalLicence: ProfileDocFile | null;
  };
  directors: {
    firstName: string; lastName: string; email: string;
    dateOfBirth: string | null;
    identityType: string | null; proofOfAddressType: string | null;
    identityDocument: ProfileDocFile | null;
    identityDocumentBack: ProfileDocFile | null;
    proofOfAddressDocument: ProfileDocFile | null;
  }[];
  shareholders: {
    firstName: string; lastName: string; email: string;
    dateOfBirth: string | null;
    identityType: string | null; proofOfAddressType: string | null;
    identityDocument: ProfileDocFile | null;
    identityDocumentBack: ProfileDocFile | null;
    proofOfAddressDocument: ProfileDocFile | null;
  }[];
  consent: {
    signedBy: string;
    designation: string;
    signature: string;
    email: string;
  } | null;
  documentReview: {
    state: string;
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  } | null;
}
import { IconExclamationMark } from "@tabler/icons-react";

function parseDDMMYYYY(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const [dd, mm, yyyy] = dateStr.split("-").map(Number);
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
}

function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const syncingFromUrl = useRef(false);

  const [active, setActive] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [directors, setDirectors] = useState<OnboardingType["directors"]>();
  const [shareholders, setShareholders] =
    useState<OnboardingType["shareholders"]>();
  const { setBusiness, setData } = OnboardingStore();
  const [refData, setRefData] = useState<ReferenceData>(DEFAULT_REF_DATA);

  // Push a history entry whenever the user moves between steps
  useEffect(() => {
    if (syncingFromUrl.current) {
      syncingFromUrl.current = false;
      return;
    }
    router.push(`?step=${active}`, { scroll: false });
  }, [active]);

  // Restore active from URL when the browser back/forward button is used
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam === null) return;
    const step = parseInt(stepParam, 10);
    if (!isNaN(step) && step >= 0 && step !== active) {
      syncingFromUrl.current = true;
      setActive(step);
    }
  }, [searchParams]);

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
      ceoDOB: parseDDMMYYYY(ceo?.dateOfBirth),

      // Arrays
      directors:
        (profile.directors || []).length > 0
          ? profile.directors.map((director: any) => ({
              id: crypto.randomUUID(),
              first_name: director.firstName || "",
              last_name: director.lastName || "",
              email: director.email || "",
              date_of_birth: parseDDMMYYYY(director.dateOfBirth),
              identityType: director.identityType || null,
              proofOfAddress: director.proofOfAddressType || null,
              identityFileUrl: director.identityDocument?.id || null,
              identityFileUrlBack: director.identityDocumentBack?.id || null,
              proofOfAddressFileUrl: director.proofOfAddressDocument?.id || null,
            }))
          : [{ ...OnboardingDirectorValues, id: crypto.randomUUID() }],
      shareholders:
        (profile.shareholders || []).length > 0
          ? profile.shareholders.map((shareholder: any) => ({
              id: crypto.randomUUID(),
              first_name: shareholder.firstName || "",
              last_name: shareholder.lastName || "",
              email: shareholder.email || "",
              date_of_birth: parseDDMMYYYY(shareholder.dateOfBirth),
              identityType: shareholder.identityType || null,
              proofOfAddress: shareholder.proofOfAddressType || null,
              identityFileUrl: shareholder.identityDocument?.id || null,
              identityFileUrlBack: shareholder.identityDocumentBack?.id || null,
              proofOfAddressFileUrl: shareholder.proofOfAddressDocument?.id || null,
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
    <Box style={{ height: "calc(100vh - 112px)", overflow: "hidden" }}>
      <Flex gap={24} align="stretch" style={{ height: "100%" }}>
        <Navbar active={active} />

        <Box flex={1} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <CustomPaper px={24} py={32} style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {profileLoading ? (
              <Flex justify="center" align="center" h={300}>
                <Loader color="rgba(151, 173, 5)" size="lg" type="dots" />
              </Flex>
            ) : profile?.status === "PENDING_CUSTOMER" && profile?.documentReview?.state === "CHANGES_REQUESTED" ? (
              <ChangesRequestedScreen
                profile={profile}
                onSuccess={() => setShowReview(true)}
              />
            ) : profile?.documentReview?.state === "IN_REVIEW" || showReview ? (
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
                  readOnly
                />
              </Box>
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
                      readOnly
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

export default function Onboarding() {
  return (
    <Suspense
      fallback={
        <Flex justify="center" align="center" h="100vh">
          <Loader color="rgba(151, 173, 5)" size="lg" type="dots" />
        </Flex>
      }
    >
      <OnboardingPage />
    </Suspense>
  );
}
