"use client";

import { Flex, Grid, GridCol, Text, TextInput } from "@mantine/core";
import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessDetail } from "@/lib/hooks/businesses";
import { DocumentViewCard } from "@/ui/section/onboarding/shared";

interface CeoOverviewProps {
  detail: BusinessDetail;
}

export default function CeoOverview({ detail }: CeoOverviewProps) {
  const ceo = detail.ceo as Record<string, any> | null | undefined;

  if (!ceo) {
    return (
      <div className={styles.business__tab}>
        <Text fz={14} c="dimmed" mt={24}>
          No CEO details have been submitted yet.
        </Text>
      </div>
    );
  }

  const phone =
    ceo.phoneCountryCode && ceo.phoneNumber
      ? `${ceo.phoneCountryCode} ${ceo.phoneNumber}`
      : ceo.phoneNumber ?? "";

  const identityDoc = ceo.identityDocument as { id: string; fileName: string } | null;
  const identityDocBack = ceo.identityDocumentBack as { id: string; fileName: string } | null;
  const poaDoc = ceo.proofOfAddressDocument as { id: string; fileName: string } | null;

  return (
    <div className={styles.business__tab}>
      {/* Personal Details */}
      <div className={styles.top__container}>
        <Text fz={12} fw={600} tt="uppercase" mb={20}>
          Personal Details
        </Text>
        <Grid className={styles.grid__container}>
          {ceo.firstName && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{ input: styles.input, label: styles.label }}
                label="First Name"
                value={ceo.firstName}
              />
            </GridCol>
          )}
          {ceo.lastName && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{ input: styles.input, label: styles.label }}
                label="Last Name"
                value={ceo.lastName}
              />
            </GridCol>
          )}
          {ceo.email && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{ input: styles.input, label: styles.label }}
                label="Email"
                value={ceo.email}
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
          {ceo.dateOfBirth && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{ input: styles.input, label: styles.label }}
                label="Date of Birth"
                value={ceo.dateOfBirth}
              />
            </GridCol>
          )}
        </Grid>
      </div>

      {/* Identity & Documents */}
      <div className={styles.bottom__container}>
        <Text fz={12} fw={600} tt="uppercase" mb={20}>
          Identity &amp; Documents
        </Text>
        <Grid className={styles.grid__container}>
          {ceo.identityType && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{ input: styles.input, label: styles.label }}
                label="Identity Type"
                value={ceo.identityType}
              />
            </GridCol>
          )}
          {ceo.proofOfAddressType && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{ input: styles.input, label: styles.label }}
                label="Proof of Address Type"
                value={ceo.proofOfAddressType}
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
              />
            )}
            {identityDocBack && (
              <DocumentViewCard
                label="Identity Document (Back)"
                title={identityDocBack.fileName}
                fileId={identityDocBack.id}
                isAdmin
              />
            )}
            {poaDoc && (
              <DocumentViewCard
                label="Proof of Address"
                title={poaDoc.fileName}
                fileId={poaDoc.id}
                isAdmin
              />
            )}
          </Flex>
        )}
      </div>
    </div>
  );
}
