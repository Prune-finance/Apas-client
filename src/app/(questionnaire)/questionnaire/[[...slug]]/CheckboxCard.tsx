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

interface ServiceCategory {
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
}: ServiceCategory) {
  const Icon = icon;
  return (
    <Checkbox.Card className={classes.root} radius="md" value={title}>
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
          {accounts.map((item) => (
            <Checkbox
              key={item}
              label={item}
              value={item}
              fz={12}
              color="var(--prune-primary-600)"
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Checkbox.Card>
  );
}
