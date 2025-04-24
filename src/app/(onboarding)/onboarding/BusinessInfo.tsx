import {
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";

export const BusinessInfo = () => {
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Business Information
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="Business Name" w="100%" />
          <TextInputWithInsideLabel label="Trading Name" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="Business Type" w="100%" />
          <TextInputWithInsideLabel label="Business Industry" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="Country" w="100%" />
          <TextInputWithInsideLabel label="Address" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="Email" w="100%" />
          <TextInputWithInsideLabel label="Phone" w="100%" />
        </Flex>

        <Flex gap={24} w="50%">
          <TextInputWithInsideLabel label="Business Website" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <TextareaWithInsideLabel
            label="Company's Description"
            w="100%"
            autosize
            maxRows={7}
            minRows={5}
          />
        </Flex>
      </Stack>
    </Box>
  );
};
