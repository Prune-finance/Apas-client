import {
  Text,
  Modal,
  Flex,
  Button,
  Stack,
  Select,
  Textarea,
} from "@mantine/core";
import { IconTrash, IconX } from "@tabler/icons-react";

import styles from "./styles.module.scss";
import DropzoneComponent from "./dropzone";
import { UseFormReturnType } from "@mantine/form";
import { Dispatch, SetStateAction } from "react";
import { PrimaryBtn, SecondaryBtn } from "../Buttons";

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
  reason,
  setReason,
  addReason,
  size,
  btnBg,
  btnColor,
}: ModalProps) {
  return (
    <Modal
      closeOnClickOutside={!processing}
      opened={opened}
      onClose={close}
      centered
      withCloseButton={false}
      size={size}
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

        <Flex direction="column" className={styles.top__flex} mt={0}>
          <Flex justify="center">
            <div
              className={styles.top__flex__icon}
              style={{ background: color }}
            >
              {icon}
            </div>
          </Flex>

          <Text ta="center" fz={18} fw={600} mt={25} tt="capitalize">
            {title}
          </Text>

          <Text ta="center" className={styles.sub__text} fz={12} fw={500}>
            {text}
          </Text>
        </Flex>

        {addReason && setReason && (
          <Textarea
            minRows={4}
            maxRows={5}
            autosize
            value={reason}
            onChange={(e) => setReason(e.currentTarget.value)}
            placeholder="Give reason here..."
          />
        )}

        <Flex className={styles.bottom__flex} justify="center" gap={15}>
          <SecondaryBtn
            text="Cancel"
            action={processing ? () => {} : close}
            fullWidth
          />

          <PrimaryBtn
            text={customApproveMessage || "Proceed"}
            action={action}
            loading={processing}
            fullWidth
            bg={btnBg ? btnBg : undefined}
            c={btnColor ? btnColor : undefined}
          />
        </Flex>
      </Flex>
    </Modal>
  );
}

const reqValues = {
  reason: "",
  supportingDocumentName: "",
  supportingDocumentUrl: "",
};

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
  reason?: string;
  setReason?: Dispatch<SetStateAction<string>>;
  addReason?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | number;
  btnBg?: string;
  btnColor?: string;
}
