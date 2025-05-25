import { Paper, PaperProps } from "@mantine/core";

interface CustomPaperProps extends PaperProps {
  children: React.ReactNode;
}

export const CustomPaper = ({ children, ...props }: CustomPaperProps) => {
  return (
    <Paper p={40} radius="md" bg="#FCFCFD">
      {children}
    </Paper>
  );
};
