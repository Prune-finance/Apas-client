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

import styles from "./styles.module.scss";
// import styles from "@/ui/styles/singlebusiness.module.scss";
import { RequestData } from "@/lib/hooks/requests";
import useNotification from "@/lib/hooks/notification";
import { getUserType } from "@/lib/utils";

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
          {request?.accountType === "USER" && (
            <>
              <GridCol span={4} className={styles.grid}>
                <TextInput
                  readOnly
                  classNames={{
                    input: styles.input,
                    label: styles.label,
                  }}
                  label="First Name"
                  placeholder={`${request?.firstName || ""} `}
                />
              </GridCol>

              <GridCol span={4} className={styles.grid}>
                <TextInput
                  readOnly
                  classNames={{
                    input: styles.input,
                    label: styles.label,
                  }}
                  label="Last Name"
                  placeholder={`${request?.lastName || ""}`}
                />
              </GridCol>
            </>
          )}

          {request?.accountType === "CORPORATE" && (
            <GridCol span={4} className={styles.grid}>
              <TextInput
                readOnly
                classNames={{
                  input: styles.input,
                  label: styles.label,
                }}
                label="Company Name"
                placeholder={`${request?.Company.name || ""}`}
              />
            </GridCol>
          )}

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="User Type"
              placeholder={getUserType(request?.accountType ?? "USER")}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Country of Operation"
              placeholder={request?.country}
            />
          </GridCol>
        </Grid>
      </div>
    </div>
  );
}
