"use client";

import { Box, Flex, Loader, Modal, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import Image from "next/image";
import PDFICON from "@/assets/pdf-icon.png";
import FileDisplay from "@/ui/components/DocumentViewer";
import { PrimaryBtn } from "@/ui/components/Buttons";
import createAxiosInstance from "@/lib/axios";

const questAxios = createAxiosInstance("questionnaire");

const isUUID = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

interface DocumentViewCardProps {
  /** Label shown above the card */
  label: string;
  /** Document title / fallback file name shown in the card row */
  title: string;
  /**
   * Either a UUID (file ID stored in the questionnaire service)
   * or a direct HTTPS URL.
   */
  fileId?: string | null;
  /**
   * Pass true when this is an admin context so the correct endpoint is used:
   *   admin → /business/onboarding/admin/files/{id}
   *   user  → /business/onboarding/files/{id}
   */
  isAdmin?: boolean;
}

export default function DocumentViewCard({
  label,
  title,
  fileId,
  isAdmin = false,
}: DocumentViewCardProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [resolving, setResolving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState("");
  const [resolvedFileName, setResolvedFileName] = useState("");
  const [resolvedContentType, setResolvedContentType] = useState("");

  if (!fileId) return null;

  const handleView = async () => {
    if (resolving) return;
    // Already resolved — just open
    if (resolvedUrl) {
      open();
      return;
    }
    setResolving(true);
    try {
      if (isUUID(fileId)) {
        const path = isAdmin
          ? `/business/onboarding/admin/files/${fileId}`
          : `/business/onboarding/files/${fileId}`;
        const { data } = await questAxios.get(path);
        setResolvedUrl(data.data.url || fileId);
        setResolvedFileName(data.data.fileName || title);
        setResolvedContentType(data.data.contentType || "");
      } else {
        // Already a URL
        setResolvedUrl(fileId);
        setResolvedFileName(title);
      }
    } catch {
      setResolvedUrl(fileId);
    } finally {
      setResolving(false);
      open();
    }
  };

  const handleDownload = async () => {
    const url = resolvedUrl || fileId || "";
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

  return (
    <Box style={{ minWidth: 200, flex: 1 }}>
      <Text fz={12} c="#667085" mb={8}>
        {label}
      </Text>

      <Flex
        align="center"
        justify="space-between"
        bg="#FCFCFD"
        h={44}
        px={12}
        style={{ borderRadius: 4, border: "1px solid #EAECF0" }}
      >
        <Flex align="center" gap={8} style={{ minWidth: 0, flex: 1 }}>
          <Image
            src={PDFICON.src}
            alt="document"
            width={16}
            height={16}
            style={{ flexShrink: 0 }}
          />
          <Text fz={13} c="#344054" truncate style={{ flex: 1 }}>
            {resolvedFileName || title}
          </Text>
        </Flex>

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
            flexShrink: 0,
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
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        size={800}
        centered
        title={
          <Text fz={14} fw={500}>
            {resolvedFileName || title}
          </Text>
        }
      >
        <FileDisplay
          fileUrl={resolvedUrl || fileId}
          contentType={resolvedContentType}
          download={false}
        />
        {(resolvedUrl || fileId) && (
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
      </Modal>
    </Box>
  );
}
