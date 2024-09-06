"use client";

import { Flex, Grid, GridCol, Text } from "@mantine/core";

import { Fragment } from "react";

import styles from "./styles.module.scss";
import { RequestData } from "@/lib/hooks/requests";

import { FileTextInput } from "../FileTextInput";
import { camelCaseToTitleCase } from "@/lib/utils";

export default function Shareholders({
  request,
}: {
  request: RequestData | null;
}) {
  return (
    <div className={styles.business__tab}>
      {request?.accountType === "CORPORATE" && (
        <Fragment>
          {Object.keys(request?.documentData.shareholders).map(
            (director, index) => {
              return (
                <Fragment key={index}>
                  <DirectorsForm request={request} index={index} />
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
}: {
  request: RequestData;
  index: number;
}) => {
  return (
    <div className={styles.top__container}>
      <Flex justify="space-between" align="center">
        <Text fz={12} fw={600} tt="uppercase">
          Shareholder {index + 1}
        </Text>
      </Flex>

      <Grid mt={20} className={styles.grid__container}>
        {request.accountType === "CORPORATE" && (
          <GridCol span={4} className={styles.grid}>
            <FileTextInput
              label="Identity Type"
              placeholder={camelCaseToTitleCase(
                request.documentData.shareholders[`shareholder_${index + 1}`]
                  .idType
              )}
              url={
                request.documentData.shareholders[`shareholder_${index + 1}`]
                  .idFile
              }
            />
          </GridCol>
        )}

        {request.accountType === "CORPORATE" && (
          <GridCol span={4} className={styles.grid}>
            <FileTextInput
              label="Proof of Address"
              placeholder={camelCaseToTitleCase(
                request.documentData.shareholders[`shareholder_${index + 1}`]
                  .poaType
              )}
              url={
                request.documentData.shareholders[`shareholder_${index + 1}`]
                  .poaFile
              }
            />
          </GridCol>
        )}
      </Grid>
    </div>
  );
};
