"use client";

import { Flex, Grid, GridCol, Text, TextInput } from "@mantine/core";

import styles from "../styles.module.scss";
import { useState } from "react";
import { useUserBusiness } from "@/lib/hooks/businesses";
import { usePricingPlan, useSinglePricingPlan } from "@/lib/hooks/pricing-plan";
import { formatNumber } from "@/lib/utils";

export default function Pricing() {
  const [editingTop, setEditingTop] = useState(false);
  const [editingBottom, setEditingBottom] = useState(false);

  const { business, loading, meta } = useUserBusiness();
  const { pricingPlan } = useSinglePricingPlan(business?.pricingPlanId ?? "");

  const { pricingPlan: pricingPlans } = usePricingPlan();

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
              placeholder={
                pricingPlan?.name ?? "No pricing plan for this business"
              }
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
              placeholder={
                pricingPlan?.cycle ?? "No pricing plan for this business"
              }
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
              placeholder={
                pricingPlan?.cost
                  ? formatNumber(pricingPlan.cost, true, "EUR")
                  : "No pricing plan for this business"
              }
            />
          </GridCol>

          {/* <GridCol span={4} className={styles.grid}>
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
          </GridCol> */}
        </Grid>
      </div>
    </div>
  );
}
