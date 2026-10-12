"use client";

import { Flex, Grid, GridCol, Text, TextInput } from "@mantine/core";
import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessDetail } from "@/lib/hooks/businesses";
import { DocumentViewCard } from "@/ui/section/onboarding/shared";

interface Props {
  detail: BusinessDetail;
}

export default function OnboardingShareholders({ detail }: Props) {
  const shareholders = (detail.shareholders ?? []) as Record<string, any>[];

  if (!shareholders.length) {
    return (
      <div className={styles.business__tab}>
        <Text fz={14} c="dimmed" mt={24}>
          No shareholders have been submitted yet.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.business__tab}>
      {shareholders.map((sh, i) => {
        const phone =
          sh.phoneCountryCode && sh.phoneNumber
            ? `${sh.phoneCountryCode} ${sh.phoneNumber}`
            : sh.phoneNumber ?? "";

        const identityDoc = sh.identityDocument as { id: string; fileName: string } | null;
        const identityDocBack = sh.identityDocumentBack as { id: string; fileName: string } | null;
        const poaDoc = sh.proofOfAddressDocument as { id: string; fileName: string } | null;

        return (
          <div
            key={sh.id ?? i}
            className={i === 0 ? styles.top__container : styles.bottom__container}
          >
            <Text fz={12} fw={600} tt="uppercase" mb={20}>
              Shareholder {i + 1}
            </Text>

            <Grid className={styles.grid__container}>
              {sh.firstName && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="First Name"
                    value={sh.firstName}
                  />
                </GridCol>
              )}
              {sh.lastName && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Last Name"
                    value={sh.lastName}
                  />
                </GridCol>
              )}
              {sh.email && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Email"
                    value={sh.email}
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
              {sh.dateOfBirth && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Date of Birth"
                    value={sh.dateOfBirth}
                  />
                </GridCol>
              )}
              {sh.identityType && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Identity Type"
                    value={sh.identityType}
                  />
                </GridCol>
              )}
              {sh.proofOfAddressType && (
                <GridCol span={4} className={styles.grid}>
                  <TextInput
                    readOnly
                    classNames={{ input: styles.input, label: styles.label }}
                    label="Proof of Address Type"
                    value={sh.proofOfAddressType}
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
        );
      })}
    </div>
  );
}
