import { Grid, GridCol } from "@mantine/core";
import React, { useState } from "react";
import FlowChart from "./FlowChart";

export default function AccountInfoCards() {
  const [frequency, setFrequency] = useState<string | null>("Monthly");

  return (
    <Grid>
      <GridCol span={{ base: 12, md: 8 }}>
        <FlowChart
          balance={230000}
          frequency={frequency}
          setFrequency={setFrequency}
          chartData={[
            { month: "Jan", inflow: 1000, outflow: 500 },
            { month: "Feb", inflow: 1200, outflow: 600 },
            { month: "Mar", inflow: 1500, outflow: 700 },
            { month: "Apr", inflow: 1300, outflow: 650 },
            { month: "May", inflow: 1600, outflow: 800 },
            { month: "Jun", inflow: 1700, outflow: 850 },
            { month: "Jul", inflow: 1800, outflow: 900 },
            { month: "Aug", inflow: 1900, outflow: 950 },
            { month: "Sep", inflow: 2000, outflow: 1000 },
            { month: "Oct", inflow: 2100, outflow: 1050 },
            { month: "Nov", inflow: 2200, outflow: 1100 },
            { month: "Dec", inflow: 2300, outflow: 1150 },
          ]}
        />
      </GridCol>
      <GridCol span={{ base: 12, md: 4 }}>
        <div>Card 2</div>
      </GridCol>
      <GridCol span={{ base: 12, md: 8 }}>
        <div>Card 3</div>
      </GridCol>
      <GridCol span={{ base: 12, md: 4 }}>
        <div>Card 4</div>
      </GridCol>
    </Grid>
  );
}
