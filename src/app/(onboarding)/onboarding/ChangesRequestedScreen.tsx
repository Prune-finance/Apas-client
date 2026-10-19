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
import Image from "next/image";
import { useState } from "react";
import PDFICON from "@/assets/pdf-icon.png";
import { PrimaryBtn } from "@/ui/components/Buttons";
import createAxiosInstance from "@/lib/axios";
import useNotification from "@/lib/hooks/notification";
import { isAxiosError } from "axios";
import SubmitOnboardingModal from "@/ui/section/onboarding/shared/SubmitOnboardingModal";
import FileDisplay from "@/ui/components/DocumentViewer";
import type { OnboardingProfile, ProfileDocFile } from "./page";

const questAxios = createAxiosInstance("questionnaire");

interface RejectedDocEntry {
  sectionKey: string;
  label: string;
  docId: string;
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

async function saveAffectedSections(
  profile: OnboardingProfile,
  newFileIds: Record<string, string>
) {
  const companyKeys = ["incorporationCertificate", "memart", "amlFramework", "operationalLicence"];
  const ceoKeys = ["ceoIdentity", "ceoIdentityBack", "ceoPOA"];
  const cpKeys = ["contactPersonIdentity", "contactPersonPOA"];

  if (companyKeys.some((k) => newFileIds[k])) {
    await questAxios.patch("/business/onboarding/sections/3", {
      incorporationCertificateId: newFileIds["incorporationCertificate"] || profile.documents.incorporationCertificate?.id || null,
      memartId: newFileIds["memart"] || profile.documents.memart?.id || null,
      amlFrameworkId: newFileIds["amlFramework"] || profile.documents.amlFramework?.id || null,
      operationalLicenceId: newFileIds["operationalLicence"] || profile.documents.operationalLicence?.id || null,
    });
  }

  if (ceoKeys.some((k) => newFileIds[k]) && profile.ceo) {
    await questAxios.patch("/business/onboarding/sections/2", {
      firstName: profile.ceo.firstName,
      lastName: profile.ceo.lastName,
      email: profile.ceo.email,
      dateOfBirth: profile.ceo.dateOfBirth,
      identityType: profile.ceo.identityType || undefined,
      proofOfAddressType: profile.ceo.proofOfAddressType || undefined,
      identityDocumentId: newFileIds["ceoIdentity"] || profile.ceo.identityDocument?.id || undefined,
      identityDocumentBackId: newFileIds["ceoIdentityBack"] || profile.ceo.identityDocumentBack?.id || undefined,
      proofOfAddressDocumentId: newFileIds["ceoPOA"] || profile.ceo.proofOfAddressDocument?.id || undefined,
    });
  }

  if (cpKeys.some((k) => newFileIds[k])) {
    await questAxios.patch("/business/onboarding/sections/1", {
      contactPerson: {
        firstName: profile.contactPerson.firstName,
        lastName: profile.contactPerson.lastName,
        email: profile.contactPerson.email,
        phoneCountryCode: profile.contactPerson.phoneCountryCode,
        phoneNumber: profile.contactPerson.phoneNumber,
        identityType: profile.contactPerson.identityType || undefined,
        proofOfAddressType: profile.contactPerson.proofOfAddressType || undefined,
        identityDocumentId: newFileIds["contactPersonIdentity"] || profile.contactPerson.identityDocument?.id || undefined,
        proofOfAddressDocumentId: newFileIds["contactPersonPOA"] || profile.contactPerson.proofOfAddressDocument?.id || undefined,
      },
    });
  }

  if (Object.keys(newFileIds).some((k) => k.startsWith("director_"))) {
    await questAxios.patch("/business/onboarding/sections/4", {
      directors: (profile.directors ?? []).map((d, i) => ({
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        dateOfBirth: d.dateOfBirth,
        identityType: d.identityType || undefined,
        proofOfAddressType: d.proofOfAddressType || undefined,
        identityDocumentId: newFileIds[`director_${i}_identity`] || d.identityDocument?.id || undefined,
        identityDocumentBackId: newFileIds[`director_${i}_identityBack`] || d.identityDocumentBack?.id || undefined,
        proofOfAddressDocumentId: newFileIds[`director_${i}_poa`] || d.proofOfAddressDocument?.id || undefined,
      })),
    });
  }

  if (Object.keys(newFileIds).some((k) => k.startsWith("shareholder_"))) {
    await questAxios.patch("/business/onboarding/sections/5", {
      shareholders: (profile.shareholders ?? []).map((s, i) => ({
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        dateOfBirth: s.dateOfBirth,
        identityType: s.identityType || undefined,
        proofOfAddressType: s.proofOfAddressType || undefined,
        identityDocumentId: newFileIds[`shareholder_${i}_identity`] || s.identityDocument?.id || undefined,
        proofOfAddressDocumentId: newFileIds[`shareholder_${i}_poa`] || s.proofOfAddressDocument?.id || undefined,
      })),
    });
  }
}

interface ChangesRequestedScreenProps {
  profile: OnboardingProfile;
  onSuccess: () => void;
}

export default function ChangesRequestedScreen({ profile, onSuccess }: ChangesRequestedScreenProps) {
  const { handleError } = useNotification();
  const [submitOpened, { open: openSubmit, close: closeSubmit }] = useDisclosure(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [newFileIds, setNewFileIds] = useState<Record<string, string>>({});
  const [newFileNames, setNewFileNames] = useState<Record<string, string>>({});

  const rejectedDocs = collectRejectedDocs(profile);
  const { total = 0, approved = 0, rejected = 0 } = profile.documentReview ?? {};
  const uploadedCount = Object.keys(newFileIds).length;
  const remainingCount = rejected - uploadedCount;

  const handleReupload = async (sectionKey: string, kind: string, file: File | null) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [sectionKey]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      const { data } = await questAxios.post("/business/onboarding/files", formData);
      const newId = data.data.id;
      const newName = file.name;
      setNewFileIds((prev) => ({ ...prev, [sectionKey]: newId }));
      setNewFileNames((prev) => ({ ...prev, [sectionKey]: newName }));
    } catch (error) {
      handleError(
        "Upload failed",
        isAxiosError(error) ? error.response?.data?.message : "Failed to upload document"
      );
    } finally {
      setUploading((prev) => ({ ...prev, [sectionKey]: false }));
    }
  };

