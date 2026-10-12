"use client";

import { useDisclosure } from "@mantine/hooks";
import styles from "./documentPreview.module.scss";
import {
  Box,
  Select,
  UnstyledButton,
  Modal,
  Text,
  Image,
  FileButton,
  Flex,
  Loader,
} from "@mantine/core";
import useNotification from "@/lib/hooks/notification";
import FileDisplay from "@/ui/components/DocumentViewer";
import PDFICON from "@/assets/pdf-icon.png";
import { PrimaryBtn } from "@/ui/components/Buttons";

import { ReactNode, useState } from "react";
import createAxiosInstance from "@/lib/axios";
import { parseError } from "@/lib/actions/auth";
import { BadgeComponent } from "@/ui/components/Badge";
import React from "react";

const authAxios = createAxiosInstance("auth");
const questAxios = createAxiosInstance("questionnaire");

const isUUID = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

type FormKey =
  | "cacCertificate"
  | "amlCompliance"
  | "mermat"
  | "operationalLicense"
  | (string & {});

interface DocumentPreview {
  label: string;
  title: string;
  value?: string;
  type?: string | null;
  editing?: boolean;
  setValue?: (value: string) => void;
  setType?: (value: string | null) => void;
  isUser?: boolean;
  isOnboarding?: boolean;
  showActions?: boolean;
  formKey?: FormKey;
  handleDocumentApproval?: (
    type: "approve" | "reject",
    formKey: FormKey
  ) => void;
  documentStatus?: "APPROVED" | "REJECTED" | null;
  children?: ReactNode;
}

export const DocumentPreview = ({
  label,
  title,
  value,
  editing = false,
  setValue,
  isUser = false,
  isOnboarding = false,
  type,
  setType,
  showActions = false,
  formKey,
  handleDocumentApproval,
  documentStatus,
  children,
}: DocumentPreview) => {
  const [openedFile, { open: openFile, close: closeFile }] = useDisclosure(false);
  const { handleError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string>("");
  const [resolvedFileName, setResolvedFileName] = useState<string>("");
  const [resolvedContentType, setResolvedContentType] = useState<string>("");

  const handleUpload = async (file: File | null) => {
    setLoading(true);
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const entity = isUser ? "auth" : isOnboarding ? "onboarding" : "admin";
      const { data: res } = await authAxios.post(`/${entity}/upload`, formData);
      setValue && setValue(res.data.url);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => {
    if (!value || resolving) return;
    if (!isUUID(value)) {
      setResolvedUrl(value);
      openFile();
      return;
    }
    setResolving(true);
    try {
      const { data } = await questAxios.get(`/business/onboarding/files/${value}`);
      setResolvedUrl(data.data.url || value);
      setResolvedFileName(data.data.fileName || "");
      setResolvedContentType(data.data.contentType || "");
    } catch {
      setResolvedUrl(value);
    } finally {
      setResolving(false);
      openFile();
    }
  };

  const handleDownload = async () => {
    const url = resolvedUrl || value || "";
    if (!url || downloading) return;
    const name = resolvedFileName || title || "document";
    setDownloading(true);
    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`;
      const res = await fetch(proxyUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  if (editing) {
    return (
      <Box flex={1}>
        <Select
          readOnly={false}
          className="Switzer"
          classNames={{
            input: styles.input,
            label: styles.label,
            section: styles.section,
          }}
          leftSection={<Image src={PDFICON.src} alt="pdf-icon" h={16} w={16} />}
          leftSectionPointerEvents="none"
          rightSectionPointerEvents="auto"
          rightSectionWidth={120}
          rightSection={
            <FileButton
              disabled={loading}
              onChange={(file) => handleUpload(file)}
              accept="image/png, image/jpeg, application/pdf"
            >
              {(props) => (
                <PrimaryBtn
                  text="Re-upload"
                  fw={600}
                  action={props.onClick}
                  loading={loading}
                  loaderProps={{ type: "dots" }}
                  {...props}
                />
              )}
            </FileButton>
          }
          label={label}
          placeholder={title}
          data={
            label.includes("Identity Document")
              ? ["ID Card", "Passport", "Residence Permit"]
              : ["Utility Bill"]
          }
          value={type}
          onChange={(value) => setType && setType(value)}
        />
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <Text fz={14} fw={400} c="#667085" mb={10}>
        {label}
      </Text>
      <Flex
        align="center"
        justify="space-between"
        bg="#FCFCFD"
        h={44}
        px={12}
        style={{ borderRadius: 4 }}
      >
        <Flex align="center" gap={8} style={{ minWidth: 0, flex: 1 }}>
          <Image src={PDFICON.src} alt="pdf-icon" h={16} w={16} style={{ flexShrink: 0 }} />
          <Text fz={14} c="#344054" truncate style={{ flex: 1 }}>
            {title || "—"}
          </Text>
        </Flex>

        <Flex align="center" gap={8} style={{ flexShrink: 0 }}>
          {documentStatus && <BadgeComponent status={documentStatus} />}
          {value && (
            <UnstyledButton
              onClick={handleView}
              py={4}
              px={8}
              style={{
                borderRadius: 4,
                backgroundColor: "#D0D5DD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 46,
                cursor: resolving ? "not-allowed" : "pointer",
              }}
            >
              {resolving ? (
                <Loader size={12} color="#667085" type="dots" />
              ) : (
                <Text fw={600} fz={10} c="#667085">
                  View
                </Text>
              )}
            </UnstyledButton>
          )}
        </Flex>
      </Flex>

      <Modal
        opened={openedFile}
        onClose={closeFile}
        size={800}
        centered
        title={
          <Text fz={14} fw={500}>
            {resolvedFileName || title || "Document Preview"}
          </Text>
        }
      >
        <Box>
          <FileDisplay
            fileUrl={resolvedUrl || value || ""}
            contentType={resolvedContentType}
            download={false}
          />
          {children}
          {(resolvedUrl || value) && (
            <Flex justify="flex-end" mt={16}>
              <PrimaryBtn
                text="Download"
                fw={600}
                fz={12}
                action={handleDownload}
                loading={downloading}
                loaderProps={{ type: "dots" }}
              />
            </Flex>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
