import { Paper, PaperProps, Text } from "@mantine/core";
import { ReactNode } from "react";

interface PaperContainerProps extends PaperProps {
  title: string;
  children: ReactNode;
}
export default function PaperContainer({
  title,
  children,
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
      <Text
        fz={12}
        fw={700}
        c="var(--prune-text-gray-700)"
        mb={30}
        tt="uppercase"
      >
        {title}
      </Text>
      {children}
    </Paper>
  );
}
