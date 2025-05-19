import { formatNumber } from "@/lib/utils";
import {
  Grid,
  GridCol,
  Paper,
  Flex,
  NativeSelect,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { DonutChartComponent } from "../../Charts";
import TransactionStatistics from "./TransactionAnalytics";
import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { TransactionType } from "@/lib/hooks/transactions";
import { useTrxAnalytics } from "@/lib/hooks/useTrxAnalytics";

interface Props {
  setChartFrequency: Dispatch<SetStateAction<string>>;
  transactions: TransactionType[];
  currencyType?: string;
}

export const Analytics = ({
  setChartFrequency,
  transactions,
  currencyType,
}: Props) => {
  const {
    cashFlowData: monthlyData,
    donutData,
    totalTrxVolume,
  } = useTrxAnalytics(transactions);

  return (
    <Grid>
      <GridCol span={8.3}>
        <TransactionStatistics
          setChartFrequency={setChartFrequency}
          lineData={monthlyData}
          // lineData={lineData}
        />
      </GridCol>

      <GridCol span={3.7}>
        <Paper
          px="auto"
          style={{ border: "1px solid #f5f5f5" }}
          w="100%"
          h="100%"
          pt={20}
        >
          <Flex px={10} justify="space-between" align="center">
            <Text fz={16} fw={600} tt="capitalize">
              Transaction Volume
            </Text>

            <Flex>
              <NativeSelect
                classNames={{
                  wrapper: styles.select__wrapper,
                  input: styles.select__input,
                }}
                onChange={(event) =>
                  setChartFrequency(event.currentTarget.value)
                }
                data={["Monthly", "Weekly"]}
              />
            </Flex>
          </Flex>

          <Flex justify="center" my={37} h={150}>
            <DonutChartComponent
              data={
                !totalTrxVolume
                  ? [
                      {
                        name: "No Data",
                        value: 100,
                        color: "var(--prune-text-gray-300)",
                      },
                    ]
                  : donutData
              }
              startAngle={180}
              endAngle={0}
              withLabels={formatNumber(
                totalTrxVolume,
                true,
                currencyType ?? "EUR"
              )}
            />
          </Flex>

          <Group justify="space-between" px={10} gap={15}>
            {donutData.map((item, index) => {
              return (
                <Stack
                  key={index}
                  gap={6}
                  pl={9}
                  style={{ borderLeft: `3px solid ${item.color}` }}
                >
                  <Text fz={12} c="var(--prune-text-gray-800)" fw={400}>
                    {item.name}
                  </Text>

                  <Text fz={16} fw={700} c="var(--prune-text-gray-800)">
                    {formatNumber(item.value, true, currencyType ?? "EUR")}
                  </Text>
                </Stack>
              );
            })}
          </Group>
        </Paper>
      </GridCol>
    </Grid>
  );
};
