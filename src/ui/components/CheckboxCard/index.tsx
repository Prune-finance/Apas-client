import {
  Checkbox,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import classes from "./CheckboxCard.module.css";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Icon, IconProps } from "@tabler/icons-react";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";
import useNotification from "@/lib/hooks/notification";

interface CurrencyOption { value: string; label: string }

interface ServiceCategory {
  idx: number;
  value: string;
  title: string;
  description: string;
  accounts: CurrencyOption[];
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

export default function CheckboxCard({
  value: serviceValue,
  title,
  description,
  accounts,
  icon,
  idx,
}: ServiceCategory) {
  const { handleInfo } = useNotification();
  const Icon = icon;
  const form = useQuestionnaireFormContext();
  const services = form.getValues().services;

  const isChecked = services.some((s) => s.name === serviceValue);

  return (
    <Checkbox.Card
      className={classes.root}
      radius="md"
      checked={isChecked}
      onChange={(e) => {
        if (e) {
          form.insertListItem("services", {
            name: serviceValue,
            currencies: accounts.slice(0, 1).map((a) => a.value),
          });
          return;
        }
        const removeIdx = services.findIndex((s) => s.name === serviceValue);
        form.removeListItem("services", removeIdx);
      }}
      key={form.key(`services.${idx}`)}
    >
      <Stack align="flex-start">
        <ThemeIcon
          color="var(--prune-text-gray-500)"
          radius={4}
          variant="light"
        >
          <Icon size={16} />
        </ThemeIcon>
        <Text className={classes.label}>{title}</Text>
        <Text className={classes.description}>{description}</Text>

        <SimpleGrid cols={2}>
          {accounts.map((account, index) => (
            <Checkbox
              key={form.key(`services.${idx}.currencies.${index}`)}
              label={account.label}
              onClick={(e) => e.stopPropagation()}
              checked={Boolean(
                form
                  .getValues()
                  .services.find((s) => s.name === serviceValue)
                  ?.currencies?.includes(account.value)
              )}
              onChange={(e) => {
                const { services } = form.getValues();
                const removeIdx = services.findIndex(
                  (s) => s.name === serviceValue
                );

                const service = services.find((s) => s.name === serviceValue);

                if (removeIdx === -1)
                  return handleInfo(
                    "Service Required",
                    "Please select a service before choosing a currency."
                  );

                const currentService = services[removeIdx];
                if (!currentService || !Array.isArray(currentService.currencies))
                  return;

                const acctIndex = currentService.currencies.findIndex(
                  (c) => c === account.value
                );

                if (!e.target.checked) {
                  if (currentService.currencies.length <= 1) {
                    form.removeListItem("services", removeIdx);
                    return;
                  }
                  form.removeListItem(`services.${removeIdx}.currencies`, acctIndex);
                  return;
                }

                if (!service) {
                  form.insertListItem(
                    "services",
                    { name: serviceValue, currencies: [account.value] },
                    idx
                  );
                  return;
                }

                form.insertListItem(`services.${removeIdx}.currencies`, account.value);
              }}
              fz={12}
              color="var(--prune-primary-600)"
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Checkbox.Card>
  );
}
