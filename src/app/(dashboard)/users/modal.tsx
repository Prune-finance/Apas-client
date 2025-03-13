import {
  Text,
  Modal,
  Flex,
  TextInput,
  Select,
  Box,
  Alert,
  Group,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

import styles from "./modal.module.scss";
import { UseFormReturnType } from "@mantine/form";
import { InviteUserType } from "@/lib/schema";
import { Dispatch, SetStateAction } from "react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { HeaderAndSubtitle } from "./HeaderAndSubtitle";
import { useUserRoles } from "@/lib/hooks/roles";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { useDisclosure } from "@mantine/hooks";
import PermissionsModal from "./PermissionsModal";

export default function ModalComponent({
  opened,
  close,
  action,
  processing,
  form,
  isEdit,
  setIsEdit,
  text,
}: ModalProps) {
  const [openedPermission, { open: openPermission, close: closePermission }] =
    useDisclosure(false);
  const { roles } = useUserRoles({ limit: 1000, status: "activate" });

  // Group roles by isApplicationRole and map to the desired format
  const groupedRoles = (roles ?? []).reduce((acc, role) => {
    const group = role.isApplicationRole
      ? "Application Roles"
      : "Created Roles";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push({ value: role.id, label: role.title });
    return acc;
  }, {} as Record<string, { value: string; label: string }[]>);

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
          <Flex gap={20} mb={16}>
            <TextInput
              // label="First name"
              classNames={{ input: styles.input, label: styles.label }}
              placeholder="First Name"
              flex={1}
              {...form.getInputProps("firstName")}
              disabled={isEdit}
            />

            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              // label="Last name"
              placeholder="Last Name"
              flex={1}
              {...form.getInputProps("lastName")}
              disabled={isEdit}
            />
          </Flex>

          <Flex mb={24}>
            <TextInput
              classNames={{ input: styles.input, label: styles.label }}
              // label="Email"
              placeholder="Email"
              flex={1}
              {...form.getInputProps("email")}
              disabled={isEdit}
              rightSection={<IconMail color="#667085" size={14} />}
            />
          </Flex>

          <HeaderAndSubtitle
            title="Assign Role"
            subtitle="Assign and customize permissions"
            customTitleSize={16}
            customSubtitleSize={12}
          />

          <Select
            placeholder="Select Role"
            classNames={{ input: styles.input, label: styles.label }}
            flex={1}
            data={Object.entries(groupedRoles).map(([group, items]) => ({
              group,
              items,
            }))}
            {...form.getInputProps("roles")}
          />

          <Alert
            color="var(--prune-primary-900)"
            fz={12}
            mt={8}
            styles={{
              root: { padding: "0px 10px" },
            }}
            title={
              <Group gap={5}>
                <Text fz={12} fw={500} c="var(--prune-text-gray-700)">
                  Permissions
                </Text>

                <PrimaryBtn
                  text="Click to view and customize permission"
                  variant="transparent"
                  px={0}
                  fz={12}
                  td="underline"
                  c="var(--prune-primary-900)"
                  action={openPermission}
                />
              </Group>
            }
          />

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

      <PermissionsModal
        opened={openedPermission}
        close={closePermission}
        form={form}
        roles={roles ?? []}
      />
    </Modal>
  );
}

interface ModalProps {
  opened: boolean;
  close: () => void;
  action?: () => void;
  processing?: boolean;
  form: UseFormReturnType<InviteUserType>;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  text?: string;
}
