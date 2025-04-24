"use client";

import { Box, Flex, Paper, Text, Timeline, TimelineItem } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import React, { useState } from "react";
import { CustomPaper } from "../CustomPaper";
import Navbar from "../Navbar";
import { BusinessInfo } from "./BusinessInfo";

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
            {active === 0 && <BusinessInfo />}
            {active === 1 && <Text>CEO Details</Text>}
            {active === 2 && <Text>Documents</Text>}
            {active === 3 && <Text>Add Directors</Text>}
            {active === 4 && <Text>Add Shareholders</Text>}
            {active === 5 && <Text>Review</Text>}
            {active === 6 && <Text>Terms of Use</Text>}
          </CustomPaper>
        </Box>
      </Flex>
    </Box>
  );
}
