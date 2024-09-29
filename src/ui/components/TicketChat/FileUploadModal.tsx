import { FormValues } from "@/app/(dashboard)/payouts/[id]/inquiry/page";
import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Loader,
  Modal,
  rem,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconFile, IconSend, IconTrash } from "@tabler/icons-react";

interface Props {
  opened: boolean;
  close: () => void;
  file: File | null;
  processing: boolean;
  processingMsg: boolean;
  sendMessage: () => void;
  form: UseFormReturnType<FormValues>;
}

export const FileUploadModal = ({
  opened,
  close,
  file,
  processing,
  processingMsg,
  sendMessage,
  form,
}: Props) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Text fz={16} fw={600} c="var(--prune-text-gray-800)" ml={28}>
          File Upload
        </Text>
      }
      closeButtonProps={{ ...closeButtonProps, mr: 28 }}
      padding={0}
      centered
    >
      <Group justify="space-between" px={28}>
        <Group>
          <ActionIcon color="var(--prune-text-gray-800)" variant="transparent">
            <IconFile />
          </ActionIcon>

          <Stack gap={0}>
            <Text fz={14} fw={600}>
              {file?.name}
            </Text>
            <Text fz={10}>{Math.round((file?.size ?? 0) / 1024)} KB</Text>
          </Stack>
        </Group>

        {processing ? (
          <Loader type="oval" color="var(--prune-primary-600)" size="sm" />
        ) : (
          <ActionIcon
            color="var(--prune-text-gray-800)"
            variant="transparent"
            onClick={close}
            style={{ cursor: "pointer" }}
          >
            <IconTrash />
          </ActionIcon>
        )}
      </Group>

      <Divider my={20} />

      <Box
        component="form"
        // px={28}
        mb={28}
        onSubmit={form.onSubmit(() => sendMessage())}
      >
        <TextInput
          placeholder="Type to add your message"
          variant="unstyled"
          px={10}
          {...form.getInputProps("text")}
          flex={1}
          styles={{ input: { height: rem(50), paddingInline: rem(20) } }}
          rightSection={
            processingMsg ? (
              <Loader type="dots" color="var(--prune-primary-600)" size="sm" />
            ) : (
              <ActionIcon
                size={32}
                radius="xl"
                color="var(--prune-primary-600)"
                variant="transparent"
                component="button"
                type="submit"
              >
                <IconSend
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={2}
                />
              </ActionIcon>
            )
          }
        />
      </Box>
    </Modal>
  );
};
