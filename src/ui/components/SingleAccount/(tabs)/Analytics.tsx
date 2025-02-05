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
import { Dispatch, SetStateAction, useMemo } from "react";
import { TransactionType } from "@/lib/hooks/transactions";
import dayjs from "dayjs";

interface Props {
  setChartFrequency: Dispatch<SetStateAction<string>>;
  transactions: TransactionType[];
}

export const Analytics = ({ setChartFrequency, transactions }: Props) => {
  /**
   * This useMemo hook is used to calculate the total inflow and outflow of transactions for each month. The transactions are grouped by month and the inflow and outflow of each transaction is calculated and stored in an array of objects with the month, inflow and outflow as the keys.
   * @returns {Array} - An array of objects with the month, inflow and outflow as the keys
   */
  const lineData = useMemo(() => {
    const arr: {
      month: string;
      Inflow: number;
      Outflow: number;
    }[] = [];

    transactions.map((trx) => {
      let successful = 0,
        pending = 0,
        failed = 0;

      const month = dayjs(trx.createdAt).format("MMM DD");
      trx.status === "PENDING"
        ? (pending += trx.amount)
        : (successful += trx.amount);

      const creditBal = trx.type === "CREDIT" ? trx.amount : 0;
      const debitBal = trx.type === "DEBIT" ? trx.amount : 0;

      // arr.push({ month, Inflow: 0, Outflow: pending + successful + failed });
      arr.push({ month, Inflow: creditBal, Outflow: debitBal });
      // arr.push({ month, Inflow: 0, Outflow: trx.amount });
    });

    return arr;
  }, [transactions]);

  /**
   * Calculates the inflow and outflow for each month.
   *
   * @param {Array} transactions - The list of transactions.
   * @returns {Array} The inflow and outflow data for each month.
   */
  const monthlyData = useMemo(() => {
    const arr = transactions.reverse().map((trx) => {
      const month = dayjs(trx.createdAt).format("MMM DD");
      const creditBal = trx.type === "CREDIT" ? trx.amount : 0;
      const debitBal = trx.type === "DEBIT" ? trx.amount : 0;

      return { month, Inflow: creditBal, Outflow: debitBal };
    });

    return arr;
  }, [transactions]);

  // const donutData = useMemo(() => {
  //   let completed = 0,
  //     pending = 0,
  //     failed = 0;
  //   transactions.map((trx) => {
  //     trx.status === "PENDING"
  //       ? (pending += trx.amount)
  //       : trx.status === "REJECTED"
  //       ? (failed += trx.amount)
  //       : (completed += trx.amount);
  //   });

  //   return [
  //     { name: "Completed", value: completed, color: "#039855" },
  //     { name: "Pending", value: pending, color: "#F79009" },
  //     { name: "Failed", value: failed, color: "#D92D20" },
  //   ];
  // }, [transactions]);

  /**
   * @description - This is the refactored version of the above code block
   * The above code block is refactored to use the reduce method
   * to calculate the total amount of transactions for each status and return an array of objects with the name, value and color of each status
   *
   * @param {Array} transactions - The list of transactions
   * @returns {Array} - An array of objects with the name, value and color of each status
   */

  const donutData = useMemo(() => {
    const { completed, pending, failed } = transactions.reduce(
      (acc, trx) => {
        if (trx.status === "PENDING") {
          acc.pending += trx.amount;
        } else if (trx.status === "REJECTED") {
          acc.failed += trx.amount;
        } else {
          acc.completed += trx.amount;
        }
        return acc;
      },
      { completed: 0, pending: 0, failed: 0 }
    );

    return [
      { name: "Completed", value: completed, color: "#039855" },
      { name: "Pending", value: pending, color: "#F79009" },
      { name: "Failed", value: failed, color: "#D92D20" },
    ];
  }, [transactions]);

  const totalTrxVolume = donutData.reduce((acc, cur) => acc + cur.value, 0);

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
              withLabels={formatNumber(totalTrxVolume, true, "EUR")}
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
                    {formatNumber(item.value, true, "EUR")}
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
