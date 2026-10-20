"use client";

import { Flex, Modal, Select, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { PrimaryBtn } from "@/ui/components/Buttons";

const ONBOARDING_REJECTION_REASONS = [
  "Business information is incomplete",
  "Business information is incorrect",
  "Business registration details could not be verified",
  "CAC information does not match submitted information",
  "Business ownership information is incomplete",
  "Director information is incomplete or invalid",
  "Business address could not be verified",
  "Required business documents are missing",
  "Submitted documents contain inconsistent information",
  "Business does not meet eligibility requirements",
  "Business activity does not meet the required criteria",
  "KYC information is incomplete",
  "KYC verification failed",
  "AML requirements have not been satisfied",
  "Required regulatory information is missing",
  "Business details require further clarification",
  "Duplicate business application",
  "Application contains inaccurate information",
  "Application does not meet onboarding requirements",
  "Other",
];

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
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");

  const resolvedReason = selectedReason === "Other" ? otherReason : (selectedReason ?? "");

  const handleClose = () => {
    setSelectedReason(null);
    setOtherReason("");
    onClose();
  };

  const handleSubmit = async () => {
    await onSubmit(resolvedReason);
    setSelectedReason(null);
    setOtherReason("");
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
        <Select
          placeholder="Select a reason"
          data={ONBOARDING_REJECTION_REASONS}
          value={selectedReason}
          onChange={setSelectedReason}
        />
        {selectedReason === "Other" && (
          <TextInput
            label="Please specify"
            placeholder="Enter reason"
            value={otherReason}
            onChange={(e) => setOtherReason(e.currentTarget.value)}
            maxLength={150}
          />
        )}
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
            disabled={!resolvedReason.trim()}
          />
        </Flex>
      </Stack>
    </Modal>
  );
}
