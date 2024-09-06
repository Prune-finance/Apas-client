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
import { FileTextInput } from "../FileTextInput";
// import styles from "@/ui/styles/singlebusiness.module.scss";

export default function Documents({
  request,
  business,
}: {
  request: RequestData | null;
  business: BusinessData | null;
}) {
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
              <FileTextInput
                label="Identity Type"
                placeholder={request.documentData.idType}
                url={request.documentData.idFileURL}
              />
            </GridCol>
          )}

          {request?.accountType === "USER" && (
            <GridCol span={4} className={styles.grid}>
              <FileTextInput
                label="Proof of Address"
                placeholder={`${request.documentData.poaType}`}
                url={request.documentData.poaFileURL}
              />
            </GridCol>
          )}

          {request?.accountType === "CORPORATE" && (
            <>
              <GridCol span={4} className={styles.grid}>
                <FileTextInput
                  label="Certificate of Incorporation"
                  placeholder={`Certificate of Incorporation`}
                  url={request.documentData.certOfInc ?? ""}
                />
              </GridCol>

              <GridCol span={4} className={styles.grid}>
                <FileTextInput
                  label="Mermat"
                  placeholder={`Mermat`}
                  url={request.documentData.mermat ?? ""}
                />
              </GridCol>
            </>
          )}
        </Grid>
      </div>
    </div>
  );
}
