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

import { directorEtShareholderSchema, OtherDocumentType } from "@/lib/schema";
import { NewBusinessType, RemoveDirectorType } from "@/lib/schema";
import useNotification from "@/lib/hooks/notification";

interface DropzoneCustomProps<T = unknown> extends Partial<DropzoneProps> {
  form?: UseFormReturnType<NewBusinessType>;
  DirectorForm?: UseFormReturnType<typeof directorEtShareholderSchema>;
  removeDirectorForm?: UseFormReturnType<RemoveDirectorType>;
  otherDocumentForm?: UseFormReturnType<OtherDocumentType>;
  formKey?: string;
  extensionKey?: string;
  uploadedFileUrl?: string;
  otherForm?: UseFormReturnType<T>;
  isUser?: boolean;
  isOnboarding?: boolean;
  /** When set, uploads to the questionnaire API (/business/onboarding/files) and stores the returned file ID */
  questionnaireKind?: string;
  /** When set alongside questionnaireKind, uses the admin upload endpoint */
  questionnaireAdminReference?: string;
}

export default function DropzoneComponent<T>(
  props: DropzoneCustomProps<T> = {}
) {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const { handleError } = useNotification();
  const form = props.form;
  const formKey = props.formKey;
  const extensionKey = props.extensionKey;
  const uploadedFileUrl = props.uploadedFileUrl;
  const isUser = props.isUser;
  const isOnboarding = props.isOnboarding;
  const questionnaireKind = props.questionnaireKind;
  const questionnaireAdminReference = props.questionnaireAdminReference;

  function getNestedValue(obj: any, path: string) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  const [uploaded, setUploaded] = useState(
    !!form?.values[formKey as keyof NewBusinessType] || !!uploadedFileUrl
  );
  const [viewUrl, setViewUrl] = useState<string>(
    uploadedFileUrl?.startsWith("http") ? uploadedFileUrl : ""
  );

  // Sync viewUrl when the parent resolves the pre-signed URL (e.g. on initial page load)
  useEffect(() => {
    if (uploadedFileUrl?.startsWith("http")) {
      setViewUrl(uploadedFileUrl);
    }
  }, [uploadedFileUrl]);

  const [processing, setProcessing] = useState(false);

  const handleUpload = async () => {
    setProcessing(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      let storedValue: any;

      if (questionnaireKind) {
        formData.append("kind", questionnaireKind);
        const uploadPath = questionnaireAdminReference
          ? `/business/onboarding/admin/files`
          : `/business/onboarding/files`;
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_QUESTIONNAIRE_URL}${uploadPath}`,
          formData,
          { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
        );
        storedValue = data.data.id;

        // Immediately resolve the pre-signed view URL so the View link appears
        try {
          const viewPath = questionnaireAdminReference
            ? `/business/onboarding/admin/files/${storedValue}`
            : `/business/onboarding/files/${storedValue}`;
          const { data: viewData } = await axios.get(
            `${process.env.NEXT_PUBLIC_QUESTIONNAIRE_URL}${viewPath}`,
            { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
          );
          setViewUrl(viewData?.data?.url || "");
        } catch {
          setViewUrl("");
        }
      } else {
        const path = isUser ? "auth" : isOnboarding ? "onboarding" : "admin";
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/${path}/upload`,
          formData,
          { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
        );
        storedValue = data.data.url;
        setViewUrl(storedValue);
      }

      if (form) {
        if (!formKey) return;
        form.setFieldValue(formKey, storedValue);
      }

      if (props.removeDirectorForm) {
        if (!formKey) return;
        props.removeDirectorForm.setFieldValue(formKey, storedValue);
      }

      if (props.otherDocumentForm) {
        if (!formKey) return;
        props.otherDocumentForm.setFieldValue(formKey, storedValue);
      }

      if (props.DirectorForm) {
        if (!formKey) return;
        props.DirectorForm.setFieldValue(formKey, storedValue);
      }

      if (props.otherForm) {
        if (!formKey) return;
        props.otherForm.setFieldValue(formKey, storedValue);
        if (extensionKey) {
          props.otherForm.setFieldValue(extensionKey, file.type as any);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <Dropzone
      onDrop={(files) => setFile(files[0])}
      onReject={() =>
        handleError("File was rejected", "File must be smaller than 5MB")
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
            <Group gap={6} justify="center" align="center" w="30ch">
              <Text fz={10} truncate="start" style={{ maxWidth: "16ch" }}>
                {file?.name ||
                  (viewUrl || uploadedFileUrl || "")
                    .split("/")
                    .pop()
                    ?.split("?")[0]}
              </Text>
              {viewUrl && (
                <Text
                  fz={10}
                  td="underline"
                  c="#97AD05"
                  component="a"
                  href={viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ cursor: "pointer", pointerEvents: "auto" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  View
                </Text>
              )}
              <Text fz={10} td="underline" c="#97AD05" style={{ pointerEvents: "auto" }}>
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
              Supported formats: JPEG, PNG, PDF · Max size: 5MB
            </Text>
          )}
        </Flex>
      </Flex>
    </Dropzone>
  );
}
