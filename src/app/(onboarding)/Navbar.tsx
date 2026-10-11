import { Box, Stack, Text, Timeline, TimelineItem } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import React from "react";
import { CustomPaper } from "./CustomPaper";

interface NavbarProps {
  active: number;
}

const tips = [
  "Double-check data before submit",
  "Label all uploaded documents",
  "Use clear, high-quality photos",
  "Images uploaded must cover all four edges of document during capture",
];

export default function Navbar({ active }: NavbarProps) {
  return (
    <CustomPaper w={288} p={24} style={{ height: "100%" }}>
      <Timeline
        active={active}
        bulletSize={24}
        lineWidth={2}
        color="var(--prune-primary-700)"
        styles={{ itemBody: { height: "40px" } }}
      >
        {timelines.map((item, index) => (
          <TimelineItem
            title={item}
            key={index}
            bg="transparent"
            bullet={<IconPointFilled />}
          />
        ))}
      </Timeline>

      <Box mt={32} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #D4E157" }}>
        <Box bg="var(--prune-primary-700)" px={16} py={10}>
          <Text fz={12} fw={600} c="#fff">
            Quick Tips
          </Text>
        </Box>
        <Box bg="#FAFFF0" px={16} py={14}>
          <Stack gap={10}>
            {tips.map((tip, i) => (
              <Box key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Text fz={10} c="var(--prune-primary-700)" style={{ flexShrink: 0, marginTop: 1 }}>
                  ✦
                </Text>
                <Text fz={11} c="var(--prune-text-gray-600)" lh={1.5}>
                  {tip}
                </Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </CustomPaper>
  );
}

const timelines = [
  "Business Information",
  "CEO Details",
  "Documents",
  "Add Directors",
  "Add Shareholders",
  "Review",
  "Terms of Use",
];
