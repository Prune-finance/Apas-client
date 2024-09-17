"use client";

import {
  Button,
  Flex,
  Grid,
  GridCol,
  Stack,
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
import { FileRows, FileTextInput } from "../FileTextInput";
import { camelCaseToTitleCase, getDocumentStatus } from "@/lib/utils";
// import styles from "@/ui/styles/singlebusiness.module.scss";

export default function Documents({
  request,
  revalidate,
}: {
  request: RequestData | null;
  revalidate: () => void;
}) {
  return (
    <div className={styles.document__tab}>
      <div
      // className={styles.top__container}
      >
        <Flex
          justify="space-between"
          align="center"
          bg="#F9F9F9"
          p={20}
          mt={28}
        >
          <Text fz={12} fw={800} tt="uppercase" c="var(--prune-text-gray-800)">
            Documents
          </Text>
        </Flex>
        <Stack mt={20} className={styles.grid__container}>
          {request?.accountType === "USER" && (
            // <GridCol span={4} className={styles.grid}>
            <FileRows
              label="Identity Type"
              placeholder={camelCaseToTitleCase(request.documentData.idType)}
              url={request.documentData.idFileURL}
              path={`idFileURL`}
              request={request}
              revalidate={revalidate}
              status={getDocumentStatus(request, "idFileURL")}
            />
            // </GridCol>
          )}

          {request?.accountType === "USER" && (
            // <GridCol span={4} className={styles.grid}>
            <FileRows
              label="Proof of Address"
              placeholder={camelCaseToTitleCase(request.documentData.poaType)}
              url={request.documentData.poaFileURL}
              path={`poaFileURL`}
              request={request}
              revalidate={revalidate}
              status={getDocumentStatus(request, "poaFileURL")}
            />
            // </GridCol>
          )}

          {request?.accountType === "CORPORATE" && (
            <>
              {/* <GridCol span={4} className={styles.grid}> */}
              <FileRows
                label="Certificate of Incorporation"
                placeholder={`Certificate of Incorporation`}
                url={request.documentData.certOfInc ?? ""}
                path={`certOfInc`}
                request={request}
                revalidate={revalidate}
                status={getDocumentStatus(request, "certOfInc")}
              />
              {/* </GridCol> */}

              {/* <GridCol span={4} className={styles.grid}> */}
              <FileRows
                label="Mermat"
                placeholder={`Mermat`}
                url={request.documentData.mermat ?? ""}
                path={`mermat`}
                request={request}
                revalidate={revalidate}
                status={getDocumentStatus(request, "mermat")}
              />
              {/* </GridCol> */}
            </>
          )}
        </Stack>
      </div>
    </div>
  );
}
