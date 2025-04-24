"use client";

import { Box, Flex, Paper, Text, Timeline, TimelineItem } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
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

export default function Onboarding() {
  const [active, setActive] = useState(0);
  return (
    <Box>
      <Flex gap={20}>
        <Box h="100%">
          <Navbar active={active} />
        </Box>

        <Box flex={1}>
          <CustomPaper>
            {active === 0 && (
              <BusinessInfo setActive={setActive} active={active} />
            )}
            {active === 1 && <CEOInfo setActive={setActive} active={active} />}
            {active === 2 && (
              <DocumentInfo setActive={setActive} active={active} />
            )}
            {active === 3 && (
              <AddDirectorsInfo setActive={setActive} active={active} />
            )}
            {active === 4 && (
              <AddShareholdersInfo setActive={setActive} active={active} />
            )}
            {active === 5 && (
              <ReviewInfo setActive={setActive} active={active} />
            )}
            {active === 6 && (
              <TermsOfUseInfo setActive={setActive} active={active} />
            )}
          </CustomPaper>
        </Box>
      </Flex>
    </Box>
  );
}
