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
import { Fragment } from "react";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData, Director } from "@/lib/hooks/businesses";
import { RequestData } from "@/lib/hooks/requests";
import { request } from "http";

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
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
                section: styles.section,
              }}
              leftSection={<IconFileInfo />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="Identity Type"
              placeholder={
                request.documentData.shareholders[`shareholder_${index + 1}`]
                  .idType
              }
            />
          </GridCol>
        )}

        {request.accountType === "CORPORATE" && (
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
                section: styles.section,
              }}
              leftSection={<IconFileInfo />}
              leftSectionPointerEvents="none"
              rightSection={
                <UnstyledButton className={styles.input__right__section}>
                  <Text fw={600} fz={10} c="##475467">
                    View
                  </Text>
                </UnstyledButton>
              }
              label="Proof of Address"
              placeholder={
                request.documentData.shareholders[`shareholder_${index + 1}`]
                  .poaType
              }
            />
          </GridCol>
        )}
      </Grid>
    </div>
  );
};
