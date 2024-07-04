"use client";

import { Button, Flex, Grid, GridCol, Text, TextInput } from "@mantine/core";
import { IconPencilMinus } from "@tabler/icons-react";

import styles from "../styles.module.scss";
import { BusinessData } from "@/lib/hooks/businesses";
import { useState } from "react";

export default function Pricing() {
  const [editingTop, setEditingTop] = useState(false);
  const [editingBottom, setEditingBottom] = useState(false);

  return (
    <div className={styles.business__tab}>
      <div className={styles.top__container}>
        <Flex justify="space-between" align="center">
          <Text fz={12} fw={600} tt="uppercase">
            PLAN DETAILS
          </Text>
        </Flex>

        <Grid mt={20} className={styles.grid__container}>
          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Current Plan"
              placeholder="Basic"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Cycle"
              placeholder="Annually"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Amount"
              placeholder="100,000"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Payment Date"
              placeholder="24th Jul, 2024, 10:00am"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
              }}
              label="Payment Method"
              placeholder="Credit Card"
            />
          </GridCol>

          <GridCol span={4} className={styles.grid}>
            <TextInput
              readOnly={!editingTop}
              classNames={{
                input: styles.input,
                label: styles.label,
                root: styles.input__root,
              }}
              label="Renewal Date"
              placeholder="24th Jul 2025, 10:00am"
              // rightSection={
              //   <Text fz={10} fw={600}>
              //     Expires 24th Jul, 2024
              //   </Text>
              // }
              // rightSectionPointerEvents="none"
            />
          </GridCol>
        </Grid>
      </div>
    </div>
  );
}
