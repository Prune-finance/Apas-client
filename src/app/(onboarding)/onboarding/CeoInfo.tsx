import {
  DateInputWithInsideLabel,
  SelectInputWithInsideLabel,
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

interface CEOInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
}

export const CEOInfo = ({ setActive, active }: CEOInfo) => {
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        CEO Details
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="First Name" w="100%" />
          <TextInputWithInsideLabel label="Last Name" w="100%" />
        </Flex>

        <Flex gap={24} w="100%">
          <TextInputWithInsideLabel label="Email" w="100%" />
          <DateInputWithInsideLabel label="Date of Birth" w="100%" />
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
        <SecondaryBtn text="Clear Form" fw={500} />

        <Flex align="center" justify="center" gap={20}>
          <SecondaryBtn
            text="Previous"
            fw={500}
            action={() => setActive(active - 1)}
            disabled={active === 0}
          />
          <PrimaryBtn
            text="Next"
            w={126}
            fw={500}
            action={() => setActive(active + 1)}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
