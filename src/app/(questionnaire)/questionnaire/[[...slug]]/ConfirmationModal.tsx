import { PrimaryBtn } from "@/ui/components/Buttons";
import { Flex, Modal, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        push("/questionnaire");
        close();
      }}
      withCloseButton={false}
      size="xl"
      padding={32}
      centered
    >
      <Stack gap={24} align="center">
        <Image
          src="/request-recieved.gif"
          alt="Request received"
          width={200}
          height={160}
          unoptimized
        />

        <Stack gap={12} w="100%">
          <Text
            fz={{ base: 20, lg: 24 }}
            fw={700}
            c="var(--prune-text-gray-700)"
            ta="center"
          >
            We have received your request
          </Text>
          <Text
            fz={{ base: 14, lg: 16 }}
            fw={400}
            c="var(--prune-text-gray-700)"
            ta="center"
          >
            You will get a feedback from us about the state of your request.
          </Text>
        </Stack>

        <Flex justify="end" w="100%">
          <PrimaryBtn
            text="Okay"
            action={() => {
              close();
              push("/questionnaire");
            }}
            fw={600}
          />
        </Flex>
      </Stack>
    </Modal>
  );
}
