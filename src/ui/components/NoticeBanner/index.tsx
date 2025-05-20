import { Box, Flex, Image, Text } from "@mantine/core";
import React from "react";
import InfoIcon from "@/assets/info-icon.png";

function NoticeBanner() {
  return (
    <Box bg="#F9F6E6" p={16} mb={20}>
      <Flex align="flex-start" gap={16}>
        <Image
          src={InfoIcon.src}
          alt="icon"
          h={24}
          mt={4}
          w={24}
          fit="contain"
        />
        <Flex direction="column" gap={4}>
          <Text fz={16} fw={600} c="#8D7700">
            System Review in Progress
          </Text>
          <Text fz={14} fw={400} c="#8D7700">
            We&apos;re currently performing a system review to ensure the safety
            and reliability of our services. Access to funds will be restored
            shortly. We appreciate your patience and understanding, everything
            is on track, and you&apos;ll be able to use your funds soon.
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}

export default NoticeBanner;
