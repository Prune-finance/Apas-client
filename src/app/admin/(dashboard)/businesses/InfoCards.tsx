import { CardFive } from "@/ui/components/Cards";
import {
  Card,
  CardSection,
  Divider,
  Flex,
  NativeSelect,
  Select,
  Title,
} from "@mantine/core";
import styles from "@/ui/styles/page.module.scss";
import { ReactNode } from "react";

type Details = {
  title: string;
  value: number;
  formatted?: boolean;
};

type InfoCardProps = {
  details: Details[];
  title: string;
  children?: ReactNode;
};

export default function InfoCards({ title, details, children }: InfoCardProps) {
  return (
    <Card withBorder mt={24}>
      <CardSection>
        <Flex justify="space-between" align="center" px={24} pt={24}>
          <Title order={3} fz={16}>
            {title}
          </Title>

          {children}
        </Flex>
        <Divider my={13} />
      </CardSection>

      <Flex justify="space-between">
        {details.map((info, index) => (
          <CardFive
            key={index}
            title={info.title}
            stat={info.value}
            formatted={info.formatted}
            container
            borderRight={index !== details.length - 1}
            flex={1}
          />
        ))}
      </Flex>
    </Card>
  );
}
