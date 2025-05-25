"use client";

import { Alert, Box, Flex, ThemeIcon } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { CustomPaper } from "../CustomPaper";
import Navbar from "../Navbar";
import { BusinessInfo } from "./BusinessInfo";
import { CEOInfo } from "./CeoInfo";
import { DocumentInfo } from "./DocumentInfo";
import { AddDirectorsInfo } from "./AddDirectorsInfo";
import { AddShareholdersInfo } from "./AddShareholdersInfo";
import { ReviewInfo } from "./ReviewInfo";
import { TermsOfUseInfo } from "./TermsOfUseInfo";
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
import { OnboardingBusiness, Onboarding as IOnboarding } from "@/lib/interface";
import dayjs from "dayjs";
import { IconExclamationMark } from "@tabler/icons-react";

export default function Onboarding() {
  const [active, setActive] = useState(0);
  const [directors, setDirectors] = useState<OnboardingType["directors"]>();
  const [shareholders, setShareholders] =
    useState<OnboardingType["shareholders"]>();
  const { setBusiness, setData } = OnboardingStore();

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

  const { data: business } = useAxios<OnboardingBusiness>({
    baseURL: "auth",
    endpoint: "/onboarding/me",
    method: "GET",
    dependencies: [],
    // dependencies: [active],
    enabled: false,
    onSuccess: (data) => {
      setBusiness(data);
      setActive((prev) =>
        prev === 6 && data.stageIdentifier === 6 ? 6 : data.stageIdentifier
      );
    },
  });

  useEffect(() => {
    const formValues = {
      // Basic business info - prioritize data over business
      businessName: business?.businessName || "",
      businessTradingName: business?.businessTradingName || "",
      businessAddress: business?.businessAddress || "",
      businessPhoneNumber: business?.businessPhoneNumber || "",
      businessEmail: business?.businessEmail || "",
      makeContactPersonInitiator: business?.makeContactPersonInitiator || false,

      // Business-only fields with defaults
      businessDescription: business?.businessDescription || "",
      businessIndustry: business?.businessIndustry || "",
      businessCountry: business?.businessCountry || null,
      businessType: business?.businessType || null,
      businessWebsite: business?.businessWebsite || "https://",

      // Contact person information
      contactPersonPhoneNumber: business?.contactPersonPhoneNumber || "",
      contactPersonFirstName: business?.contactPersonFirstName || "",
      contactPersonLastName: business?.contactPersonLastName || "",
      contactPersonEmail: business?.contactPersonEmail || "",
      contactPersonIdType: business?.contactPersonIdType || "",
      contactPersonPOAType: business?.contactPersonPOAType || "",
      contactPersonIdUrl: business?.contactPersonIdUrl || "",
      contactPersonIdUrlBack: business?.contactPersonIdUrlBack || "",
      contactPersonPOAUrl: business?.contactPersonPOAUrl || "",
      contactPersonPhoneNumberCode: "+234",
      businessPhoneNumberCode: "+234",

      // Documents
      amlCompliance: business?.amlCompliance || "",
      cacCertificate: business?.cacCertificate || "",
      mermat: business?.mermat || "",
      operationalLicense: business?.operationalLicense || "",

      // CEO Information
      ceoFirstName: business?.ceoFirstName || "",
      ceoLastName: business?.ceoLastName || "",
      ceoIdType: business?.ceoIdType || "",
      ceoPOAType: business?.ceoPOAType || "",
      ceoIdUrl: business?.ceoIdUrl || "",
      ceoIdUrlBack: business?.ceoIdUrlBack || "",
      ceoPOAUrl: business?.ceoPOAUrl || "",
      ceoDOB: new Date(business?.ceoDOB as unknown as Date) || "",
      ceoEmail: business?.ceoEmail || "",

      // Arrays
      directors:
        (business?.directors || []).length > 0
          ? business?.directors?.map((director) => ({
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
        (business?.shareholders || []).length > 0
          ? business?.shareholders?.map((shareholder) => ({
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
  }, [business]);

  return (
    <Box>
      <Flex gap={20}>
        <Box h="100%">
          <Navbar active={active} />
        </Box>

        <Box flex={1}>
          <CustomPaper>
            {active === 0 && (
              <BusinessInfo setActive={setActive} active={active} form={form} />
            )}
            {active === 1 && (
              <CEOInfo setActive={setActive} active={active} form={form} />
            )}
            {active === 2 && (
              <DocumentInfo setActive={setActive} active={active} form={form} />
            )}
            {active === 3 && (
              <AddDirectorsInfo
                setActive={setActive}
                active={active}
                form={form}
                // directors={directors}
              />
            )}
            {active === 4 && (
              <AddShareholdersInfo
                setActive={setActive}
                active={active}
                form={form}
                shareholders={shareholders}
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
          </CustomPaper>
        </Box>
      </Flex>
    </Box>
  );
}
