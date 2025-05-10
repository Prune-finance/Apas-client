import { Flex, Paper, PaperProps, Text } from "@mantine/core";
import { ReactNode } from "react";

interface PaperContainerProps extends PaperProps {
  title: string;
  children: ReactNode;
  actionNode?: ReactNode;
}
export default function PaperContainer({
  title,
  children,
  actionNode,
  ...props
}: PaperContainerProps) {
  return (
    <Paper
      styles={{
        root: {
          border: "1px solid var(--prune-text-gray-200)",
        },
      }}
      withBorder
      px={24}
      py={16}
      {...props}
    >
      <Flex align="center" justify="space-between" mb={30}>
        <Text fz={12} fw={700} c="var(--prune-text-gray-700)" tt="uppercase">
          {title}
        </Text>
        {actionNode}
      </Flex>
      {children}
    </Paper>
  );
}
