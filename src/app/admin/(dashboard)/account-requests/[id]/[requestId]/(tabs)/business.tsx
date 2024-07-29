"use client";

import { Flex, Grid, GridCol, Text, TextInput } from "@mantine/core";

import styles from "@/ui/styles/singlebusiness.module.scss";
import { RequestData } from "@/lib/hooks/requests";

export default function Business({ request }: { request: RequestData | null }) {
  return (
    <div className={styles.business__tab}>
      <div className={styles.top__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            Business Information
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
              label="Business Name"
              placeholder={request?.Company.name}
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
              placeholder={request?.Company.country}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Legal Entity Type"
              placeholder={request?.Company.legalEntity}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Business Address"
              placeholder={request?.Company.address}
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Domain"
              placeholder={request?.Company.domain}
            />
          </GridCol>
        </Grid>
      </div>
    </div>
  );
}
