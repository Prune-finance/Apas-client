"use client";

import {
  Button,
  Flex,
  Grid,
  GridCol,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconFileInfo,
  IconJpg,
  IconPdf,
  IconPencilMinus,
  IconPlus,
} from "@tabler/icons-react";

import styles from "./styles.module.scss";
import { RequestData } from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";
import { BusinessData } from "@/lib/hooks/businesses";
// import styles from "@/ui/styles/singlebusiness.module.scss";

export default function Documents({
  request,
  business,
}: {
  request: RequestData | null;
  business: BusinessData | null;
}) {
  const { handleInfo } = useNotification();
  console.log(request);
  return (
    <div className={styles.document__tab}>
      <div className={styles.top__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Documents
          </Text>
        </Flex>
        <Grid mt={20} className={styles.grid__container}>
          {request?.accountType === "USER" && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                classNames={{
                  input: styles.input,
                  label: styles.label,
                  section: styles.section,
                }}
                leftSection={<IconFileInfo />}
                leftSectionPointerEvents="none"
                rightSection={
                  <UnstyledButton
                    onClick={() => {
                      if (!request.documentData.idFileURL)
                        return handleInfo("No document was provided", "");
                      window.open(
                        request.documentData.idFileURL || "",
                        "_blank"
                      );
                    }}
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="#475467">
                      View
                    </Text>
                  </UnstyledButton>
                }
                label="Identity Type"
                placeholder={`${request.documentData.idType}-${request.firstName} ${request.lastName}`}
              />
            </GridCol>
          )}

          {request?.accountType === "USER" && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                classNames={{
                  input: styles.input,
                  label: styles.label,
                  section: styles.section,
                }}
                leftSection={<IconFileInfo />}
                leftSectionPointerEvents="none"
                rightSection={
                  <UnstyledButton
                    onClick={() => {
                      if (!request.documentData.poaFileURL)
                        return handleInfo("No document was provided", "");
                      window.open(
                        request.documentData.poaFileURL || "",
                        "_blank"
                      );
                    }}
                    className={styles.input__right__section}
                  >
                    <Text fw={600} fz={10} c="#475467">
                      View
                    </Text>
                  </UnstyledButton>
                }
                label="Proof of Address"
                placeholder={`${request.documentData.poaType}-${request.firstName} ${request.lastName}`}
              />
            </GridCol>
          )}

          {request?.accountType === "CORPORATE" && (
            <>
              <GridCol span={4} className={styles.grid}>
                <TextInput
                  classNames={{
                    input: styles.input,
                    label: styles.label,
                    section: styles.section,
                  }}
                  leftSection={<IconFileInfo />}
                  leftSectionPointerEvents="none"
                  rightSection={
                    <UnstyledButton
                      onClick={() => {
                        if (!business?.cacCertificate)
                          return handleInfo("No document was provided", "");
                        window.open(business.cacCertificate || "", "_blank");
                      }}
                      className={styles.input__right__section}
                    >
                      <Text fw={600} fz={10} c="#475467">
                        View
                      </Text>
                    </UnstyledButton>
                  }
                  label="Certificate of Incorporation"
                  placeholder={`Certificate of Incorporation-${request.firstName} ${request.lastName}`}
                />
              </GridCol>

              <GridCol span={4} className={styles.grid}>
                <TextInput
                  classNames={{
                    input: styles.input,
                    label: styles.label,
                    section: styles.section,
                  }}
                  leftSection={<IconFileInfo />}
                  leftSectionPointerEvents="none"
                  rightSection={
                    <UnstyledButton
                      onClick={() => {
                        if (!business?.mermat)
                          return handleInfo("No document was provided", "");
                        window.open(business.mermat || "", "_blank");
                      }}
                      className={styles.input__right__section}
                    >
                      <Text fw={600} fz={10} c="#475467">
                        View
                      </Text>
                    </UnstyledButton>
                  }
                  label="Mermat"
                  placeholder={`Mermat-${request.firstName} ${request.lastName}`}
                />
              </GridCol>
            </>
          )}
        </Grid>

        {/* <Grid mt={20} className={styles.grid__container}>
          <GridCol span={4} className={styles.grid}>
            <TextInput
              classNames={{
                input: styles.input,
                label: styles.label,
                section: styles.section,
              }}
              leftSection={<IconPdf />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="CAC Document"
              placeholder="CAC-doc.pdf"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              leftSection={<IconJpg />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="Directors"
              placeholder="Dir-backup-img.jpg"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              leftSection={<IconJpg />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="Shareholders"
              placeholder="sharhld.jpg"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              leftSection={<IconPdf />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="MerMat Document"
              placeholder="File.pdf"
            />
          </GridCol>
        </Grid> */}
      </div>
    </div>
  );
}
