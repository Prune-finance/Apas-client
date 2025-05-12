import { Text, Modal, Flex, Textarea, Select } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import styles from "./styles.module.scss";
import { UseFormReturnType } from "@mantine/form";
import DropzoneComponent from "@/ui/components/Dropzone";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

export default function RejectModalComponent({
  opened,
  close,
  title,
  text,
  icon,
  color,
  customApproveMessage,
  processing,
  action,
  form,
}: ModalProps) {
  return (
    <Modal
      closeOnClickOutside={!processing}
      opened={opened}
      onClose={close}
      centered
      withCloseButton={false}
      padding={0}
    >
      <Flex className={styles.modal} direction="column">
        <Flex justify="flex-end" mr={20} mt={20}>
          <div
            className={styles.close__icon}
            onClick={!processing ? close : () => {}}
          >
            <IconX color="#667085" size={16} />
          </div>
        </Flex>

        <Flex
          direction="column"
          className={styles.top__flex}
          mt={0}
          px={32}
          mb={32}
        >
          <Flex justify="center">
            <div
              className={styles.top__flex__icon}
              style={{ background: color }}
            >
              {icon}
            </div>
          </Flex>

          <Text ta="center" fz={18} fw={600} mt={25}>
            {title}
          </Text>

          <Text ta="center" className={styles.sub__text} fz={12} fw={500}>
            {text}
          </Text>

          <Textarea
            my={20}
            placeholder="Give reason here..."
            {...form.getInputProps("reason")}
          />

          <Select
            mb={20}
            placeholder="Select Supporting Document (Optional)"
            flex={1}
            data={["Utility Bill"]}
            classNames={{ input: styles.input }}
            size="lg"
            {...form.getInputProps("supportingDocumentName")}
          />

          <DropzoneComponent<typeof reqValues>
            otherForm={form}
            formKey="supportingDocumentUrl"
            uploadedFileUrl={form.values.supportingDocumentUrl}
            isUser
          />
        </Flex>

        <Flex className={styles.bottom__flex} justify="center" gap={15}>
          <SecondaryBtn
            text="Cancel"
            action={processing ? () => {} : close}
            fullWidth
          />

          <PrimaryBtn
            text={customApproveMessage || "Proceed"}
            action={action}
            fullWidth
            loading={processing}
            bg="#D92D20"
            c="#fff"
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
  form: UseFormReturnType<typeof reqValues>;
}
