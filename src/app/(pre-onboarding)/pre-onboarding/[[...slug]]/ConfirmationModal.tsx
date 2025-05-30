import { PrimaryBtn } from "@/ui/components/Buttons";
import { Flex, Modal, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

import React from "react";
interface ConfirmationModalProps {
  opened: boolean;
  close: () => void;
}

export default function ConfirmationModal({
  opened,
  close,
}: ConfirmationModalProps) {
  const { push } = useRouter();

  return (
    <Modal
      opened={opened}
      onClose={() => {
        push("/pre-onboarding");
        close();
      }}
      withCloseButton={false}
      padding={24}
      centered
    >
      <Stack gap={24}>
        <Text fz={24} fw={700} c="var(--prune-text-gray-700)">
          We have received your request
        </Text>
        <Text fz={16} fw={400} c="var(--prune-text-gray-700)">
          You will get a feedback from us about the state of your request.
        </Text>

        <Flex justify="end">
          <PrimaryBtn
            text="Okay"
            action={() => {
              close();
              push("/pre-onboarding");
            }}
            fw={600}
          />
        </Flex>
      </Stack>
    </Modal>
  );
}
