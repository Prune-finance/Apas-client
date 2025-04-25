import {
  SelectInputWithInsideLabel,
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

interface BusinessInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
}

export const BusinessInfo = ({ setActive, active }: BusinessInfo) => {
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
          <SelectInputWithInsideLabel label="Business Type" w="100%" />
          <TextInputWithInsideLabel label="Business Industry" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel label="Country" w="100%" />
          <TextInputWithInsideLabel label="Address" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="Email" w="100%" />
          <TextInputWithInsideLabel label="Phone Number" w="100%" />
        </Flex>

        <Flex gap={24} w="50%">
          <TextInputWithInsideLabel label="Business Website" w="100%" />
        </Flex>

        <Flex gap={24} w="100%" mb={48}>
          <TextareaWithInsideLabel
            label="Company's Description"
            w="100%"
            autosize
            maxRows={7}
            minRows={5}
          />
        </Flex>
      </Stack>

      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Contact Person
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="First Name" w="100%" />
          <TextInputWithInsideLabel label="Last Name" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="Email" w="100%" />
          <TextInputWithInsideLabel label="Phone Number" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <SelectInputWithInsideLabel label="Identity Type" w="100%" />
          <SelectInputWithInsideLabel label="Proof of Address" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox title="Upload Identity Document" />
          <OnBoardingDocumentBox title="Upload Identity Document" />
        </Flex>
      </Stack>

      <Flex align="center" justify="space-between" w="100%" mt={20}>
        <SecondaryBtn text="Clear Form" fw={600} />

        <Flex align="center" justify="center" gap={20}>
          <SecondaryBtn
            text="Previous"
            fw={600}
            action={() => setActive(active - 1)}
            disabled={active === 0}
          />
          <PrimaryBtn
            text="Next"
            w={126}
            fw={600}
            action={() => setActive(active + 1)}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
