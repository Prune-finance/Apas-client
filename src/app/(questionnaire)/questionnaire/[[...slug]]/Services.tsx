import { Box, Checkbox, Group, SimpleGrid, Stack, Text } from "@mantine/core";
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
  const [value, setValue] = useState<string[]>([]);
  const { push } = useRouter();

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        What service(s) is this Entity interested in?
      </Text>

      {/* <Checkbox.Group
        // {...form.getInputProps("services")}
        value={form.getValues().services}
        onChange={(selectedTitles: string[]) => {
          console.log({ selectedTitles });
          const selectedServices = selectedTitles.map((title) => {
            const service = serviceCategories.find((s) => s.title === title);
            return {
              name: service?.title || "",
              accounts: service?.accounts || [],
            };
          });
          form.setFieldValue("services", selectedServices);
        }}
        key={form.key("services")}
      > */}
      <SimpleGrid cols={2} pt="md">
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
      {/* </Checkbox.Group> */}

      <QuestionnaireNav
        onNext={() => push("/questionnaire/services/operations-account")}
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
