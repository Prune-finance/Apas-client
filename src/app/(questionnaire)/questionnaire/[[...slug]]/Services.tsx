import { Box, SimpleGrid, Text } from "@mantine/core";
import {
  IconCreditCard,
  IconMoneybag,
  IconArrowsRightLeft,
  IconSearch,
  IconDatabase,
} from "@tabler/icons-react";
import { useState } from "react";
import CheckboxCard from "./CheckboxCard";
import { QuestionnaireNav } from "./QuestionnaireNav";
import { useRouter } from "next/navigation";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";

export default function Services() {
  const { push, back } = useRouter();
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

      <QuestionnaireNav
        onNext={() => push("/questionnaire/services/operations-account")}
        onPrevious={back}
      />
    </Box>
  );
}

const serviceCategories = [
  {
    title: "Operations Account",
    description:
      "Prune Payments payout service gives the business access to payouts.",
    accounts: ["Euro Account", "GBP Account", "USD Account", "NGN Account"],
    icon: IconDatabase,
  },
  {
    title: "Virtual Account Services",
    description:
      "The account service lets businesses issue user accounts to clients.",
    accounts: ["Euro Account", "GBP Account", "USD Account", "NGN Account"],
    icon: IconCreditCard,
  },
  {
    title: "Payout Services",
    description:
      "This helps businesses manage and disburse funds to recipients.",
    accounts: ["Euro Account", "GBP Account", "USD Account", "NGN Account"],
    icon: IconMoneybag,
  },
  {
    title: "Account Lookup Services",
    description:
      "This helps businesses quickly verify and access account details for transactions.",
    accounts: ["Euro Account", "GBP Account", "USD Account", "NGN Account"],
    icon: IconSearch,
  },
  {
    title: "Remittance",
    description:
      "This helps businesses quickly verify and access account details for transactions.",
    accounts: ["Euro Account", "GBP Account", "USD Account", "NGN Account"],
    icon: IconArrowsRightLeft,
  },
];
