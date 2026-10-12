"use client";

import { Flex, Text } from "@mantine/core";
import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessDetail } from "@/lib/hooks/businesses";
import { DocumentViewCard } from "@/ui/section/onboarding/shared";

interface Props {
  detail: BusinessDetail;
}

const DOC_LABELS: { key: keyof NonNullable<BusinessDetail["documents"]>; label: string }[] = [
  { key: "incorporationCertificate", label: "Certificate of Incorporation" },
  { key: "memart", label: "MEMART" },
  { key: "amlFramework", label: "AML Framework" },
  { key: "operationalLicence", label: "Operational Licence" },
];

export default function OnboardingDocuments({ detail }: Props) {
  const docs = detail.documents;

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
          <Flex gap={16} wrap="wrap">
            {DOC_LABELS.map(({ key, label }) =>
              docs?.[key] ? (
                <DocumentViewCard
                  key={key}
                  label={label}
                  title={label}
                  fileId={docs[key] as string}
                  isAdmin
                />
              ) : null
            )}
          </Flex>
        )}
      </div>
    </div>
  );
}
