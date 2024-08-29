import { Flex, Group, Loader, rem, Stack, Text } from "@mantine/core";
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
  MIME_TYPES,
} from "@mantine/dropzone";
import { UseFormReturnType } from "@mantine/form";
import {
  IconUpload,
  IconX,
  IconPhoto,
  IconCloudUpload,
  IconCloudCheck,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  directorEtShareholderSchema,
  NewBusinessType,
  OtherDocumentType,
  RemoveDirectorType,
} from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";

interface DropzoneCustomProps<T = unknown> extends Partial<DropzoneProps> {
  form?: UseFormReturnType<NewBusinessType>;
  DirectorForm?: UseFormReturnType<typeof directorEtShareholderSchema>;
  removeDirectorForm?: UseFormReturnType<RemoveDirectorType>;
  otherDocumentForm?: UseFormReturnType<OtherDocumentType>;
  formKey?: string;
  uploadedFileUrl?: string;
  otherForm?: UseFormReturnType<T>;
  isUser?: boolean;
}

export default function DropzoneComponent<T>(
  props: DropzoneCustomProps<T> = {}
) {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const { handleError } = useNotification();
  const form = props.form;
  const formKey = props.formKey;
  const uploadedFileUrl = props.uploadedFileUrl;
  const isUser = props.isUser;

  function getNestedValue(obj: any, path: string) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  const [uploaded, setUploaded] = useState(
    !!form?.values[formKey as keyof NewBusinessType] || !!uploadedFileUrl
  );

  const [processing, setProcessing] = useState(false);
  // {{auth-srv}}/v1/auth/upload

  const handleUpload = async () => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const path = isUser ? "auth" : "admin";

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/${path}/upload`,
        formData,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      if (form) {
        if (!formKey) return;
        form.setFieldValue(formKey, data.data.url);
      }

      if (props.removeDirectorForm) {
        if (!formKey) return;
        props.removeDirectorForm.setFieldValue(formKey, data.data.url);
      }

      if (props.otherDocumentForm) {
        if (!formKey) return;
        props.otherDocumentForm.setFieldValue(formKey, data.data.url);
      }

      if (props.DirectorForm) {
        if (!formKey) return;
        props.DirectorForm.setFieldValue(formKey, data.data.url);
      }

      if (props.otherForm) {
        if (!formKey) return;
        props.otherForm.setFieldValue(formKey, data.data.url);
      }

      setUploaded(true);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    handleUpload();
  }, [file]);

  return (
    <Dropzone
      onDrop={(files) => setFile(files[0])}
      onReject={(files) =>
        handleError("File was rejected", files[0].errors[0].message)
      }
      // onReject={(files) => console.log("rejected files", files[0])}
      maxSize={5 * 1024 ** 2}
      // accept={IMAGE_MIME_TYPE}
      accept={[
        MIME_TYPES.png,
        MIME_TYPES.jpeg,
        MIME_TYPES.svg,
        MIME_TYPES.gif,
        MIME_TYPES.pdf,
      ]}
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

          {!uploaded && !processing && (
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
          {uploaded && (
            <Group gap={2} justify="center" align="center" w="30ch">
              <Text
                fz={10}
                // lineClamp={1}
                truncate="start"
                // w="25ch"
                // flex={1}
              >
                {(uploadedFileUrl ?? "").split("/").pop()}
              </Text>
              <Text fz={10} td="underline" c="#97AD05">
                Re-upload
              </Text>
            </Group>
          )}
          {!uploaded && (
            <Text fz={10} inline>
              Drag and drop file to Upload or{" "}
              <Text fz={10} td="underline" span c="#97AD05">
                Browse
              </Text>
            </Text>
          )}
          {!uploaded && (
            <Text fz={9} c="dimmed" inline mt={5}>
              Supported formats: JPEG, PNG, PDF
            </Text>
          )}
        </Flex>
      </Flex>
    </Dropzone>
  );
}
