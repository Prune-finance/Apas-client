import { Stack, Text } from "@mantine/core";
import React from "react";

interface HeaderProps {
  title: string;
  subtitle: string;
  customTitleSize?: number;
  customSubtitleSize?: number;
}

export const HeaderAndSubtitle = ({
  title,
  subtitle,
  customSubtitleSize,
  customTitleSize,
}: HeaderProps) => {
  return (
    <Stack gap={4} mb={24}>
      <Text
        fz={customTitleSize ? customTitleSize : 20}
        fw={600}
        c="var(--prune-text-gray-700)"
      >
        {title}
      </Text>
      <Text
        fz={customSubtitleSize ? customSubtitleSize : 14}
        fw={400}
        c="var(--prune-text-gray-500)"
      >
        {subtitle}
      </Text>
    </Stack>
  );
};
