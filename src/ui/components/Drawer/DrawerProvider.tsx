import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { Box, Divider, Drawer, DrawerProps, Text } from "@mantine/core";

interface DrawerProviderProps extends DrawerProps {
  opened: boolean;
  title: string;
  children: React.ReactNode;
}
export default function ModalProvider({
  opened,

  title,
  children,
  ...props
}: DrawerProviderProps) {
  return (
    <Drawer
      {...props}
      opened={opened}
      //   onClose={close}
      title={
        <Text fw={700} fz={20} c="var(--prune-text-gray-700)" ml={28}>
          {title}
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
      padding={0}
    >
      <Divider color="var(--prune-text-gray-200)" mb={24} />
      <Box px={28}>{children}</Box>
    </Drawer>
  );
}
