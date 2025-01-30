import {
  Badge,
  BadgeProps,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import React, { Dispatch, SetStateAction } from "react";
import { SelectBox } from "../Inputs";

interface ChartHeaderProps {
  title: string;
  value: string | null;
  setValue: Dispatch<SetStateAction<string | null>>;
}

export const ChartHeader = ({ title, value, setValue }: ChartHeaderProps) => {
  return (
    <Group justify="space-between" align="start">
      <Group gap={11}>
        <Text fz={12} fw={400} c="var(--prune-text-gray-400)">
          {title}
        </Text>

        <Tooltip label="Tooltip">
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
}

export const ThisMonth = ({ percentage, gain }: ThisMonthProps) => {
  return (
    <Group gap={8}>
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
        This Month
      </Text>
    </Group>
  );
};
