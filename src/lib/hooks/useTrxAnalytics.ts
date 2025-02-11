import { useMemo } from "react";
import { TransactionType } from "./transactions";
import dayjs from "dayjs";

export const useTrxAnalytics = (transactions: TransactionType[]) => {
  /**
   * Calculates the inflow and outflow for each month.
   *
   * @param {Array} transactions - The list of transactions.
   * @returns {Array} The inflow and outflow data for each month.
   */
  const monthlyData = useMemo(() => {
    if (transactions.length === 0) return [];

    const arr = transactions.reverse().map((trx) => {
      const month = dayjs(trx.createdAt).format("MMM DD");
      const creditBal = trx.type === "CREDIT" ? trx.amount : 0;
      const debitBal = trx.type === "DEBIT" ? trx.amount : 0;

      return { month, Inflow: creditBal, Outflow: debitBal };
    });

    return arr;
  }, [transactions]);

  /**
   * @description - This is the refactored version of the above code block
   * The above code block is refactored to use the reduce method
   * to calculate the total amount of transactions for each status and return an array of objects with the name, value and color of each status
   *
   * @param {Array} transactions - The list of transactions
   * @returns {Array} - An array of objects with the name, value and color of each status
   */

  const donutData = useMemo(() => {
    if (transactions.length === 0) return [];

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

  /**
   * @description - This is the refactored version of the above code block
   * The above code block is refactored to use the reduce method
   * to calculate the total amount of transactions for each status and return an array of objects with the name, value and color of each status
   *
   * @param {Array} transactions - The list of transactions
   * @returns {Array} - An array of objects with the name, value and color of each status
   */

  const generateLineData = useMemo(() => {
    if (transactions.length === 0) return [];

    const data = transactions.reverse().reduce((acc, trx) => {
      const date = dayjs(trx.createdAt).format("MMM DD");
      const existingEntry = acc.find((entry) => entry.date === date);

      if (existingEntry) {
        if (trx.status === "PENDING") {
          existingEntry.pending += trx.amount;
        } else if (trx.status === "REJECTED") {
          existingEntry.failed += trx.amount;
        } else {
          existingEntry.successful += trx.amount;
        }
      } else {
        acc.push({
          date,
          successful:
            trx.status === "PENDING"
              ? 0
              : trx.status === "REJECTED"
              ? 0
              : trx.amount,
          failed: trx.status === "REJECTED" ? trx.amount : 0,
          pending: trx.status === "PENDING" ? trx.amount : 0,
        });
      }

      return acc;
    }, [] as { date: string; successful: number; failed: number; pending: number }[]);

    return data;
  }, [transactions]);

  return {
    donutData,
    totalTrxVolume,
    cashFlowData: monthlyData,
    lineData: generateLineData,
  };
};
