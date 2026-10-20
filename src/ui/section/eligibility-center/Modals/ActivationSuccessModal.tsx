"use client";

import { Flex, Modal, Text } from "@mantine/core";
import Image from "next/image";
import { PrimaryBtn } from "@/ui/components/Buttons";
import successIcon from "@/assets/activation-success.png";

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
      withCloseButton
      styles={{ header: { paddingBottom: 0 } }}
    >
      <Flex direction="column" align="center" gap={0} pb={8}>
        <Image src={successIcon} alt="" width={142} height={160} />

        <Text fz={24} fw={600} c="#344054" ta="center" mt={8} lh={1.2}>
          Activation link sent successfully
        </Text>

        <Text fz={16} c="#344054" ta="center" lh={1.5} mt={16} mb={24}>
          You have successfully sent an activation link to{" "}
          <Text span fw={700}>{email}.</Text>
        </Text>

        <Flex justify="flex-end" w="100%">
          <PrimaryBtn text="Okay" fw={600} fz={14} action={onClose} />
        </Flex>
      </Flex>
    </Modal>
  );
}
