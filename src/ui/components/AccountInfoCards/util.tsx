import {
  Badge,
  BadgeProps,
  Card,
  Flex,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { SelectBox } from "../Inputs";

interface ChartHeaderProps {
  title: string;
  value: string | null;
  setValue: Dispatch<SetStateAction<string | null>>;
  accountType: "Issued" | "Payout" | "Business";
  isFlowChart?: boolean;
}

export const ChartHeader = ({
  title,
  value,
  setValue,
  accountType,
  isFlowChart,
}: ChartHeaderProps) => {
  const tooltip = isFlowChart
    ? `Cumulative balance of all ${accountType.toLowerCase()} 
accounts ${accountType === "Payout" ? "created" : "onboarded"}`
    : `Sum total of all ${accountType.toLowerCase()} 
accounts ${accountType === "Payout" ? "created" : "onboarded"}`;

  return (
    <Group justify="space-between" align="start">
      <Group gap={11}>
        <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
          {title}
        </Text>

        <Tooltip label={tooltip}>
          <ThemeIcon
            variant="transparent"
            size={18}
            color="var(--prune-text-gray-500)"
            style={{ cursor: "pointer" }}
          >
            <IconInfoCircle />
          </ThemeIcon>
        </Tooltip>
      </Group>

      <SelectBox
        value={value}
        onChange={setValue}
        data={["Weekly", "Monthly", "Yearly"]}
      />
    </Group>
  );
};

interface LegendBadgeProps extends BadgeProps {
  title: string;
}

export const LegendBadge = ({ title, ...props }: LegendBadgeProps) => {
  return (
    <Badge
      variant="dot"
      fz={10}
      c="var(--prune-text-gray-400)"
      style={{ border: "none" }}
      tt="capitalize"
      size="lg"
      px={0}
      {...props}
    >
      {title}
    </Badge>
  );
};

interface ThisMonthProps {
  percentage: number;
  gain?: boolean;
  frequency?: string | null;
}

export const ThisMonth = ({ percentage, gain, frequency }: ThisMonthProps) => {
  return (
    <Flex align="center" gap={8}>
      <Badge
        variant="light"
        color={gain ? "#027A48" : "#D92D20"}
        tt="capitalize"
        fz={10}
      >
        {gain ? "+" : "-"}
        {percentage}%
      </Badge>
      <Text fz={10} fw={400} c="var(--prune-text-gray-400)">
        This{" "}
        {frequency
          ? FREQUENCY_OPTIONS[frequency as keyof typeof FREQUENCY_OPTIONS]
          : "Month"}
      </Text>
    </Flex>
  );
};

export const AccountCustomCard = ({ children }: { children: ReactNode }) => {
  return (
    <Card
      withBorder
      radius={4}
      h="100%"
      p="16px 16px 16px 16px"
      style={{ border: "1px solid var(--prune-text-gray-100)" }}
    >
      {children}
    </Card>
  );
};

const FREQUENCY_OPTIONS = {
  Weekly: "Week",
  Monthly: "Month",
  Yearly: "Year",
};
