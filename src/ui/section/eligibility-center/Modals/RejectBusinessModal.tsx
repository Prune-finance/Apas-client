"use client";

import { Flex, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { PrimaryBtn } from "@/ui/components/Buttons";

interface RejectBusinessModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  loading: boolean;
}

export default function RejectBusinessModal({
  opened,
  onClose,
  onSubmit,
  loading,
}: RejectBusinessModalProps) {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleSubmit = async () => {
    await onSubmit(reason);
    setReason("");
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size={560}
      centered
      title={
        <Text fz={20} fw={700} c="#1D2939" style={{ fontFamily: "'EksellDisplay', serif" }}>
          Why are you rejecting this business?
        </Text>
      }
    >
      <Stack gap={16}>
        <Text fz={16} fw={600} c="#344054">Reason for rejecting this business</Text>
        <TextInput
          placeholder="Enter reason"
          value={reason}
          onChange={(e) => setReason(e.currentTarget.value)}
        />
        <Flex justify="flex-end" mt={8}>
          <PrimaryBtn
            text="Reject"
            fw={600}
            fz={14}
            color="#D92D20"
            c="#fff"
            action={handleSubmit}
            loading={loading}
            loaderProps={{ type: "dots" }}
            disabled={!reason.trim()}
          />
        </Flex>
      </Stack>
    </Modal>
  );
}
