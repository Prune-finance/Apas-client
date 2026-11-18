import { ActionIcon, Box, Flex, Modal, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { AdminRole, isRoleActive } from "@/lib/hooks/adminRoles";

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
      size={400}
      padding={24}
    >
      <Flex align="center" justify="center" direction="column" gap={8}>
        <Text fz={18} fw={600} c="#000">
          {deactivating ? "Deactivate" : "Activate"} Role
        </Text>

        <Text fz={12} fw={400} c="#667085" ta="center">
          {deactivating ? (
            <>
              You are about to deactivate the{" "}
              <b style={{ textTransform: "capitalize" }}>{role?.title}</b> role.
              Admins assigned to this role will lose the access it grants.
            </>
          ) : (
            <>
              You are about to reactivate the{" "}
              <b style={{ textTransform: "capitalize" }}>{role?.title}</b> role.
              It will be available to assign to admins again.
            </>
          )}
        </Text>

        {deactivating && (
          <Box
            bg="#FBFEE6"
            p={8}
            mt={8}
            style={{ border: "1px solid #C1DD06" }}
          >
            <Text fz={12} fw={500} c="#667085" ta="center">
              You can reactivate it any time. Filter the roles list by{" "}
              <span style={{ color: "#97AD05", textDecoration: "underline" }}>
                Deactivated
              </span>{" "}
              to find it.
            </Text>
          </Box>
        )}
      </Flex>

      <Flex mb={8} mt={30} justify="center" align="center" w="100%" gap={15}>
        <SecondaryBtn text="Cancel" action={close} fullWidth />

        <PrimaryBtn
          text={deactivating ? "Yes, Deactivate" : "Yes, Activate"}
          fullWidth
          action={onConfirm}
          loading={processing}
        />
      </Flex>
    </Modal>
  );
}
