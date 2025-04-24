import { Timeline, TimelineItem } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import React from "react";
import active from "../(dashboard)/roles/(tabs)/active";
import { CustomPaper } from "./CustomPaper";

interface NavbarProps {
  active: number;
}

export default function Navbar({ active }: NavbarProps) {
  return (
    <CustomPaper
      w={364}
      // h="calc(100vh - 110px)"
      h="100%"
      flex={1}
    >
      <Timeline
        active={active}
        bulletSize={24}
        lineWidth={2}
        color="var(--prune-primary-700)"
        styles={{
          itemBody: {
            height: "40px",
          },
        }}
      >
        {timelines.map((item, index) => (
          <TimelineItem
            title={item}
            key={index}
            bg="transparent"
            bullet={
              <IconPointFilled
              // color={
              //   active <= index ? "var(--prune-primary-700)" : "dimmed"
              // }
              />
            }
          />
        ))}
      </Timeline>
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
