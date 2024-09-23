import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { PrimaryBtn } from "@/ui/components/Buttons";
import DropzoneComponent from "@/ui/components/Dropzone";
import { Group, Modal, Paper, Stack, Text, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

interface Props {
  opened: boolean;
  close: () => void;
  type?: "recall" | "query" | "trace";
  pruneRef: string;
}

export const InquiryModal = ({ opened, close, type, pruneRef }: Props) => {
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    initialValues,
    validate: zodResolver(schema),
  });

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        form.reset();
      }}
      title={
        <Text tt="capitalize" fz={20} fw={600}>{`${type} Transaction`}</Text>
      }
      centered
      closeButtonProps={{ ...closeButtonProps }}
      padding={40}
    >
      <Paper bg="#fafafa" radius={8} px={16} py={13}>
        <Group justify="space-between" align="flex-start">
          <Text fz={14} c="var(--prune-text-gray-500)">
            Prune Reference
          </Text>
          <Text fz={14} c="var(--prune-text-gray-700)" fw={600}>
            {pruneRef}
          </Text>
        </Group>
      </Paper>

      <Stack gap={10} mt={24}>
        <Text fz={12} c="var(--prune-text-gray-500)">
          Upload Supporting File (optional)
        </Text>
        <DropzoneComponent<FormValues>
          otherForm={form}
          formKey="file"
          extensionKey="extension"
          uploadedFileUrl={form.values.file}
          isUser
        />
      </Stack>

      <Textarea
        minRows={4}
        maxRows={6}
        mt={24}
        autosize
        placeholder="Write Description"
        {...form.getInputProps("reason")}
      />

      <PrimaryBtn text="Submit" fw={600} fullWidth mt={24} />
    </Modal>
  );
};

const initialValues = { reason: "", file: "", extension: "" };

const schema = z.object({
  reason: z.string().min(1, "Reason is required"),
  file: z.string().optional(),
  extension: z.string().optional(),
});
