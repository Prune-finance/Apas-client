import {
  Text,
  Modal,
  Flex,
  Button,
  Stack,
  TextInput,
  Select,
  Box,
  PasswordInput,
  ActionIcon,
} from "@mantine/core";
import { IconMail, IconTrash, IconX } from "@tabler/icons-react";

import styles from "./modal.module.scss";
import { UseFormReturnType } from "@mantine/form";
import { newAdmin } from "@/lib/schema";
import { Dispatch, SetStateAction } from "react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

export default function ModalComponent({
  opened,
  close,
  action,
  processing,
  form,
  isEdit,
  setIsEdit,
}: ModalProps) {
  return (
    <Modal
      closeOnClickOutside={!processing}
      opened={opened}
      onClose={() => {
        close();
        setIsEdit(false);
        form.reset();
      }}
      centered
      // withCloseButton={false}
      closeButtonProps={{
        icon: (
          <ActionIcon
            variant="light"
            color="var(--prune-text-gray-400)"
            radius="xl"
          >
            <IconX color="var(--prune-text-gray-600)" size={20} />
          </ActionIcon>
        ),
      }}
      size="lg"
      padding={40}
      title={
        <Flex direction="column">
          <Text fz={24} fw={600}>
            {isEdit ? "Edit User" : "Invite a New User"}
          </Text>
          <Text fz={14} className="grey-400">
            {isEdit
              ? "Update User Details"
              : "Invite a user to collaborate with you."}
          </Text>
        </Flex>
      }
    >
      <Flex className={styles.modal} direction="column">
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

          {!isEdit && (
            <Flex mt={24}>
              <PasswordInput
                classNames={{ input: styles.input, label: styles.label }}
                label="Password"
                placeholder="Enter password"
                flex={1}
                {...form.getInputProps("password")}
              />
            </Flex>
          )}

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
            <SecondaryBtn
              text="cancel"
              fw={600}
              action={() => {
                close();
                form.reset();
              }}
            />

            <PrimaryBtn
              text={isEdit ? "save Changes" : "send Invite"}
              action={() => {
                if (action) {
                  action();
                }
              }}
              loading={processing}
              fw={600}
            />
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
  form: UseFormReturnType<typeof newAdmin>;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
}
