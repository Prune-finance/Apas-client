import { Paper, Flex, Group, NativeSelect, Text } from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";

import styles from "./styles.module.scss";

import { AreaChartComponent, BarChartComponent } from "@/ui/components/Charts";
import { Dispatch, SetStateAction } from "react";

interface LineData {
  month: string;
  Inflow: number;
  Outflow: number;
}

type Props = {
  setChartFrequency: Dispatch<SetStateAction<string>>;
  lineData: LineData[];
};
export default function TransactionStatistics({
  setChartFrequency,
  lineData,
}: Props) {
  return (
    <Paper style={{ border: "1px solid #f5f5f5" }} p={20} pl={40}>
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
      {/* <AreaChartComponent
        h={250}
        mt={30}
        curveType="bump"
        data={lineData}
        dataKey="month"
        series={[
          { name: "Inflow", color: "#D5E855" },
          { name: "Outflow", color: "#D92D20" },
        ]}
      /> */}

      <BarChartComponent
        h={250}
        mt={30}
        data={lineData}
        dataKey="month"
        series={[
          { name: "Inflow", color: "#D5E855" },
          { name: "Outflow", color: "#D92D20" },
        ]}
      />
    </Paper>
  );
}
