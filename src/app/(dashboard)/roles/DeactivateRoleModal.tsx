import { SecondaryBtn, PrimaryBtn } from "@/ui/components/Buttons";
import { ActionIcon, Box, Flex, Modal, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

interface DeactivateRoleModalProps {
  opened: boolean;
  close: () => void;
  handleDeactivation: () => void;
  processing: boolean;
}
export default function DeactivateRoleModal({
  opened,
  close,
  processing,
  handleDeactivation,
}: DeactivateRoleModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={close}
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
      size={370}
      padding={24}
      title=""
    >
      <Flex align="center" justify="center" direction="column" gap={8}>
        <Text fz={18} fw={600} c="#000">
          Deactivate Role
        </Text>

        <Text fz={12} fw={400} c="#667085" ta="center">
          You are about to deactivate this role from the system, All users
          (Aside the primary account owner) associated with this account will be
          logged out and denied access. click Yes, De-activate to continue.
        </Text>

        <Box bg="#FBFEE6" p={8} style={{ border: "1px solid #C1DD06" }}>
          <Text fz={12} fw={500} c="#667085" ta="center">
            For users to regain access to this account again, go to <br />
            <span style={{ color: "#97AD05", textDecoration: "underline" }}>
              Deactivated Roles
            </span>{" "}
            to re-assign users to a new role.
          </Text>
        </Box>
      </Flex>

      <Flex mb={16} mt={30} justify="center" align="center" w="100%" gap={15}>
        <SecondaryBtn text="Cancel" action={close} fw={600} fullWidth />

        <PrimaryBtn
          text={"Yes Deactivate"}
          type="submit"
          fw={600}
          fullWidth
          action={handleDeactivation}
          loading={processing}
        />
      </Flex>
    </Modal>
  );
}
