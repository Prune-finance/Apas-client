import { Flex, Group, Loader, rem, Stack, Text } from "@mantine/core";
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
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

import { newBusiness } from "@/lib/schema";

const reqValues = {
  reason: "",
  supportingDocumentName: "",
  supportingDocumentUrl: "",
};

interface DropzoneCustomProps extends Partial<DropzoneProps> {
  form?: UseFormReturnType<typeof reqValues>;
  formKey?: string;
}

export default function DropzoneComponent(props: DropzoneCustomProps) {
  const [file, setFile] = useState<FileWithPath | null>(null);

  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const form = props.form;
  const formKey = props.formKey;

  const handleUpload = async () => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/upload`,
        formData,
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      if (form) {
        if (!formKey) return;
        form.setFieldValue(formKey, data.data.url);
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
      onReject={(files) => console.log("rejected files", files[0])}
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
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
                color: "#97AD05",
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
