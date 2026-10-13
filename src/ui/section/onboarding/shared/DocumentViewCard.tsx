"use client";

import { Box, Flex, Loader, Modal, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import Image from "next/image";
import PDFICON from "@/assets/pdf-icon.png";
import FileDisplay from "@/ui/components/DocumentViewer";
import { PrimaryBtn } from "@/ui/components/Buttons";
import createAxiosInstance from "@/lib/axios";
import type { ReviewStatus } from "@/lib/hooks/businesses";

const questAxios = createAxiosInstance("questionnaire");

const isUUID = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

const STATUS_STYLES: Record<ReviewStatus, { bg: string; color: string; label: string }> = {
  PENDING: { bg: "#FEF3C7", color: "#D97706", label: "Pending" },
  APPROVED: { bg: "#D1FAE5", color: "#059669", label: "Approved" },
  REJECTED: { bg: "#FEE2E2", color: "#DC2626", label: "Rejected" },
};

interface DocumentViewCardProps {
  label: string;
  title: string;
  fileId?: string | null;
  isAdmin?: boolean;
  applicationReference?: string;
  applicationStatus?: string;
  reviewStatus?: ReviewStatus | null;
  onReview?: () => void;
}

export default function DocumentViewCard({
  label,
  title,
  fileId,
  isAdmin = false,
  applicationReference,
  applicationStatus,
  reviewStatus,
  onReview,
}: DocumentViewCardProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [resolving, setResolving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState("");
  const [resolvedFileName, setResolvedFileName] = useState("");
  const [resolvedContentType, setResolvedContentType] = useState("");

  if (!fileId) return null;

  const canReview = applicationStatus === "SUBMITTED" && applicationReference && fileId;

  const handleView = async () => {
    if (resolving) return;
    if (resolvedUrl) { open(); return; }
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

  const handleReview = async (action: "approve" | "reject") => {
    if (!applicationReference || !fileId) return;
    if (action === "approve") setApproving(true);
    else setRejecting(true);
    try {
      await questAxios.post(
        `/business/onboarding/admin/${applicationReference}/documents/${fileId}/${action}`
      );
      close();
      onReview?.();
    } catch {
      // silently fail — user can retry
    } finally {
      setApproving(false);
      setRejecting(false);
    }
  };

  const statusStyle = reviewStatus ? STATUS_STYLES[reviewStatus] : null;

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

        <Flex align="center" gap={6} style={{ flexShrink: 0 }}>
          {statusStyle && (
            <Box
              px={8}
              py={2}
              style={{
                borderRadius: 9999,
                backgroundColor: statusStyle.bg,
              }}
            >
              <Text fz={10} fw={600} c={statusStyle.color}>
                {statusStyle.label}
              </Text>
            </Box>
          )}

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
        </Flex>
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        size={800}
        centered
        title={
          <Flex align="center" gap={10}>
            <Text fz={14} fw={500}>
              {resolvedFileName || title}
            </Text>
            {statusStyle && (
              <Box
                px={8}
                py={2}
                style={{ borderRadius: 9999, backgroundColor: statusStyle.bg }}
              >
                <Text fz={10} fw={600} c={statusStyle.color}>
                  {statusStyle.label}
                </Text>
              </Box>
            )}
          </Flex>
        }
      >
        <FileDisplay
          fileUrl={resolvedUrl || fileId}
          contentType={resolvedContentType}
          download={false}
        />
        {(resolvedUrl || fileId) && (
          <Flex justify="flex-end" mt={16} gap={12} wrap="wrap">
            <PrimaryBtn
              text="Download"
              fw={600}
              fz={12}
              action={handleDownload}
              loading={downloading}
              loaderProps={{ type: "dots" }}
            />
            {canReview && (
              <>
                <PrimaryBtn
                  text="Reject"
                  fw={600}
                  fz={12}
                  color="var(--prune-warning)"
                  c="#fff"
                  action={() => handleReview("reject")}
                  loading={rejecting}
                  loaderProps={{ type: "dots" }}
                />
                <PrimaryBtn
                  text="Approve"
                  fw={600}
                  fz={12}
                  action={() => handleReview("approve")}
                  loading={approving}
                  loaderProps={{ type: "dots" }}
                />
              </>
            )}
          </Flex>
        )}
      </Modal>
    </Box>
  );
}
