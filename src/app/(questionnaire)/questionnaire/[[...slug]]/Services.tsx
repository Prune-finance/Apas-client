import { Box, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  IconDatabase,
  IconCreditCard,
  IconMoneybag,
  IconSearch,
  IconArrowsRightLeft,
} from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Icon, IconProps } from "@tabler/icons-react";
import CheckboxCard from "@/ui/components/CheckboxCard";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import createAxiosInstance from "@/lib/axios";

const questAxios = createAxiosInstance("questionnaire");

interface RefOption { value: string; label: string }

interface ServiceItem {
  value: string;
  label: string;
  description: string;
  accounts: RefOption[];
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

const SERVICE_META: Record<string, { description: string; icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>> }> = {
  OPERATIONS_ACCOUNT: {
    description: "Prune Payments payout service gives the business access to payouts.",
    icon: IconDatabase,
  },
  VIRTUAL_ACCOUNTS: {
    description: "The account service lets businesses issue user accounts to clients.",
    icon: IconCreditCard,
  },
  PAYOUT: {
    description: "This helps businesses manage and disburse funds to recipients.",
    icon: IconMoneybag,
  },
  ACCOUNT_LOOKUP: {
    description: "This helps businesses quickly verify and access account details for transactions.",
    icon: IconSearch,
  },
  REMITTANCE: {
    description: "This helps businesses quickly verify and access account details for transactions.",
    icon: IconArrowsRightLeft,
  },
};

export default function Services() {
  const form = useQuestionnaireFormContext();

  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);

  useEffect(() => {
    questAxios
      .get("/business/questionnaire/reference-data", {
        params: { include: "services,currencies" },
      })
      .then(({ data: res }) => {
        const currencies: RefOption[] = res.data?.currencies ?? [];
        const services: RefOption[] = res.data?.services ?? [];

        setServiceItems(
          services.map((s) => ({
            value: s.value,
            label: s.label,
            description: SERVICE_META[s.value]?.description ?? "",
            accounts: currencies,
            icon: SERVICE_META[s.value]?.icon ?? IconDatabase,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <Box>
      <Text c="var(--prune-text-gray-700)" fw={700} fz={24} mb={32}>
        What service(s) is this Entity interested in?
      </Text>

      <SimpleGrid cols={{ base: 1, md: 2 }} pt="md">
        {serviceItems.map((item, idx) => (
          <CheckboxCard
            key={item.value}
            value={item.value}
            title={item.label}
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
