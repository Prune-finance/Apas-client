"use client";

import { SimpleGrid, Text } from "@mantine/core";
import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessDetail, OnboardingDocumentFile, ReviewStatus } from "@/lib/hooks/businesses";
import { DocumentViewCard } from "@/ui/section/onboarding/shared";

interface Props {
  detail: BusinessDetail;
  applicationReference?: string;
  applicationStatus?: string;
  onReview?: () => void;
}

const DOC_LABELS: { key: keyof NonNullable<BusinessDetail["documents"]>; label: string }[] = [
  { key: "incorporationCertificate", label: "Certificate of Incorporation" },
  { key: "memart", label: "MEMART" },
  { key: "amlFramework", label: "AML Framework" },
  { key: "operationalLicence", label: "Operational Licence" },
];

function resolveDocId(doc: OnboardingDocumentFile | string | null | undefined): string | null {
  if (!doc) return null;
  if (typeof doc === "string") return doc || null;
  return doc.id ?? null;
}

function resolveFileName(doc: OnboardingDocumentFile | string | null | undefined, fallback: string): string {
  if (!doc || typeof doc === "string") return fallback;
  return doc.fileName || fallback;
}

export default function OnboardingDocuments({ detail, applicationReference, applicationStatus, onReview }: Props) {
  const docs = detail.documents;

  const reviewMap = new Map<string, ReviewStatus>();
  for (const rd of detail.reviewDocuments ?? []) {
    if (rd.review?.status) reviewMap.set(rd.id, rd.review.status as ReviewStatus);
  }

  const hasAny = docs && DOC_LABELS.some(({ key }) => Boolean(docs[key]));

  return (
    <div className={styles.business__tab}>
      <div className={styles.top__container}>
        <Text fz={12} fw={600} tt="uppercase" mb={20}>
          Business Documents
        </Text>

        {!hasAny ? (
          <Text fz={14} c="dimmed">
            No documents have been submitted yet.
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={16}>
            {DOC_LABELS.map(({ key, label }) => {
              const doc = docs?.[key];
              const fileId = resolveDocId(doc);
              if (!fileId) return null;
              return (
                <DocumentViewCard
                  key={key}
                  label={label}
                  title={resolveFileName(doc, label)}
                  fileId={fileId}
                  isAdmin
                  applicationReference={applicationReference}
                  applicationStatus={applicationStatus}
                  reviewStatus={reviewMap.get(fileId) ?? null}
                  onReview={onReview}
                />
              );
            })}
          </SimpleGrid>
        )}
      </div>
    </div>
  );
}
