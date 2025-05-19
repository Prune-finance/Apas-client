import { Box, SimpleGrid, Text } from "@mantine/core";
import CheckboxCard from "./CheckboxCard";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import { serviceCategories } from "@/lib/static";

export default function Services() {
  const form = useQuestionnaireFormContext();

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        What service(s) is this Entity interested in?
      </Text>

      <SimpleGrid cols={{ base: 1, md: 2 }} pt="md">
        {serviceCategories.map((item, idx) => (
          <CheckboxCard
            key={item.title}
            title={item.title}
            description={item.description}
            accounts={item.accounts}
            icon={item.icon}
            idx={idx}
          />
        ))}
      </SimpleGrid>
      {form.errors.services && (
        <Text fz={12} c="red" mt={10}>
          {form.errors.services}
        </Text>
      )}
    </Box>
  );
}
