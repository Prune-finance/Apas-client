import { Flex, Loader, rem, Text } from "@mantine/core";
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
  PDF_MIME_TYPE,
} from "@mantine/dropzone";
import { UseFormReturnType } from "@mantine/form";
import {
  IconUpload,
  IconX,
  IconCloudUpload,
  IconCloudCheck,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { directorEtShareholderSchema, OtherDocumentType } from "@/lib/schema";
import { RemoveDirectorType } from "@/lib/schema/business";
import { parseError } from "@/lib/actions/auth";
import useNotification from "@/lib/hooks/notification";
import createAxiosInstance from "@/lib/axios";

interface DropzoneCustomProps extends Partial<DropzoneProps> {
  form?: UseFormReturnType<typeof directorEtShareholderSchema>;
  removeDirectorForm?: UseFormReturnType<RemoveDirectorType>;
  otherDocumentForm?: UseFormReturnType<OtherDocumentType>;
  formKey?: string;
}

export default function DropzoneComponent(props: DropzoneCustomProps) {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const { handleError } = useNotification();
  const axios = createAxiosInstance("auth");

  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const form = props.form;
  const formKey = props.formKey;
  const removeDirectorForm = props.removeDirectorForm;
  const otherDocumentForm = props.otherDocumentForm;

  const handleUpload = async () => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(`/admin/upload`, formData);

      if (form) {
        if (!formKey) return;
        form.setFieldValue(formKey, data.data.url);
      }
      if (removeDirectorForm) {
        if (!formKey) return;
        removeDirectorForm.setFieldValue(formKey, data.data.url);
      }
      if (otherDocumentForm) {
        if (!formKey) return;
        otherDocumentForm.setFieldValue(formKey, data.data.url);
      }
      setUploaded(true);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    handleUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <Dropzone
      onDrop={(files) => setFile(files[0])}
      onReject={(files) => console.log("rejected files", files[0])}
      maxSize={5 * 1024 ** 2}
      accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]}
      {...props}
      h={140}
      bg="#FCFCFD"
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="sm"
        // mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>

        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>

        <Dropzone.Idle>
          {processing && (
            <Loader color="rgba(151, 173, 5)" mt={5} size="xl" type="dots" />
          )}

          {uploaded && !processing && (
            <IconCloudCheck
              style={{
                width: rem(52),
                height: rem(52),
                color: "#97AD05",
              }}
              stroke={1.5}
            />
          )}

          {!file && !processing && (
            <IconCloudUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--prune-text-gray-400)",
              }}
              stroke={1.5}
            />
          )}
        </Dropzone.Idle>

        <Flex direction="column" align="center">
          {file && (
            <Text fz={10} inline>
              {file.name}{" "}
              <Text fz={10} td="underline" span c="#97AD05">
                Re-upload
              </Text>
            </Text>
          )}
          {!file && (
            <Text fz={10} inline>
              Drag and drop file to Upload or{" "}
              <Text fz={10} td="underline" span c="#97AD05">
                Browse
              </Text>
            </Text>
          )}
          {!file && (
            <Text fz={9} c="dimmed" inline mt={5}>
              Supported formats: JPEG, PNG, PDF
            </Text>
          )}
        </Flex>
      </Flex>
    </Dropzone>
  );
}
