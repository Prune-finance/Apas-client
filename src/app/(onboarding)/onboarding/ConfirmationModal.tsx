import { PrimaryBtn } from "@/ui/components/Buttons";
import { Center, Flex, Image, Modal, Stack, Text } from "@mantine/core";
import CompleteIcon from "@/assets/CompleteOnboardingIcon.png";

interface ConfirmationModalProps {
  opened: boolean;
  close: () => void;
}

export default function ConfirmationModal({
  opened,
  close,
}: ConfirmationModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
      }}
      withCloseButton={false}
      padding={24}
      centered
    >
      <Stack gap={24}>
        <Center>
          <Image src={CompleteIcon.src} alt="COmplete icon" w={278} h={156} />
        </Center>
        <Text fz={24} fw={700} c="var(--prune-text-gray-700)">
          We have received your company details
        </Text>
        <Text fz={16} fw={400} c="var(--prune-text-gray-700)">
          We will be in touch regarding your application.
        </Text>

        <Flex justify="end">
          <PrimaryBtn
            text="Okay"
            action={() => {
              close();
            }}
            fw={600}
          />
        </Flex>
      </Stack>
    </Modal>
  );
}
