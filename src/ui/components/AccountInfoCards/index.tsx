import { Grid, GridCol, Skeleton } from "@mantine/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import FlowChart from "./FlowChart";
import StatusChart from "./StatusChart";
import FlowCard from "./FlowCard";
import StatusCard from "./StatusCard";
import { AccountStatsMeta } from "@/lib/hooks/accounts";
import { UseFormReturnType } from "@mantine/form";
import { FilterType } from "@/lib/schema";
import { usePathname } from "next/navigation";
import {
  AccountStatistics,
  Currency,
  CurrencyStatsData,
} from "@/lib/interface/currency";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

interface Props {
  frequency: string | null;
  setFrequency: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  accountType: "Issued" | "Payout" | "Business";
  meta: CurrencyStatsData | null;
  form: UseFormReturnType<FilterType>;
  opened: boolean;
  open: () => void;
  close: () => void;
  currency?: string;
  locale?: string;
  stats: AccountStatistics[] | null;
}
export default function AccountInfoCards({
  frequency,
  setFrequency,
  loading,
  accountType,
  meta,
  form,
  opened,
  open,
  close,
  currency,
  locale,
  stats,
}: Props) {
  const pathname = usePathname();
  const [_status, setStatus] = useState<string | null>(null);
  const handleOpen = (status: "Active" | "Inactive") => {
    setStatus(status);
    open();

    form.setFieldValue("status", status);

    window.history.pushState(
      {},
      "",
      `${pathname}?status=${status.toUpperCase()}`
    );
  };

  const handleClose = (status: "Active" | "Inactive") => {
    if (status !== _status) return;
    setStatus(null);
    close();
    form.setFieldValue("status", null);

    window.history.pushState({}, "", pathname);
  };

  const currencyStats = meta?.[currency as Currency];
  const summary = meta?.summary;

  const chartLabel = (frequency: string, interval: Date) => {
    switch (frequency.toLowerCase()) {
      case "weekly":
        return ` Week ${dayjs(interval).week()} in ${dayjs(interval).year()}`;
      case "monthly":
        return dayjs(interval).format("MMM YY");
      case "yearly":
        return dayjs(interval).format("YYYY");
      default:
        return dayjs(interval).format("MMM YY");
    }
  };

  return (
    <Grid>
      <GridCol span={{ base: 12, md: 7 }}>
        <FlowChart
          balance={currencyStats?.totalBalance || 0}
          frequency={frequency}
          setFrequency={setFrequency}
          accountType={accountType}
          currency={currency}
          locale={locale}
          chartData={
            (stats || []).map((item) => ({
              month: chartLabel(frequency || "monthly", item.interval),
              inflow: item.total,
              outflow: 0,
            })) || []
          }
          loading={loading}
        />
      </GridCol>
      <GridCol span={{ base: 12, md: 5 }}>
        <StatusChart
          title={`Total Number of ${accountType} Account`}
          frequency={frequency}
          setFrequency={setFrequency}
          total={currencyStats?.activeAccounts || 0}
          accountType={accountType}
          loading={loading}
          chartData={[
            {
              name: "Active Account",
              value: currencyStats?.activeAccounts || 0,
              color: "var(--prune-primary-600)",
            },
            {
              name: "Inactive Account",
              value:
                (currencyStats?.totalAccounts ?? 0) -
                  (currencyStats?.activeAccounts ?? 0) || 0,
              color: "var(--prune-text-gray-200)",
            },
          ]}
        />
      </GridCol>
      <GridCol span={{ base: 12, md: 7 }}>
        <Grid>
          <GridCol span={6}>
            <FlowCard
              title="Total Inflow"
              total={currencyStats?.inflow || 0}
              percentage={0}
              gain
              frequency={frequency}
              currency={currency}
              locale={locale}
              loading={loading}
            />
          </GridCol>
          <GridCol span={6}>
            <FlowCard
              title="Total Outflow"
              total={currencyStats?.outflow || 0}
              percentage={0}
              frequency={frequency}
              currency={currency}
              locale={locale}
              loading={loading}
            />
          </GridCol>
        </Grid>
      </GridCol>
      <GridCol span={{ base: 12, md: 5 }}>
        <Grid>
          <GridCol span={6}>
            <StatusCard
              title="Active Account"
              total={currencyStats?.activeAccounts || 0}
              percentage={0}
              gain
              frequency={frequency}
              viewAction={
                opened && _status === "Active"
                  ? () => handleClose("Active")
                  : () => handleOpen("Active")
              }
              loading={loading}
            />
          </GridCol>
          <GridCol span={6}>
            <StatusCard
              title="Inactive Account"
              total={
                (currencyStats?.totalAccounts ?? 0) -
                  (currencyStats?.activeAccounts ?? 0) || 0
              }
              percentage={0}
              frequency={frequency}
              viewAction={
                opened && _status === "Inactive"
                  ? () => handleClose("Inactive")
                  : () => handleOpen("Inactive")
              }
              loading={loading}
            />
          </GridCol>
        </Grid>
      </GridCol>
    </Grid>
  );
}
