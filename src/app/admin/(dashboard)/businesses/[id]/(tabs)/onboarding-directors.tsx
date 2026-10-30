"use client";

import { Flex, Grid, GridCol, Text, TextInput } from "@mantine/core";
import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessDetail, ReviewStatus } from "@/lib/hooks/businesses";
import { DocumentViewCard } from "@/ui/section/onboarding/shared";

interface Props {
  detail: BusinessDetail;
  applicationReference?: string;
  applicationStatus?: string;
  onReview?: () => void;
}

export default function OnboardingDirectors({ detail, applicationReference, applicationStatus, onReview }: Props) {
  const directors = (detail.directors ?? []) as Record<string, any>[];

  const reviewMap = new Map<string, ReviewStatus>();
  for (const rd of detail.reviewDocuments ?? []) {
    if (rd.review?.status) reviewMap.set(rd.id, rd.review.status as ReviewStatus);
  }

  if (!directors.length) {
    return (
      <div className={styles.business__tab}>
        <Text fz={14} c="dimmed" mt={24}>
          No directors have been submitted yet.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.business__tab}>
      {directors.map((dir, i) => {
        const phone =
          dir.phoneCountryCode && dir.phoneNumber
            ? `${dir.phoneCountryCode} ${dir.phoneNumber}`
            : dir.phoneNumber ?? "";

        const identityDoc = dir.identityDocument as { id: string; fileName: string } | null;
        const identityDocBack = dir.identityDocumentBack as { id: string; fileName: string } | null;
        const poaDoc = dir.proofOfAddressDocument as { id: string; fileName: string } | null;

        return (
          <div
            key={dir.id ?? i}
            className={i === 0 ? styles.top__container : styles.bottom__container}
          >
            <Text fz={12} fw={600} tt="uppercase" mb={20}>
              Director {i + 1}
            </Text>

            <Grid className={styles.grid__container}>
              {dir.firstName && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="First Name"
                    value={dir.firstName}
                  />
                </GridCol>
              )}
              {dir.lastName && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Last Name"
                    value={dir.lastName}
                  />
                </GridCol>
              )}
              {dir.email && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Email"
                    value={dir.email}
                  />
                </GridCol>
              )}
              {phone && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Phone"
                    value={phone}
                  />
                </GridCol>
              )}
              {dir.dateOfBirth && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Date of Birth"
                    value={dir.dateOfBirth}
                  />
                </GridCol>
              )}
              {dir.identityType && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Identity Type"
                    value={dir.identityType}
                  />
                </GridCol>
              )}
              {dir.proofOfAddressType && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Proof of Address Type"
                    value={dir.proofOfAddressType}
                  />
                </GridCol>
              )}
            </Grid>

            {(identityDoc || identityDocBack || poaDoc) && (
              <Flex gap={16} mt={20} wrap="wrap">
                {identityDoc && (
                  <DocumentViewCard
                    label="Identity Document"
                    title={identityDoc.fileName}
                    fileId={identityDoc.id}
                    isAdmin
                    applicationReference={applicationReference}
                    applicationStatus={applicationStatus}
                    reviewStatus={reviewMap.get(identityDoc.id) ?? null}
                    onReview={onReview}
                  />
                )}
                {identityDocBack && (
                  <DocumentViewCard
                    label="Identity Document (Back)"
                    title={identityDocBack.fileName}
                    fileId={identityDocBack.id}
                    isAdmin
                    applicationReference={applicationReference}
                    applicationStatus={applicationStatus}
                    reviewStatus={reviewMap.get(identityDocBack.id) ?? null}
                    onReview={onReview}
                  />
                )}
                {poaDoc && (
                  <DocumentViewCard
                    label="Proof of Address"
                    title={poaDoc.fileName}
                    fileId={poaDoc.id}
                    isAdmin
                    applicationReference={applicationReference}
                    applicationStatus={applicationStatus}
                    reviewStatus={reviewMap.get(poaDoc.id) ?? null}
                    onReview={onReview}
                  />
                )}
              </Flex>
            )}
          </div>
        );
      })}
    </div>
  );
}
