import {
  Text,
  Modal,
  Flex,
  Button,
  TextInput,
  Select,
  Box,
} from "@mantine/core";
import { IconMail, IconTrash, IconX } from "@tabler/icons-react";

import styles from "./modal.module.scss";
import { UseFormReturnType } from "@mantine/form";
import { newUser } from "@/lib/schema";

export default function ModalComponent({
  opened,
  close,
  action,
  processing,
  form,
}: ModalProps) {
  return (
    <Modal
      closeOnClickOutside={!processing}
      opened={opened}
      onClose={close}
      centered
      withCloseButton={false}
      size="lg"
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

        <Flex direction="column">
          <Text fz={24} fw={600}>
            Invite a New User
          </Text>
          <Text fz={14} className="grey-400">
            Invite a user to collaborate with you.
          </Text>
        </Flex>

        <Box className={styles.form__container}>
          <Flex gap={20}>
            <TextInput
              label="First name"
              classNames={{ input: styles.input, label: styles.label }}
              placeholder="First Name"
              flex={1}
              {...form.getInputProps("firstName")}
            />

            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              label="Last name"
              placeholder="Last Name"
              flex={1}
              {...form.getInputProps("lastName")}
            />
          </Flex>

          <Flex mt={24}>
            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              label="Email"
              placeholder="Email"
              flex={1}
              {...form.getInputProps("email")}
              rightSection={<IconMail color="#667085" size={14} />}
            />
          </Flex>

          <Flex mt={24}>
            <Select
              placeholder="Role"
              classNames={{ input: styles.input, label: styles.label }}
              flex={1}
              label="Role"
              data={["Admin", "Superadmin"]}
              {...form.getInputProps("role")}
            />
          </Flex>

          <Flex mb={20} mt={40} justify="flex-end" gap={15}>
            <Button
              onClick={close}
              color="#D0D5DD"
              variant="outline"
              className={styles.cta}
            >
              Cancel
            </Button>

            <Button
              onClick={action}
              loading={processing}
              className={styles.cta}
              variant="filled"
              color="#D4F307"
            >
              Send Invite
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Modal>
  );
}

interface ModalProps {
  opened: boolean;
  close: () => void;
  action?: () => void;
  processing?: boolean;
  form: UseFormReturnType<typeof newUser>;
}
