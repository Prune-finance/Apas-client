import {
  Checkbox,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import classes from "./services.module.css";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Icon, IconProps } from "@tabler/icons-react";
import { useQuestionnaireFormContext } from "@/lib/store/questionnaire";

interface ServiceCategory {
  idx: number;
  title: string;
  description: string;
  accounts: string[];
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}
export default function CheckboxCard({
  title,
  description,
  accounts,
  icon,
  idx,
}: ServiceCategory) {
  const Icon = icon;
  const form = useQuestionnaireFormContext();
  const services = form.getValues().services;

  return (
    <Checkbox.Card
      className={classes.root}
      radius="md"
      checked={services.some((service) => service.name === title)}
      onChange={(e) => {
        if (e) {
          form.insertListItem(`services`, {
            name: title,
            currencies: [accounts.at(0)],
          });
          return;
        }

        const removeIdx = services.findIndex(
          (service) => service.name === title
        );
        form.removeListItem("services", removeIdx);
      }}
      key={form.key(`services.${idx}`)}
    >
      <Stack align="flex-start">
        {/* <Checkbox.Indicator /> */}
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
          {accounts.map((item, index) => (
            <Checkbox
              key={form.key(`services.${idx}.currencies.${index}`)}
              label={item}
              // value={item}
              onClick={(e) => e.stopPropagation()}
              checked={Boolean(
                form
                  .getValues()
                  .services.find((service) => service.name === title)
                  ?.currencies?.includes(item)
              )}
              onChange={(e) => {
                const { services } = form.getValues();
                const removeIdx = services.findIndex(
                  (service) => service.name === title
                );
                const service = services.find((s) => s.name === title);
                const acctIndex = services[removeIdx].currencies.findIndex(
                  (acct) => acct === item
                );

                if (!e.target.checked) {
                  if (services[removeIdx].currencies.length <= 1) {
                    form.removeListItem("services", removeIdx);

                    return;
                  }
                  form.removeListItem(
                    `services.${removeIdx}.currencies`,
                    acctIndex
                  );
                  return;
                }

                if (!service) {
                  form.insertListItem(
                    `services`,
                    { name: title, currencies: [item] },
                    idx
                  );

                  return;
                }

                form.insertListItem(`services.${removeIdx}.currencies`, item);
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
