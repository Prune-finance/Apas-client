import { formatNumber } from "@/lib/utils";
import {
  AreaChart,
  AreaChartProps,
  BarChart,
  BarChartProps,
  DonutChart,
} from "@mantine/charts";
import { ReactNode } from "react";

type Series = { name: string; color: string };

interface IAreaChartProps extends AreaChartProps {
  data: any;
  h?: number;
  series: Series[];
  withDot?: boolean;
  withLegend?: boolean;
}

export function AreaChartComponent({
  data,
  series,
  withDot,
  withLegend,
  ...props
}: IAreaChartProps) {
  return (
    <AreaChart
      {...props}
      h={props.h ? props.h : 300}
      data={data}
      // dataKey="name"
      dataKey="month"
      series={series}
      // curveType="natural"
      gridAxis="x"
      withLegend={withLegend}
      withGradient
      withDots={withDot}
      valueFormatter={(value) => formatNumber(value, true, "EUR")}
    />
  );
}

type DonutChartProps = {
  data: { name: string; color: string; value: number }[];
  startAngle?: number;
  endAngle?: number;
  withLabels?: ReactNode;
};
export function DonutChartComponent({
  data,
  startAngle,
  endAngle,
  withLabels,
}: DonutChartProps) {
  return (
    <DonutChart
      data={data}
      startAngle={startAngle}
      endAngle={endAngle}
      chartLabel={String(withLabels)}
      tooltipDataSource="segment"
      // size={300}
      styles={{
        label: {
          fontSize: 20,
          fontWeight: 600,
        },
      }}
    />
  );
}

interface LineData {
  month: string;
  Inflow: number;
  Outflow: number;
}

interface GroupedData {
  [key: string]: {
    month: string;
    Inflow: number;
    Outflow: number;
  };
}

interface IBarChartProps extends BarChartProps {
  data: any;
  h?: number;
  series: Series[];
  withDot?: boolean;
  withLegend?: boolean;
}

export function BarChartComponent({
  data,
  series,
  withDot,
  withLegend,
  ...props
}: IBarChartProps) {
  const groupedData = data.reduce(
    (
      acc: GroupedData,
      {
        month,
        Inflow,
        Outflow,
      }: { month: string; Inflow: number; Outflow: number }
    ) => {
      if (!acc[month]) {
        acc[month] = { month, Inflow: 0, Outflow: 0 };
      }
      acc[month].Inflow += Inflow;
      acc[month].Outflow += Outflow;
      return acc;
    },
    {}
  );

  const result: LineData[] = Object.values(groupedData);

  return (
    <BarChart
      h={props.h ? props.h : 300}
      data={result}
      // dataKey="name"
      // dataKey="month"
      series={series}
      // barProps={{ barSize: 20, radius: 3 }}
      // curveType="natural"
      gridAxis="x"
      withLegend={withLegend}
      // valueFormatter={(value) => formatNumber(value, true, "EUR")}
      {...props}
    />
  );
}
