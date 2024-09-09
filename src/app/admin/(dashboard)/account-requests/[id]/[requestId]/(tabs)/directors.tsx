"use client";

import {
  Button,
  camelToKebabCase,
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

import styles from "./styles.module.scss";
// import styles from "@/ui/styles/singlebusiness.module.scss";
import { BusinessData, Director } from "@/lib/hooks/businesses";
import { RequestData } from "@/lib/hooks/requests";
import { request } from "http";
import useNotification from "@/lib/hooks/notification";
import { notifications } from "@mantine/notifications";
import { FileTextInput } from "../FileTextInput";
import { camelCaseToTitleCase, getDocumentStatus } from "@/lib/utils";

export default function Directors({
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
          {Object.keys(request?.documentData.directors).map(
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
  const { handleInfo } = useNotification();

  return (
    <div className={styles.top__container}>
      <Flex justify="space-between" align="center">
        <Text fz={12} fw={600} tt="uppercase">
          Director {index + 1}
        </Text>
      </Flex>

      <Grid mt={20} className={styles.grid__container}>
        {request.accountType === "CORPORATE" && (
          <GridCol span={4} className={styles.grid}>
            <FileTextInput
              label="Identity Type"
              placeholder={camelCaseToTitleCase(
                request.documentData.directors[`director_${index + 1}`].idType
              )}
              url={
                request.documentData.directors[`director_${index + 1}`].idFile
              }
              path={`directors.director_${index + 1}.idFile`}
              requestId={request.id}
              revalidate={revalidate}
              status={getDocumentStatus(
                request,
                "directors",
                `director_${index + 1}`,
                "idFile"
              )}
            />
          </GridCol>
        )}

        {request.accountType === "CORPORATE" && (
          <GridCol span={4} className={styles.grid}>
            <FileTextInput
              label="Proof of Address"
              placeholder={camelCaseToTitleCase(
                request.documentData.directors[`director_${index + 1}`].poaType
              )}
              url={
                request.documentData.directors[`director_${index + 1}`].poaFile
              }
              path={`directors.director_${index + 1}.poaFile`}
              requestId={request.id}
              revalidate={revalidate}
              status={getDocumentStatus(
                request,
                "directors",
                `director_${index + 1}`,
                "poaFile"
              )}
            />
          </GridCol>
        )}
      </Grid>
    </div>
  );
};
