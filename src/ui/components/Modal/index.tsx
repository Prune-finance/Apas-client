import { Text, Modal, Flex, Button, Stack } from "@mantine/core";
import { IconTrash, IconX } from "@tabler/icons-react";

import styles from "./styles.module.scss";

export default function ModalComponent({
  opened,
  close,
  title,
  text,
  icon,
  color,
  customApproveMessage,
  processing,
  action,
}: ModalProps) {
  return (
    <Modal
      closeOnClickOutside={!processing}
      opened={opened}
      onClose={close}
      centered
      withCloseButton={false}
    >
      <Flex className={styles.modal} direction="column">
        <Flex justify="flex-end">
          <div
            className={styles.close__icon}
            onClick={!processing ? close : () => {}}
          >
            <IconX color="#667085" />
          </div>
        </Flex>

        <Flex direction="column" align="center" className={styles.top__flex}>
          <div className={styles.top__flex__icon} style={{ background: color }}>
            {icon}
          </div>

          <Text fz={18} fw={600} mt={25}>
            {title}
          </Text>

          <Text className={styles.sub__text} fz={12} fw={500}>
            {text}
          </Text>
        </Flex>

        <Flex className={styles.bottom__flex} justify="center" gap={15}>
          <Button
            onClick={processing ? () => {} : close}
            color="#D0D5DD"
            variant="outline"
            className={styles.cta}
          >
            Cancel
          </Button>

          <Button
            onClick={action}
            className={styles.cta}
            variant="filled"
            color="#D4F307"
            loading={processing}
          >
            {customApproveMessage || "Proceed"}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}

interface ModalProps {
  opened: boolean;
  close: () => void;
  title: string;
  text: string;
  icon: React.ReactElement;
  color: string;
  customApproveMessage?: string;
  action?: () => void;
  processing?: boolean;
}
