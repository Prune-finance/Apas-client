"use client";

import { Box, Flex } from "@mantine/core";
import React, { useState } from "react";
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

export default function Onboarding() {
  const [active, setActive] = useState(0);
  const [directors, setDirectors] = useState<OnboardingType["directors"]>();
  const [shareholders, setShareholders] =
    useState<OnboardingType["shareholders"]>();

  const form = useForm<OnboardingType>({
    mode: "uncontrolled",
    initialValues: newOnboardingValue,
    validate: (values) => {
      if (active === 0) return zodResolver(onboardingBasicInfoSchema)(values);
      if (active === 1) return zodResolver(CEOSchema)(values);
      if (active === 2) return zodResolver(onboardingDocumentSchema)(values);
      if (active === 3) return zodResolver(onboardingDirectors)(values);
      if (active === 4) return zodResolver(onboardingShareholders)(values);

      return {};
    },
    onValuesChange: (values) => {
      setDirectors(values.directors);
      setShareholders(values.shareholders);
    },
  });
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
