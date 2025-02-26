import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { Box, Divider, Modal, ModalProps, Text } from "@mantine/core";
import { extend } from "dayjs";

interface ModalProviderProps extends ModalProps {
  opened: boolean;
  close: () => void;
  title: string;
  children: React.ReactNode;
}
export default function ModalProvider({
  opened,
  close,
  title,
  children,
  ...props
}: ModalProviderProps) {
  return (
    <Modal
      {...props}
      opened={opened}
      onClose={close}
      title={
        <Text fw={700} fz={40} c="var(--prune-text-gray-700)" ml={28}>
          {title}
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
      padding={0}
    >
      <Divider color="var(--prune-text-gray-200)" mb={24} />
      <Box px={28}>{children}</Box>
    </Modal>
  );
}
