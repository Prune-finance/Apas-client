import { ActionIcon, Box, Flex, Modal, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { AdminRole, isRoleActive } from "@/lib/hooks/adminRoles";
import { modalTitleStyle } from "../modalTitle";

interface Props {
  role: AdminRole | null;
  opened: boolean;
  close: () => void;
  onConfirm: () => void;
  processing: boolean;
}

export default function RoleStatusModal({
  role,
  opened,
  close,
  onConfirm,
  processing,
}: Props) {
  const deactivating = role ? isRoleActive(role) : true;

  return (
    <Modal
      opened={opened}
      onClose={close}
      closeOnClickOutside={!processing}
      centered
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
      size={440}
      padding={28}
      title={
        <Text {...modalTitleStyle}>
          {deactivating ? "Deactivate Role" : "Activate Role"}
        </Text>
      }
    >
      <Text fz={14} c="#667085" lh={1.5}>
        {deactivating ? (
          <>
            You are about to deactivate the{" "}
            <b style={{ textTransform: "capitalize" }}>{role?.title}</b> role.
            Admins assigned to it will lose the access it gives them straight
            away.
          </>
        ) : (
          <>
            You are about to activate the{" "}
            <b style={{ textTransform: "capitalize" }}>{role?.title}</b> role.
            Admins assigned to it get its access back, and it can be given to
            admins again.
          </>
        )}
      </Text>

      {deactivating && (
        <Box
          bg="#FBFEE6"
          p={10}
          mt={16}
          style={{ border: "1px solid #C1DD06", borderRadius: 4 }}
        >
          <Text fz={12} fw={500} c="#667085">
            You can activate it again any time. Filter the roles list by{" "}
            <span style={{ color: "#97AD05", fontWeight: 600 }}>
              Deactivated
            </span>{" "}
            to find it.
          </Text>
        </Box>
      )}

      <Flex mt={28} justify="flex-end" gap={12}>
        <SecondaryBtn text="Cancel" action={close} />
        <PrimaryBtn
          text={deactivating ? "Yes, Deactivate" : "Yes, Activate"}
          action={onConfirm}
          loading={processing}
        />
      </Flex>
    </Modal>
  );
}
