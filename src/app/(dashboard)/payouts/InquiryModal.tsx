import { closeButtonProps } from "@/app/admin/(dashboard)/businesses/[id]/(tabs)/utils";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import { camelCaseToTitleCase } from "@/lib/utils";
import { PrimaryBtn } from "@/ui/components/Buttons";
import DropzoneComponent from "@/ui/components/Dropzone";
import { Group, Modal, Paper, Stack, Text, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

interface Props {
  opened: boolean;
  close: () => void;
  type?: "recall" | "query" | "trace";
  pruneRef: string;
  trxId: string;
}

export const InquiryModal = ({
  opened,
  close,
  type,
  pruneRef,
  trxId,
}: Props) => {
  const { handleError, handleSuccess, handleInfo } = useNotification();
  const { push } = useRouter();
  const [processing, setProcessing] = useState(false);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    initialValues,
    validate: zodResolver(schema),
  });

  const handleInquiry = async () => {
    if (form.validate().hasErrors) return;
    setProcessing(true);
    try {
      const { reason, file, extension } = form.values;
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/payout/transactions/${trxId}/${type}`,
        {
          reason,
          ...(file && {
            supportingDocument: file,
            extension,
          }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      const title =
        type === "query"
          ? "Query Created"
          : `${camelCaseToTitleCase(type ?? "")} Initiated`;

      const msg = `You have successfully ${
        type === "query" ? "created" : "initiated"
      } a ${type}. Check under inquiries tab to  track the ${type} status.`;

      push(`/payouts?tab=Inquiries`);
      handleSuccess(title, msg);
      close();
      form.reset();
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

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

      <PrimaryBtn
        text="Submit"
        fw={600}
        fullWidth
        mt={24}
        loading={processing}
        action={handleInquiry}
      />
    </Modal>
  );
};

const initialValues = { reason: "", file: "", extension: "" };

const schema = z.object({
  reason: z.string().min(1, "Reason is required"),
  file: z.string().optional(),
  extension: z.string().optional(),
});
