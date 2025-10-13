import {
  Paper,
  Flex,
  Group,
  NativeSelect,
  Text,
  Skeleton,
} from "@mantine/core";
import { IconCircleFilled } from "@tabler/icons-react";

import styles from "./styles.module.scss";

import { AreaChartComponent, BarChartComponent } from "@/ui/components/Charts";
import { Dispatch, SetStateAction } from "react";
import { useQueryState } from "nuqs";
import { Currency } from "@/lib/interface/currency";
import React from "react";

interface LineData {
  month: string;
  Inflow: number;
  Outflow: number;
}

type Props = {
  setChartFrequency: Dispatch<SetStateAction<string>>;
  lineData: LineData[];
  currency?: Currency;
  loading?: boolean;
};
export default function TransactionStatistics({
  setChartFrequency,
  lineData,
  currency,
  loading,
}: Props) {
  const [period, setPeriod] = useQueryState("period", {
    defaultValue: "Monthly",
  });

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
            value={period}
            onChange={(event) => {
              setPeriod(event.currentTarget.value);
            }}
            data={["Daily", "Weekly", "Monthly", "Yearly"]}
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
      {loading ? (
        <Skeleton h={232} />
      ) : (
        <BarChartComponent
          h={250}
          mt={30}
          data={lineData}
          dataKey="month"
          series={[
            { name: "Inflow", color: "#D5E855" },
            { name: "Outflow", color: "#D92D20" },
          ]}
          currency={currency}
        />
      )}
    </Paper>
  );
}
