import { Paper, Flex, Group, NativeSelect, Text } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";

import styles from "./styles.module.scss";

import { AreaChartComponent } from "@/ui/components/Charts";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setChartFrequency: Dispatch<SetStateAction<string>>;
};
export default function TransactionStatistics({ setChartFrequency }: Props) {
  const trxStatsData = [
    { name: "Jan", Inflow: undefined, Outflow: undefined },
    { name: "Feb", Inflow: undefined, Outflow: undefined },
    { name: "Mar", Inflow: undefined, Outflow: undefined },
    { name: "Apr", Inflow: undefined, Outflow: undefined },
    { name: "May", Inflow: undefined, Outflow: undefined },
    { name: "Jun", Inflow: undefined, Outflow: undefined },
    { name: "Jul", Inflow: undefined, Outflow: undefined },
    { name: "Aug", Inflow: undefined, Outflow: undefined },
    { name: "Sep", Inflow: undefined, Outflow: undefined },
    { name: "Oct", Inflow: undefined, Outflow: undefined },
    { name: "Nov", Inflow: undefined, Outflow: undefined },
    { name: "Dec", Inflow: undefined, Outflow: undefined },
  ];

  return (
    <Paper withBorder p={20}>
      <Flex justify="space-between" align="center" mb={15}>
        <Text fz={16} fw={600} c="var(--prune-text-gray-800)">
          Transaction Statistics
        </Text>

        <Group>
          {[
            { name: "Inflow", color: "var(--prune-primary-700)" },
            { name: "Outflow", color: "#D92D20" },
          ].map((item, index) => (
            <Group key={index} gap={5}>
              <IconCircleFilled color={item.color} size={14} />
              <Text fz={12}>{item.name}</Text>
            </Group>
          ))}
          <NativeSelect
            classNames={{
              wrapper: styles.select__wrapper,
              input: styles.select__input,
            }}
            onChange={(event) => setChartFrequency(event.currentTarget.value)}
            data={["Monthly", "Weekly"]}
          />
        </Group>
      </Flex>
      <AreaChartComponent
        data={trxStatsData}
        series={[
          { name: "Inflow", color: "var(--prune-primary-700)" },
          { name: "Outflow", color: "#D92D20" },
        ]}
      />
    </Paper>
  );
}
