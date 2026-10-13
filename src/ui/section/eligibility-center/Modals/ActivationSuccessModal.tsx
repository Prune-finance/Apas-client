"use client";

import { Flex, Modal, Text } from "@mantine/core";
import { PrimaryBtn } from "@/ui/components/Buttons";

interface ActivationSuccessModalProps {
  opened: boolean;
  onClose: () => void;
  email: string;
}

export default function ActivationSuccessModal({
  opened,
  onClose,
  email,
}: ActivationSuccessModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={480}
      centered
      title={
        <Text fz={20} fw={700} c="#344054" style={{ fontFamily: "'EksellDisplay', serif" }}>
          Activation link sent successfully
        </Text>
      }
    >
      <Text fz={16} c="#344054" lh={1.5} mb={24}>
        You have successfully sent an activation link to{" "}
        <Text span fw={700}>{email}.</Text>
      </Text>
      <Flex justify="flex-end">
        <PrimaryBtn text="Okay" fw={600} fz={14} action={onClose} />
      </Flex>
    </Modal>
  );
}
