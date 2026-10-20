"use client";

import {
  Alert,
  Box,
  Divider,
  FileButton,
  Flex,
  Loader,
  Modal,
  Progress,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconExclamationMark } from "@tabler/icons-react";
import { FiFileText } from "react-icons/fi";
import Image from "next/image";
import { useState } from "react";
import PDFICON from "@/assets/img/pdf-icon.png";
import { PrimaryBtn } from "@/ui/components/Buttons";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { isAxiosError } from "axios";
import FileDisplay from "@/ui/components/DocumentViewer";

import type { OnboardingProfile, ProfileDocFile } from "./page";

const questAxios = createAxiosInstance("questionnaire");

interface RejectedDocEntry {
  sectionKey: string;
  label: string;
  docId: string;          // current document UUID (used in replace endpoint)
  fileName: string;
  kind: string;
  reason: string;
  fix: string;
}

function collectRejectedDocs(profile: OnboardingProfile): RejectedDocEntry[] {
  const docs: RejectedDocEntry[] = [];

  const add = (
    sectionKey: string,
    label: string,
    doc: ProfileDocFile | null | undefined,
    kind: string
  ) => {
    if (doc?.review?.status === "REJECTED") {
      docs.push({
        sectionKey,
        label,
        docId: doc.id,
        fileName: doc.fileName,
        kind,
        reason: doc.review.reason ?? "",
        fix: doc.review.fix ?? "",
      });
    }
  };

  add("incorporationCertificate", "CAC Certificate", profile.documents.incorporationCertificate, "INCORPORATION_CERTIFICATE");
  add("memart", "Memart", profile.documents.memart, "MEMART");
  add("amlFramework", "AML Compliance Framework", profile.documents.amlFramework, "AML_FRAMEWORK");
  add("operationalLicence", "Operational License", profile.documents.operationalLicence, "OPERATIONAL_LICENCE");

  add("contactPersonIdentity", "Contact Person – Identity Document", profile.contactPerson?.identityDocument, "IDENTITY");
  add("contactPersonPOA", "Contact Person – Proof of Address", profile.contactPerson?.proofOfAddressDocument, "PROOF_OF_ADDRESS");

  if (profile.ceo) {
    add("ceoIdentity", "CEO – Identity Document", profile.ceo.identityDocument, "IDENTITY");
    add("ceoIdentityBack", "CEO – Identity Document (Back)", profile.ceo.identityDocumentBack, "IDENTITY");
    add("ceoPOA", "CEO – Proof of Address", profile.ceo.proofOfAddressDocument, "PROOF_OF_ADDRESS");
  }

  (profile.directors ?? []).forEach((director, i) => {
    add(`director_${i}_identity`, `Director ${i + 1} – Identity Document`, director.identityDocument, "IDENTITY");
    add(`director_${i}_identityBack`, `Director ${i + 1} – Identity Document (Back)`, director.identityDocumentBack, "IDENTITY");
    add(`director_${i}_poa`, `Director ${i + 1} – Proof of Address`, director.proofOfAddressDocument, "PROOF_OF_ADDRESS");
  });

  (profile.shareholders ?? []).forEach((shareholder, i) => {
    add(`shareholder_${i}_identity`, `Shareholder ${i + 1} – Identity Document`, shareholder.identityDocument, "IDENTITY");
    add(`shareholder_${i}_poa`, `Shareholder ${i + 1} – Proof of Address`, shareholder.proofOfAddressDocument, "PROOF_OF_ADDRESS");
  });

  return docs;
}

interface ChangesRequestedScreenProps {
  profile: OnboardingProfile;
  onRefresh: () => void;
  onSuccess: () => void;
}

