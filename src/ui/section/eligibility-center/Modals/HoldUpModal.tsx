"use client";

import { Flex, Modal, Text } from "@mantine/core";
import { PrimaryBtn } from "@/ui/components/Buttons";

interface HoldUpModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function HoldUpModal({ opened, onClose }: HoldUpModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={480}
      centered
      title={
        <Text fz={20} fw={700} c="#344054" style={{ fontFamily: "'EksellDisplay', serif" }}>
          Hold up!!!
        </Text>
      }
    >
      <Text fz={16} c="#344054" lh={1.5} mb={24}>
        {`You haven't approved this business' documents. You need to approve them before being able to activate this business.`}
      </Text>
      <Flex justify="flex-end">
        <PrimaryBtn text="Okay" fw={600} fz={14} action={onClose} />
      </Flex>
    </Modal>
  );
}
