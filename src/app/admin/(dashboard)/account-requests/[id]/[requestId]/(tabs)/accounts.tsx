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
  IconPencilMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { RequestData } from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";

export default function Account({ request }: { request: RequestData | null }) {
  const { handleInfo } = useNotification();

  return (
    <div className={styles.business__tab}>
      <div className={styles.top__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Account Information
          </Text>
        </Flex>

        <Grid mt={20} className={styles.grid__container}>
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Account Name"
              placeholder={`${request?.firstName || ""} ${
                request?.lastName || ""
              }`}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Type"
              placeholder={request?.accountType}
            />
          </GridCol>

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
                label="Proof of Address Type"
                placeholder={`${request.documentData.poaType}-${request.firstName} ${request.lastName}`}
              />
            </GridCol>
          )}
        </Grid>
      </div>
    </div>
  );
}
