import {
  Badge,
  Card,
  CardSection,
  Group,
  Text,
  ThemeIcon,
} from "@mantine/core";
import styles from "./styles.module.scss";
import { GiEuropeanFlag, GiUsaFlag, GiNigeria } from "react-icons/gi";

export const AccountCard = () => {
  return (
    <Card px={19} radius={8} className={styles.account__card}>
      <CardSection
        className={styles.account__card__section}
        px={19}
        py={13}
        c="#fff"
      >
        <Group justify="space-between">
          <Group>
            <ThemeIcon color="#0052B4" radius="xl">
              <GiEuropeanFlag />
            </ThemeIcon>

            <Text>EUR - C80 LIMITED</Text>
          </Group>

          <Badge tt="capitalize" color="#fff" c="#000" fz={10} fw={500}>
            Account
          </Badge>
        </Group>
      </CardSection>
    </Card>
  );
};
