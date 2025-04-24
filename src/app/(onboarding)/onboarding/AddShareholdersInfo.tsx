import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import OnBoardingDocumentBox from "./onBoardingDocumentBox";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

interface AddShareholdersInfo {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
}

export const AddShareholdersInfo = ({
  setActive,
  active,
}: AddShareholdersInfo) => {
  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fz={16} fw={700}>
        Add Shareholder
      </Text>

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