  const handleSubmitClick = async () => {
    if (Object.keys(newFileIds).length === 0) {
      openSubmit();
      return;
    }
    setSaving(true);
    try {
      await saveAffectedSections(profile, newFileIds);
      openSubmit();
    } catch (error) {
      handleError(
        "Save failed",
        isAxiosError(error) ? error.response?.data?.message : "Failed to save documents"
      );
    } finally {
      setSaving(false);
    }
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
          message: { color: "var(--prune-text-gray-500)", fontSize: "12px", fontWeight: 400 },
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
        {/* Card header */}
        <Flex align="center" justify="space-between" px={24} py={20}>
          <Text fz={24} fw={500} c="var(--prune-text-gray-800)">
            Documents
          </Text>
          <Text fz={16} fw={500} c="#667085">
            {remainingCount > 0 ? `${remainingCount} document${remainingCount !== 1 ? "s" : ""} left` : "All documents uploaded"}
          </Text>
        </Flex>

        {/* Progress bar */}
        <Progress
          value={total > 0 ? ((approved + uploadedCount) / total) * 100 : 0}
          color="var(--prune-primary-700)"
          radius={0}
          size={4}
        />

        {/* Rejected docs list */}
        <Box px={24} py={24}>
          {rejectedDocs.map((doc, idx) => (
            <RejectedDocRow
              key={doc.sectionKey}
              doc={doc}
              uploading={!!uploading[doc.sectionKey]}
              newFileName={newFileNames[doc.sectionKey]}
              newFileId={newFileIds[doc.sectionKey]}
              onReupload={(file) => handleReupload(doc.sectionKey, doc.kind, file)}
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

      {/* Submit button */}
      <Flex justify="flex-end" mt={24} pt={20} style={{ borderTop: "1px solid #EAECF0" }}>
        <PrimaryBtn
          text="Submit"
          fw={600}
          w={126}
          action={handleSubmitClick}
          loading={saving}
          loaderProps={{ type: "dots" }}
        />
      </Flex>

      <SubmitOnboardingModal
        opened={submitOpened}
        close={closeSubmit}
        onSuccess={onSuccess}
      />
    </Box>
  );
}

interface RejectedDocRowProps {
  doc: RejectedDocEntry;
  uploading: boolean;
  newFileName?: string;
  newFileId?: string;
  onReupload: (file: File | null) => void;
  showDivider: boolean;
}

function RejectedDocRow({ doc, uploading, newFileName, newFileId, onReupload, showDivider }: RejectedDocRowProps) {
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [resolving, setResolving] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState("");
  const [resolvedContentType, setResolvedContentType] = useState("");

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

  const displayFileName = newFileName || doc.fileName;
  const isReuploaded = !!newFileId;

  return (
    <>
      <Box py={4}>
        <Text fz={12} c="#667085" mb={10}>
          {doc.label}
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
            <Image src={PDFICON.src} alt="document" width={16} height={16} style={{ flexShrink: 0 }} />
            <Text fz={13} c="#344054" truncate style={{ flex: 1 }}>
              {displayFileName}
            </Text>
          </Flex>

          <Flex align="center" gap={6} style={{ flexShrink: 0 }}>
            {isReuploaded && (
              <Box
                px={8}
                py={2}
                style={{ borderRadius: 9999, backgroundColor: "#D1FAE5" }}
              >
                <Text fz={10} fw={600} c="#059669">Uploaded</Text>
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
                <Text fw={600} fz={10} c="#667085">View</Text>
              )}
            </UnstyledButton>

            <FileButton onChange={onReupload} accept="image/png,image/jpeg,application/pdf">
              {(props) => (
                <UnstyledButton
                  {...props}
                  py={4}
                  px={8}
                  style={{
                    borderRadius: 4,
                    backgroundColor: uploading ? "#E8F5A3" : "var(--prune-primary-700)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: uploading ? "not-allowed" : "pointer",
                    minWidth: 70,
                  }}
                >
                  {uploading ? (
                    <Loader size={12} color="#667085" type="dots" />
                  ) : (
                    <Text fw={600} fz={10} c="#344054">Re-upload</Text>
                  )}
                </UnstyledButton>
              )}
            </FileButton>
          </Flex>
        </Flex>

        {(doc.reason || doc.fix) && (
          <Box mt={8} px={2}>
            {doc.reason && (
              <Text fz={12} c="#DB340B">
                Reason: {doc.reason}
              </Text>
            )}
            {doc.fix && (
              <Text fz={12} c="#667085" mt={2}>
                Fix: {doc.fix}
              </Text>
            )}
          </Box>
        )}
      </Box>

      {showDivider && <Divider my={16} color="#EAECF0" />}

      <Modal
        opened={viewOpened}
        onClose={closeView}
        size={800}
        centered
        title={
          <Text fz={14} fw={500}>{displayFileName}</Text>
        }
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
