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
import { useSingleAccountStatistics } from "@/lib/hooks/accounts";
import { Currency } from "@/lib/interface/currency";
import { useQueryState } from "nuqs";

interface Props {
  setChartFrequency: Dispatch<SetStateAction<string>>;
  transactions: TransactionType[];
  currencyType?: Currency;
  accountId?: string;
}

export const Analytics = ({
  setChartFrequency,
  transactions,
  currencyType,
  accountId,
}: Props) => {
  // const {
  //   cashFlowData: monthlyData,
  //   donutData,
  //   totalTrxVolume,
  // } = useTrxAnalytics(transactions ?? []);

  const [period, setPeriod] = useQueryState("period", {
    defaultValue: "Monthly",
  });

  const { data, meta, loading } = useSingleAccountStatistics({
    id: accountId || "",
    currency: currencyType || "EUR",
    period: (period?.toLowerCase() as "daily") || "monthly",
  });

  const getColor = (key: string) => {
    switch (key.toLowerCase()) {
      case "completed":
        return "#039855";
      case "failed":
        return "#D92D20";
      default:
        return "#F79009";
    }
  };

  const volumeData = Object.entries(data?.volume || {}).map(([key, value]) => ({
    name: key,
    value,
    color: getColor(key),
  }));

  const totalVolume = volumeData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Grid>
      <GridCol span={8.3}>
        <TransactionStatistics
          setChartFrequency={setChartFrequency}
          // lineData={monthlyData}
          lineData={(data?.statistics || []).map((item) => ({
            month: item.bucket,
            Inflow: item.inflow,
            Outflow: item.outflow,
          }))}
          currency={currencyType}
          loading={loading}
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
                value={period}
                onChange={(event) => {
                  setPeriod(event.currentTarget.value);
                }}
                data={["Daily", "Weekly", "Monthly", "Yearly"]}
              />
            </Flex>
          </Flex>

          <Flex justify="center" my={37} h={150}>
            <DonutChartComponent
              data={
                !totalVolume
                  ? [
                      {
                        name: "No Data",
                        value: 100,
                        color: "var(--prune-text-gray-300)",
                      },
                    ]
                  : volumeData
              }
              startAngle={180}
              endAngle={0}
              withLabels={formatNumber(
                totalVolume,
                true,
                currencyType ?? "EUR"
              )}
            />
          </Flex>

          <Group justify="space-between" px={10} gap={15}>
            {volumeData.map((item, index) => {
              return (
                <Stack
                  key={index}
                  gap={6}
                  pl={9}
                  style={{ borderLeft: `3px solid ${item.color}` }}
                >
                  <Text
                    fz={12}
                    c="var(--prune-text-gray-800)"
                    fw={400}
                    tt="capitalize"
                  >
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
