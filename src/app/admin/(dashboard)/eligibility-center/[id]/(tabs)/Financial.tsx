import { Box, Radio, SimpleGrid, Stack, Text } from "@mantine/core";
import PaperContainer from "../PaperContainer";
import {
  CustomRadioCard,
  ProfileTextInput,
} from "@/ui/components/InputWithLabel";
import { formatNumber } from "@/lib/utils";
import { operationsAccountEstimatedBalance } from "@/lib/static";

export default function Financial() {
  const boldLabel = (boldText: string, normalText: string) => (
    <Text inherit span>
      <Text inherit span fw={700}>
        {boldText}
      </Text>{" "}
      {normalText}
    </Text>
  );

  return (
    <Box>
      <PaperContainer title="Finance">
        <Stack gap={8}>
          <Text fz={14} fw={500} c="var(--prune-text-gray-500)">
            Annual Turnover
          </Text>
          <Text fz={32} fw={500} c="var(--prune-text-gray-700)">
            £50,000 - £100,000
          </Text>
        </Stack>
      </PaperContainer>

      <PaperContainer my={24} title="Virtual Account Service">
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <ProfileTextInput
            label="Account needed as Day 1 requirement"
            placeholder={`${2}`}
          />
          <ProfileTextInput
            label="Projected account total"
            placeholder={`${10}`}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} my={24}>
          <ProfileTextInput
            label={boldLabel("Single", "account limit - Daily")}
            placeholder={`${formatNumber(7000, true, "GBP")}`}
          />
          <ProfileTextInput
            label={boldLabel("Single", "account limit - Monthly")}
            placeholder={`${formatNumber(14000, true, "GBP")}`}
          />
          <ProfileTextInput
            label={boldLabel("Single", "account limit - Annually")}
            placeholder={`${formatNumber(1500000, true, "GBP")}`}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <ProfileTextInput
            label={boldLabel("All", "account limit - Daily")}
            placeholder={`${formatNumber(7000, true, "GBP")}`}
          />
          <ProfileTextInput
            label={boldLabel("All", "account limit - Monthly")}
            placeholder={`${formatNumber(14000, true, "GBP")}`}
          />
          <ProfileTextInput
            label={boldLabel("All", "account limit - Annually")}
            placeholder={`${formatNumber(1500000, true, "GBP")}`}
          />
        </SimpleGrid>
      </PaperContainer>

      <PaperContainer title="Operations Account Service">
        <Radio.Group value={"between-10000-50000"} onChange={() => {}}>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {Object.entries(operationsAccountEstimatedBalance).map(
              ([value, label], idx) => (
                <CustomRadioCard label={label} value={value} key={idx} />
              )
            )}
          </SimpleGrid>
        </Radio.Group>
      </PaperContainer>
    </Box>
  );
}
