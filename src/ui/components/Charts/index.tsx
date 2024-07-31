import { AreaChart, DonutChart } from "@mantine/charts";
import { ReactNode } from "react";
type Series = { name: string; color: string };
type AreaChartProps = {
  data: any;
  h?: number;
  series: Series[];
  withDot?: boolean;
  withLegend?: boolean;
};

export function AreaChartComponent({
  data,
  h,
  series,
  withDot,
  withLegend,
}: AreaChartProps) {
  return (
    <AreaChart
      h={h ? h : 300}
      data={data}
      dataKey="name"
      series={series}
      curveType="natural"
      gridAxis="x"
      withLegend={withLegend}
      withGradient
      withDots={withDot}
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
      styles={{
        label: {
          fontSize: 20,
          fontWeight: 600,
        },
      }}
    />
  );
}
