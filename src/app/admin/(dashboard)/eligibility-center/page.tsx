import React, { Suspense } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import classes from "./style.module.scss";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridCol,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { switzer } from "@/app/layout";
import Link from "next/link";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";

function EligibilityCenter() {
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

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
          <TextInput
            placeholder="Search here..."
            leftSectionPointerEvents="none"
            leftSection={searchIcon}
            color="var(--prune-text-gray-200)"
            c="#000"
            w={381}
            styles={{ input: { border: "1px solid #F5F5F5" } }}
          />

          <Flex gap={12}>
            <Button
              //   component={Link}
              //   href="/admin/businesses/new"
              variant="filled"
              radius={4}
              fz={12}
              c="#344054"
              fw={600}
              w={130}
              color="var(--prune-primary-600)"
            >
              Add New Profile
            </Button>
          </Flex>
        </div>

        <TableComponent head={tableHeaders} rows={[]} loading={false} />

        <EmptyTable
          rows={[]}
          loading={false}
          title="There are no requests"
          text="When a request is created, it will appear here."
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
