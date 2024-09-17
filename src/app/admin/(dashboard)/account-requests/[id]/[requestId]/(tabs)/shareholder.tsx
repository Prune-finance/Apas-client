"use client";

import { Flex, Stack, Text } from "@mantine/core";

import { Fragment } from "react";

import styles from "./styles.module.scss";
import { RequestData } from "@/lib/hooks/requests";

import { FileRows } from "../FileTextInput";
import { camelCaseToTitleCase, getDocumentStatus } from "@/lib/utils";

export default function Shareholders({
  request,
  revalidate,
}: {
  request: RequestData | null;
  revalidate: () => void;
}) {
  return (
    <div className={styles.business__tab}>
      {request?.accountType === "CORPORATE" && (
        <Fragment>
          {Object.keys(request?.documentData.shareholders).map(
            (director, index) => {
              return (
                <Fragment key={index}>
                  <DirectorsForm
                    request={request}
                    index={index}
                    revalidate={revalidate}
                  />
                </Fragment>
              );
            }
          )}
        </Fragment>
      )}
    </div>
  );
}

const DirectorsForm = ({
  request,
  index,
  revalidate,
}: {
  request: RequestData;
  index: number;
  revalidate: () => void;
}) => {
  return (
    <div
    //  className={styles.top__container}
    >
      <Flex justify="space-between" align="center" bg="#F9F9F9" p={20} mt={28}>
        <Text fz={12} fw={800} tt="uppercase" c="var(--prune-text-gray-800)">
          Shareholder {index + 1}
        </Text>
      </Flex>

      <Stack mt={20} className={styles.grid__container}>
        {request.accountType === "CORPORATE" && (
          // <GridCol span={4} className={styles.grid}>
          <FileRows
            label="Identity Type"
            placeholder={camelCaseToTitleCase(
              request.documentData.shareholders[`shareholder_${index + 1}`]
                .idType
            )}
            url={
              request.documentData.shareholders[`shareholder_${index + 1}`]
                .idFile
            }
            path={`shareholders.shareholder_${index + 1}.idFile`}
            request={request}
            revalidate={revalidate}
            status={getDocumentStatus(
              request,
              "shareholders",
              `shareholder_${index + 1}`,
              "idFile"
            )}
          />
          // </GridCol>
        )}

        {request.accountType === "CORPORATE" && (
          // <GridCol span={4} className={styles.grid}>
          <FileRows
            label="Proof of Address"
            placeholder={camelCaseToTitleCase(
              request.documentData.shareholders[`shareholder_${index + 1}`]
                .poaType
            )}
            url={
              request.documentData.shareholders[`shareholder_${index + 1}`]
                .poaFile
            }
            path={`shareholders.shareholder_${index + 1}.poaFile`}
            request={request}
            revalidate={revalidate}
            status={getDocumentStatus(
              request,
              "shareholders",
              `shareholder_${index + 1}`,
              "poaFile"
            )}
          />
          // </GridCol>
        )}
      </Stack>
    </div>
  );
};
