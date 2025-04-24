"use client";

import { Box, Flex, Paper, Timeline, TimelineItem } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import React, { useState } from "react";

export default function Onboarding() {
  const [active, setActive] = useState(1);
  return (
    <Box>
      <Flex>
        <Paper p={40} radius="md" w={364} h="calc(100vh - 110px)" bg="#EAECF0">
          <Timeline
            active={active}
            bulletSize={24}
            lineWidth={2}
            color="var(--prune-primary-700)"
            // styles={(theme) => ({
            //   item: {
            //     "&[data-active]": {
            //       backgroundColor: "var(--prune-primary-200)",
            //       color: "#fff",
            //     },
            //     "&[data-completed]": {
            //       backgroundColor: "var(--prune-primary-700)",
            //       color: "#fff",
            //     },
            //   },
            //   itemIcon: {
            //     "&[data-active]": {
            //       backgroundColor: "var(--prune-primary-700)",
            //       color: "#fff",
            //     },
            //     "&[data-completed]": {
            //       backgroundColor: "var(--prune-primary-700)",
            //       color: "#fff",
            //     },
            //   },
            // })}
          >
            {timelines.map((item, index) => (
              <TimelineItem
                title={item}
                key={index}
                bg="transparent"
                bullet={
                  <IconPointFilled
                    color={
                      active <= index ? "var(--prune-primary-700)" : "dimmed"
                    }
                  />
                }
              />
            ))}
          </Timeline>
        </Paper>
      </Flex>
    </Box>
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
