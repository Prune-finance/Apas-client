"use client";

import { Box, Flex } from "@mantine/core";
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
  onboardingDocumentSchema,
  onboardingShareholders,
  OnboardingType,
} from "@/lib/schema";
import OnboardingStore from "@/lib/store/onboarding";
import useAxios from "@/lib/hooks/useAxios";
import { OnboardingBusiness, Onboarding as IOnboarding } from "@/lib/interface";
import dayjs from "dayjs";

export default function Onboarding() {
  const [active, setActive] = useState(0);
  const [directors, setDirectors] = useState<OnboardingType["directors"]>();
  const [shareholders, setShareholders] =
    useState<OnboardingType["shareholders"]>();
  // const { data, business, setBusiness, setData } = OnboardingStore();

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
    dependencies: [active],
    enabled: false,
  });

  const { data } = useAxios<IOnboarding>({
    baseURL: "auth",
    endpoint: `/onboarding/questionnaire/${business?.questionnaireId}`,
    method: "GET",
    dependencies: [active, business?.questionnaireId],
    enabled: !!!business?.questionnaireId,
  });

  useEffect(() => {
    const formValues = {
      // Basic business info - prioritize data over business
      businessName: data?.businessName || business?.businessName || "",
      businessTradingName:
        data?.businessTradingName || business?.businessTradingName || "",
      businessAddress: data?.businessAddress || business?.businessAddress || "",
      businessPhoneNumber:
        data?.businessPhoneNumber || business?.businessPhoneNumber || "",
      businessEmail: data?.businessEmail || business?.businessEmail || "",
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
        business?.directors?.map((director) => ({
          ...director,
          id: crypto.randomUUID(),
          dob: director.dob ? new Date(director.dob) : null,
          firstName: director.firstName || "",
          lastName: director.lastName || "",
          email: director.email || "",
          identityType: director.identityType || null,
          proofOfAddress: director.proofOfAddress || null,
          identityFileUrl: director.identityFileUrl || null,
          identityFileUrlBack: director.identityFileUrlBack || null,
          proofOfAddressFileUrl: director.proofOfAddressFileUrl || null,
        })) || [],
      shareholders:
        business?.shareholders?.map((shareholder) => ({
          ...shareholder,
          id: crypto.randomUUID(),
          dob: shareholder.dob ? new Date(shareholder.dob) : null,
          firstName: shareholder.firstName || "",
          lastName: shareholder.lastName || "",
          email: shareholder.email || "",
          identityType: shareholder.identityType || null,
          proofOfAddress: shareholder.proofOfAddress || null,
          identityFileUrl: shareholder.identityFileUrl || null,
          identityFileUrlBack: shareholder.identityFileUrlBack || null,
          proofOfAddressFileUrl: shareholder.proofOfAddressFileUrl || null,
        })) || [],
    };

    form.setValues(formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, business]);

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
          </CustomPaper>
        </Box>
      </Flex>
    </Box>
  );
}
