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

export default function InfoCards() {
  const infoDetails = [
    {
      title: "Total Business",
      value: 0,
    },
    {
      title: "Money In",
      value: 0,
    },
    {
      title: "Money Out",
      value: 0,
    },
    {
      title: "Total Transactions",
      value: 0,
    },
  ];
  return (
    <Card withBorder mt={24}>
      <CardSection>
        <Flex justify="space-between" align="center" px={24} pt={24}>
          <Title order={3} fz={16}>
            Overview
          </Title>

          <Select
            data={["Last Week", "Last Month"]}
            variant="filled"
            placeholder="Last Week"
            defaultValue={"Last Week"}
            w={150}
            // h={22}
            color="var(--prune-text-gray-500)"
            styles={{
              input: {
                outline: "none",
                border: "none",
              },
            }}
          />
        </Flex>
        <Divider my={13} />
      </CardSection>

      <Flex justify="space-between">
        {infoDetails.map((info, index) => (
          <CardFive
            key={index}
            title={info.title}
            stat={info.value}
            formatted={[1, 2].includes(index)}
            container
            borderRight={index !== infoDetails.length - 1}
            flex={1}
          />
        ))}
      </Flex>
    </Card>
  );
}
