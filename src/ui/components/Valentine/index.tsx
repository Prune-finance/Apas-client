import React from "react";
import ValentineBackgroundImage from "@/assets/val-image.png";
import { BackgroundImage, Box, Flex, Text } from "@mantine/core";

interface Valentine {
  title?: string;
  description?: string;
}

function Valentine({ title, description }: Valentine) {
  return (
    <Box mx="auto" w="100%" maw={400} my={24}>
      <BackgroundImage
        src={ValentineBackgroundImage.src}
        radius={4}
        h={90}
        maw={400}
        p={16}
      >
        <Flex
          align="flex-start"
          justify="flex-start"
          h="100%"
          direction="column"
          gap={4}
        >
          <Text fz={14} fw={600} c="#97AD05" lh="18.48px">
            {title || "Happy Valentine"}
          </Text>
          <Text c="#1D2939" fz={12} fw={400} lh="15.84px" w={319}>
            {description ||
              " A little reminder: You’re loved, you’re appreciated, and  you’re amazing!"}
          </Text>
        </Flex>
      </BackgroundImage>
    </Box>
  );
}

export default Valentine;
