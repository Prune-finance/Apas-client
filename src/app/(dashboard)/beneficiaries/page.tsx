"use client";
import { Box, Group, Paper, Stack, Text } from "@mantine/core";
import React, { Suspense } from "react";

// UI Imports
import styles from "./styles.module.scss";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { IconPlus } from "@tabler/icons-react";
import EmptyTable from "@/ui/components/EmptyTable";

const Beneficiaries = () => {
  return (
    <Box>
      <main className={styles.main}>
        <Paper className={styles.table__container}>
          <div className={styles.container__header}>
            <Stack gap={0}>
              <Text fz={18} fw={600}>
                Beneficiary Management
              </Text>
              <Text fz={14} fw={400} color="#667085">
                Manage your saved beneficiaries and categories
              </Text>
            </Stack>

            <Group gap={12}>
              <PrimaryBtn
                icon={IconPlus}
                text="New Beneficiary"
                action={open}
              />
            </Group>
          </div>

          <EmptyTable
            rows={[]}
            loading={false}
            title="There is no data here for now."
            text="When an account is created , it would appear here."
          />
        </Paper>
      </main>
    </Box>
  );
};

export default function BeneficiariesSuspense() {
  return (
    <Suspense>
      <Beneficiaries />
    </Suspense>
  );
}