export default function ChangesRequestedScreen({ profile, onRefresh, onSuccess }: ChangesRequestedScreenProps) {
  const [uploaded, setUploaded] = useState<Set<string>>(new Set());

  const rejectedDocs = collectRejectedDocs(profile);
  const { total = 0, approved = 0, rejected = 0 } = profile.documentReview ?? {};
  const uploadedCount = uploaded.size;
  const remainingCount = rejected - uploadedCount;
  const allUploaded = uploadedCount >= rejected && rejected > 0;

  const handleReplaced = (sectionKey: string) => {
    setUploaded((prev) => { const next = new Set(prev); next.add(sectionKey); return next; });
  };

  const handleSubmit = () => {
    window.location.reload();
  };

  return (
    <Box>
      <Alert
        mb={32}
        color="#D67507"
        p={16}
        variant="outline"
        icon={
          <ThemeIcon radius="xl" size={24} color="#D67507">
            <IconExclamationMark />
          </ThemeIcon>
        }
        styles={{
          root: { background: "#FFF9E6" },
          title: { color: "var(--prune-text-gray-700)", fontSize: "14px", fontWeight: 700 },
        }}
      >
        Some of your documents were not approved
      </Alert>

      {/* Documents card */}
      <Box
        style={{
          borderRadius: 20,
          border: "1px solid #EAECF0",
          overflow: "hidden",
          boxShadow: "0px 4px 8px -2px rgba(23,23,23,0.1), 0px 2px 4px -2px rgba(23,23,23,0.06)",
        }}
      >
        <Flex align="center" justify="space-between" px={24} py={20}>
          <Text fz={24} fw={500} c="var(--prune-text-gray-800)">
            Documents
          </Text>
          <Text fz={16} fw={500} c="#667085">
            {remainingCount > 0
              ? `${remainingCount} document${remainingCount !== 1 ? "s" : ""} left`
              : "All documents uploaded"}
          </Text>
        </Flex>

        <Progress
          value={total > 0 ? ((approved + uploadedCount) / total) * 100 : 0}
          color="var(--prune-primary-700)"
          radius={0}
          size={4}
        />

        <Box px={24} py={24}>
          {rejectedDocs.map((doc, idx) => (
            <RejectedDocRow
              key={doc.sectionKey}
              doc={doc}
              isUploaded={uploaded.has(doc.sectionKey)}
              onReplaced={() => handleReplaced(doc.sectionKey)}
              showDivider={idx < rejectedDocs.length - 1}
            />
          ))}
          {rejectedDocs.length === 0 && (
            <Text fz={14} c="#667085" ta="center" py={16}>
              No rejected documents found.
            </Text>
          )}
        </Box>
      </Box>

      {/* Submit row */}
      <Flex justify="flex-end" mt={24} pt={20} style={{ borderTop: "1px solid #EAECF0" }}>
        <PrimaryBtn
          text="Submit"
          fw={600}
          w={126}
          action={handleSubmit}
          disabled={!allUploaded}
        />
      </Flex>
    </Box>
  );
}

interface RejectedDocRowProps {
  doc: RejectedDocEntry;
  isUploaded: boolean;
  onReplaced: () => void;
  showDivider: boolean;
}

