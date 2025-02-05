import { Grid, GridCol } from "@mantine/core";
import React, { useState } from "react";
import FlowChart from "./FlowChart";
import StatusChart from "./StatusChart";
import FlowCard from "./FlowCard";
import StatusCard from "./StatusCard";

export default function AccountInfoCards() {
  const [frequency, setFrequency] = useState<string | null>("Monthly");

  return (
    <Grid>
      <GridCol span={{ base: 12, md: 7 }}>
        <FlowChart
          balance={230000}
          frequency={frequency}
          setFrequency={setFrequency}
          chartData={[
            { month: "Jan", inflow: 1000, outflow: 500 },
            { month: "Feb", inflow: 1200, outflow: 600 },
            { month: "Mar", inflow: 150, outflow: 700 },
            { month: "Apr", inflow: 1300, outflow: 650 },
            { month: "May", inflow: 700, outflow: 800 },
            { month: "Jun", inflow: 1700, outflow: 850 },
            { month: "Jul", inflow: 600, outflow: 900 },
            { month: "Aug", inflow: 1900, outflow: 950 },
            { month: "Sep", inflow: 200, outflow: 1000 },
            { month: "Oct", inflow: 2100, outflow: 1050 },
            { month: "Nov", inflow: 220, outflow: 1100 },
            { month: "Dec", inflow: 500, outflow: 1150 },
          ]}
        />
      </GridCol>
      <GridCol span={{ base: 12, md: 5 }}>
        <StatusChart
          frequency={frequency}
          setFrequency={setFrequency}
          total={5600}
          chartData={[
            {
              name: "Active Account",
              value: 5000,
              color: "var(--prune-primary-600)",
            },
            {
              name: "Inactive Account",
              value: 600,
              color: "var(--prune-text-gray-200)",
            },
          ]}
        />
      </GridCol>
      <GridCol span={{ base: 12, md: 7 }}>
        <Grid>
          <GridCol span={6}>
            <FlowCard title="Total Inflow" total={23000} percentage={23} gain />
          </GridCol>
          <GridCol span={6}>
            <FlowCard title="Total Outflow" total={100000} percentage={10} />
          </GridCol>
        </Grid>
      </GridCol>
      <GridCol span={{ base: 12, md: 5 }}>
        <Grid>
          <GridCol span={6}>
            <StatusCard
              title="Active Account"
              total={5000}
              percentage={23}
              gain
            />
          </GridCol>
          <GridCol span={6}>
            <StatusCard title="Inactive Account" total={600} percentage={10} />
          </GridCol>
        </Grid>
      </GridCol>
    </Grid>
  );
}
