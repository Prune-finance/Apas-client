import { Grid, GridCol } from "@mantine/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import FlowChart from "./FlowChart";
import StatusChart from "./StatusChart";
import FlowCard from "./FlowCard";
import StatusCard from "./StatusCard";
import { AccountStatsMeta } from "@/lib/hooks/accounts";
import { UseFormReturnType } from "@mantine/form";
import { FilterType } from "@/lib/schema";
import { usePathname } from "next/navigation";

interface Props {
  frequency: string | null;
  setFrequency: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  accountType: "Issued" | "Payout" | "Business";
  meta: AccountStatsMeta | null;
  form: UseFormReturnType<FilterType>;
  opened: boolean;
  open: () => void;
  close: () => void;
  currency?: string;
  locale?: string;
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

  return (
    <Grid>
      <GridCol span={{ base: 12, md: 7 }}>
        <FlowChart
          balance={meta?.totalAccountBalance || 0}
          frequency={frequency}
          setFrequency={setFrequency}
          accountType={accountType}
          currency={currency}
          locale={locale}
          chartData={
            [
              // { month: "Jan", inflow: 1000, outflow: 500 },
              // { month: "Feb", inflow: 1200, outflow: 600 },
              // { month: "Mar", inflow: 150, outflow: 700 },
              // { month: "Apr", inflow: 1300, outflow: 650 },
              // { month: "May", inflow: 700, outflow: 800 },
              // { month: "Jun", inflow: 1700, outflow: 850 },
              // { month: "Jul", inflow: 600, outflow: 900 },
              // { month: "Aug", inflow: 1900, outflow: 950 },
              // { month: "Sep", inflow: 200, outflow: 1000 },
              // { month: "Oct", inflow: 2100, outflow: 1050 },
              // { month: "Nov", inflow: 220, outflow: 1100 },
              // { month: "Dec", inflow: 500, outflow: 1150 },
            ]
          }
        />
      </GridCol>
      <GridCol span={{ base: 12, md: 5 }}>
        <StatusChart
          title={`Total Number of ${accountType} Account`}
          frequency={frequency}
          setFrequency={setFrequency}
          total={meta?.totalNumberOfAccounts || 0}
          accountType={accountType}
          chartData={[
            {
              name: "Active Account",
              value: meta?.activeAccountCount || 0,
              color: "var(--prune-primary-600)",
            },
            {
              name: "Inactive Account",
              value: meta?.inactiveAccountCount || 0,
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
              total={meta?.totalInflow || 0}
              percentage={0}
              gain
              frequency={frequency}
              currency={currency}
              locale={locale}
            />
          </GridCol>
          <GridCol span={6}>
            <FlowCard
              title="Total Outflow"
              total={meta?.totalOutflow || 0}
              percentage={0}
              frequency={frequency}
              currency={currency}
              locale={locale}
            />
          </GridCol>
        </Grid>
      </GridCol>
      <GridCol span={{ base: 12, md: 5 }}>
        <Grid>
          <GridCol span={6}>
            <StatusCard
              title="Active Account"
              total={meta?.activeAccountCount || 0}
              percentage={0}
              gain
              frequency={frequency}
              viewAction={
                opened && _status === "Active"
                  ? () => handleClose("Active")
                  : () => handleOpen("Active")
              }
            />
          </GridCol>
          <GridCol span={6}>
            <StatusCard
              title="Inactive Account"
              total={meta?.inactiveAccountCount || 0}
              percentage={0}
              frequency={frequency}
              viewAction={
                opened && _status === "Inactive"
                  ? () => handleClose("Inactive")
                  : () => handleOpen("Inactive")
              }
            />
          </GridCol>
        </Grid>
      </GridCol>
    </Grid>
  );
}