function RejectedDocRow({ doc, isUploaded, onReplaced, showDivider }: RejectedDocRowProps) {
  const { handleError } = useNotification();
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // View state
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [resolving, setResolving] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState("");
  const [resolvedContentType, setResolvedContentType] = useState("");

  const handleReplace = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", doc.kind);
      await questAxios.post(`/business/onboarding/documents/${doc.docId}/replace`, formData);
      setUploadedFileName(file.name);
      onReplaced();
    } catch (error) {
      handleError(
        "Upload failed",
        isAxiosError(error) ? error.response?.data?.message : "Failed to replace document"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleView = async () => {
    if (resolving) return;
    if (resolvedUrl) { openView(); return; }
    setResolving(true);
    try {
      const { data } = await questAxios.get(`/business/onboarding/files/${doc.docId}`);
      setResolvedUrl(data.data.url || "");
      setResolvedContentType(data.data.contentType || "");
    } catch {
      setResolvedUrl("");
    } finally {
      setResolving(false);
      openView();
    }
  };

  return (
    <>
      {isUploaded ? (
        /* ── After upload: show file row with View + Re-upload ── */
        <Box py={4}>
          <Text fz={12} c="#667085" mb={10}>{doc.label}</Text>
          <Flex
            align="center"
            justify="space-between"
            bg="#FCFCFD"
            h={44}
            px={12}
            style={{ borderRadius: 4, border: "1px solid #EAECF0" }}
          >
            <Flex align="center" gap={8} style={{ minWidth: 0, flex: 1 }}>
              <Image src={PDFICON.src} alt="document" width={16} height={16} style={{ flexShrink: 0 }} />
              <Text fz={13} c="#344054" truncate style={{ flex: 1 }}>
                {uploadedFileName || doc.fileName}
              </Text>
            </Flex>

            <Flex align="center" gap={6} style={{ flexShrink: 0 }}>
              <Box px={8} py={2} style={{ borderRadius: 9999, backgroundColor: "#D1FAE5" }}>
                <Text fz={10} fw={600} c="#059669">Uploaded</Text>
              </Box>

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
                  <Text fw={600} fz={10} c="#667085">View</Text>
                )}
              </UnstyledButton>

              <FileButton onChange={handleReplace} accept="image/png,image/jpeg,application/pdf">
                {(props) => (
                  <PrimaryBtn
                    {...props}
                    text="Re-upload"
                    loading={uploading}
                    loaderProps={{ type: "dots" }}
                    fw={600}
                    fz={10}
                    h={28}
                    px={10}
                  />
                )}
              </FileButton>
            </Flex>
          </Flex>
        </Box>
      ) : (
        /* ── Before upload: doc name + Rejected badge + reason + Upload button ── */
        <Flex align="center" gap={16} py={12} justify="space-between">
          <Flex align="center" gap={16} style={{ minWidth: 0, flex: 1 }}>
            {/* File icon */}
            <Box
              p={8}
              style={{ borderRadius: 4, backgroundColor: "#FBFEE6", flexShrink: 0 }}
            >
              <FiFileText size={24} color="#758604" />
            </Box>

            {/* Name + reason */}
            <Box style={{ minWidth: 0 }}>
              <Flex align="center" gap={8} wrap="wrap">
                <Text fz={16} fw={500} c="#344054">{doc.label}</Text>
                <Box
                  px={8}
                  py={4}
                  style={{ borderRadius: 9999, backgroundColor: "#FFF3F0", display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Text fz={12} fw={500} c="#DB340B">Rejected</Text>
                  <Text fz={12} c="#DB340B">×</Text>
                </Box>
              </Flex>
              {(doc.reason || doc.fix) && (
                <Text fz={12} c="#667085" mt={4}>
                  {doc.reason || doc.fix}
                </Text>
              )}
            </Box>
          </Flex>

          {/* Upload button */}
          <FileButton onChange={handleReplace} accept="image/png,image/jpeg,application/pdf">
            {(props) => (
              <PrimaryBtn
                {...props}
                text={uploading ? "" : "Upload new document"}
                loading={uploading}
                loaderProps={{ type: "dots" }}
                fw={600}
                fz={14}
                style={{ flexShrink: 0 }}
              />
            )}
          </FileButton>
        </Flex>
      )}

      {showDivider && <Divider my={8} color="#EAECF0" />}

      <Modal
        opened={viewOpened}
        onClose={closeView}
        size={800}
        centered
        title={<Text fz={14} fw={500}>{uploadedFileName || doc.fileName}</Text>}
      >
        {resolvedUrl ? (
          <FileDisplay fileUrl={resolvedUrl} contentType={resolvedContentType} download={false} />
        ) : (
          <Flex justify="center" align="center" h={200}>
            <Text fz={14} c="#667085">Unable to load document preview.</Text>
          </Flex>
        )}
      </Modal>
    </>
  );
}
