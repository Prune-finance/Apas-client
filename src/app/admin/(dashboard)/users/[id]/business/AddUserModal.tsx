import { Text, Modal, Flex, TextInput, Box } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

import styles from "./modal.module.scss";
import { UseFormReturnType } from "@mantine/form";
import { newAdmin } from "@/lib/schema";
import { Dispatch, SetStateAction } from "react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";

import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";

export default function AddUserModal({
  opened,
  close,
  action,
  processing,
  form,
  isEdit,
  setIsEdit,
  text,
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
      closeButtonProps={{
        ...closeButtonProps,
      }}
      size="lg"
      padding={40}
      title={
        <Flex direction="column">
          <Text fz={24} fw={600}>
            {isEdit ? "Edit User Permission" : "Invite a New User"}
          </Text>
          <Text fz={14} className="grey-400">
            {text
              ? text
              : isEdit
              ? "Edit this user permission details"
              : "Invite a member to collaborate with the team."}
          </Text>
        </Flex>
      }
    >
      <Flex className={styles.modal} direction="column">
        <Box
          className={styles.form__container}
          component="form"
          onSubmit={form.onSubmit(() => action && action())}
        >
          <Flex mb={24}>
            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              // label="Email"
              placeholder="Email"
              flex={1}
              {...form.getInputProps("email")}
              rightSection={<IconMail color="#667085" size={14} />}
            />
          </Flex>

          <Flex mb={20} mt={40} justify="flex-end" gap={15}>
            <SecondaryBtn
              text="Cancel"
              action={() => {
                close();
                setIsEdit(false);
                form.reset();
              }}
              fw={600}
            />

            <PrimaryBtn
              text={isEdit ? "Save Changes" : "Invite New Member"}
              loading={processing}
              type="submit"
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
  text?: string;
}
