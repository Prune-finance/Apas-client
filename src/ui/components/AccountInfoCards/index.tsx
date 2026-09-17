import { Box, Grid, GridCol, LoadingOverlay } from "@mantine/core";
import React, { Dispatch, SetStateAction, useState } from "react";
import FlowChart from "./FlowChart";
import StatusChart from "./StatusChart";
import FlowCard from "./FlowCard";
import StatusCard from "./StatusCard";
import { AccountStatsMeta, StatInterval } from "@/lib/hooks/accounts";
import { UseFormReturnType } from "@mantine/form";
import { FilterType } from "@/lib/schema";
import dayjs from "dayjs";

interface Props {
  frequency: string | null;
  setFrequency: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  accountType: "Issued" | "Payout" | "Business";
  meta: AccountStatsMeta | null;
  statData?: StatInterval[];
  currency?: string;
  form: UseFormReturnType<FilterType>;
  opened: boolean;
  open: () => void;
  close: () => void;
  onStatusFilter?: (status: string | null) => void;
}
export default function AccountInfoCards({
  frequency,
  setFrequency,
  loading,
  accountType,
  meta,
  statData,
  currency = "EUR",
  form,
  opened,
  open,
  close,
  onStatusFilter,
}: Props) {
  const [_status, setStatus] = useState<string | null>(null);

  const handleOpen = (status: "Active" | "Inactive") => {
    setStatus(status);
    open();
    form.setFieldValue("status", status);
    onStatusFilter?.(status.toUpperCase());
    const params = new URLSearchParams(window.location.search);
    params.set("status", status.toUpperCase());
    window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const handleClose = (status: "Active" | "Inactive") => {
    if (status !== _status) return;
    setStatus(null);
    close();
    form.setFieldValue("status", null);
    onStatusFilter?.(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("status");
    const query = params.toString();
    window.history.pushState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} zIndex={10} overlayProps={{ blur: 1 }} />
      <Grid>
        <GridCol span={{ base: 12, md: 7 }}>
          <FlowChart
            balance={meta?.totalAmount || 0}
            frequency={frequency}
            setFrequency={setFrequency}
            accountType={accountType}
            currency={currency}
            chartData={(statData || []).map((item) => ({
              month: dayjs(item.interval).format("MMM YY"),
              inflow: item.total,
              outflow: 0,
            }))}
          />
        </GridCol>
        <GridCol span={{ base: 12, md: 5 }}>
          <StatusChart
            title={`Total Number of ${accountType} Account`}
            frequency={frequency}
            setFrequency={setFrequency}
            total={meta?.totalAccounts || 0}
            accountType={accountType}
            chartData={[
              {
                name: "Active Account",
                value: meta?.activeAccounts || 0,
                color: "var(--prune-primary-600)",
              },
              {
                name: "Inactive Account",
                value: meta?.inactiveAccounts || 0,
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
                currency={currency}
              />
            </GridCol>
            <GridCol span={6}>
              <FlowCard
                title="Total Outflow"
                total={meta?.totalOutflow || 0}
                percentage={0}
                currency={currency}
              />
            </GridCol>
          </Grid>
        </GridCol>
        <GridCol span={{ base: 12, md: 5 }}>
          <Grid>
            <GridCol span={6}>
              <StatusCard
                title="Active Account"
                total={meta?.activeAccounts || 0}
                percentage={0}
                gain
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
                total={meta?.inactiveAccounts || 0}
                percentage={0}
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
    </Box>
  );
}
