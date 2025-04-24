import {
  TextareaWithInsideLabel,
  TextInputWithInsideLabel,
} from "@/ui/components/InputWithLabel";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

interface DocumentInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
}

export const DocumentInfo = ({ setActive, active }: DocumentInfo) => {
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Documents
      </Text>

      <Stack mt={30} gap={24}>
        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox title="CAC Certificate" />
          <OnBoardingDocumentBox title="CAC Certificate" />
        </Flex>

        <Flex gap={24} w="100%">
          <OnBoardingDocumentBox title="AML Compliance Framework" />
          <OnBoardingDocumentBox title="Operational License (Optional)" />
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
