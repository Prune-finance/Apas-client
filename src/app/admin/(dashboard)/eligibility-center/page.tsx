"use client";

import React, { Suspense } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import classes from "./style.module.scss";
import { Box, Flex, Grid, GridCol, Text } from "@mantine/core";
import { switzer } from "@/app/layout";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";

function EligibilityCenter() {
  return (
    <main className={styles.main}>
      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Eligibility Center
          </Text>
        </div>

        <Grid align="center" justify="center" mt={26}>
          {data?.map((d, i) => (
            <GridCol span={3} key={i}>
              <Box className={classes.card} p={24}>
                <Flex
                  align="flex-start"
                  justify="flex-start"
                  direction="column"
                  gap={10}
                >
                  <Text fz={14} fw={400} c="#667085">
                    {d?.title}
                  </Text>
                  <Text fz={24} fw={500} c="#344054">
                    {d?.num}
                  </Text>
                </Flex>
              </Box>
            </GridCol>
          ))}
        </Grid>

        <div
          className={`${styles.container__search__filter} ${switzer.className}`}
        >
          <SearchInput />

          <Flex gap={12}>
            <PrimaryBtn
              text="Add New Profile"
              fw={600}
              fz={12}
              link="/admin/eligibility-center/new"
            />
          </Flex>
        </div>

        <TableComponent head={tableHeaders} rows={[]} loading={false} />

        <EmptyTable
          rows={[]}
          loading={false}
          title="There are no profiles"
          text="When a profile is created, it will appear here."
        />
      </div>
    </main>
  );
}

const tableHeaders = [
  "Business Name",
  "Date",
  "Country",
  "Services",
  "Stage",
  "Actions",
];

const data = [
  { title: "Total leads", num: 0 },
  { title: "Total approved", num: 0 },
  { title: "Total onboarded", num: 0 },
  { title: "Pending", num: 0 },
];

export default function EligibilityCenterSus() {
  return (
    <Suspense>
      <EligibilityCenter />
    </Suspense>
  );
}
