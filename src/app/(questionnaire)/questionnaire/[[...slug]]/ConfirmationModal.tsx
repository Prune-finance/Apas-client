import { PrimaryBtn } from "@/ui/components/Buttons";
import requestReceived from "@/assets/request-recieved.gif";
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
        push("/questionnaire");
        close();
      }}
      withCloseButton={false}
      size="lg"
      padding={32}
      centered
    >
      <Stack gap={24} align="center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={requestReceived.src}
          alt="Request received"
          style={{
            width: 200,
            height: 160,
            objectFit: "contain",
            marginTop: 16,
          }}
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
