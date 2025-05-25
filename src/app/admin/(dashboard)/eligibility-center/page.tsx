"use client";

import React, { Suspense, useState } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import classes from "./style.module.scss";
import {
  Box,
  Flex,
  Grid,
  GridCol,
  Skeleton,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";
import { switzer } from "@/ui/fonts";
import {
  OnboardingBusinessData,
  useOnboardingBusiness,
} from "@/lib/hooks/eligibility-center";
import dayjs from "dayjs";
import { BadgeComponent } from "@/ui/components/Badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { calculateTotalPages } from "@/lib/utils";
import PaginationComponent from "@/ui/components/Pagination";

function EligibilityCenter() {
  // const [search, setSearch] = useState("");
  // const [debouncedSearch] = useDebouncedValue(search, 1000);

  const searchParams = useSearchParams();
  const [opened, { toggle }] = useDisclosure(false);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { status, date, endDate, name, contactEmail } = Object.fromEntries(
    searchParams.entries()
  );

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : "",
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    status: status ? status.toUpperCase() : "",
    business: name,
    email: contactEmail,
    limit: parseInt(limit ?? "10", 10),
    page: active,
    search: debouncedSearch,
  };

  const { data, meta, loading, revalidate } = useOnboardingBusiness({
    search: debouncedSearch,
  });

  const InfoCards = [
    { title: "Total leads", num: meta?.total },
    { title: "Total approved", num: meta?.approved },
    { title: "Total onboarded", num: meta?.onboarded },
    { title: "Pending", num: meta?.pending },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Eligibility Center
          </Text>
        </div>

        <Grid align="center" justify="center" mt={26}>
          {InfoCards?.map((d, i) => (
            <GridCol span={3} key={i}>
              <Box className={classes.card} p={24}>
                <Flex
                  align="flex-start"
                  justify="flex-start"
                  direction="column"
                  gap={10}
                >
                  <Text fz={14} fw={400} c="var(--prune-text-gray-500)">
                    {d?.title}
                  </Text>
                  {loading ? (
                    <Skeleton w={50} h={24} />
                  ) : (
                    <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
                      {d?.num}
                    </Text>
                  )}
                </Flex>
              </Box>
            </GridCol>
          ))}
        </Grid>

        <div
          className={`${styles.container__search__filter} ${switzer.className}`}
        >
          <SearchInput search={search} setSearch={setSearch} />

          <Flex gap={12}>
            <PrimaryBtn
              text="Add New Profile"
              fw={600}
              fz={12}
              link="/admin/eligibility-center/new"
            />
          </Flex>
        </div>

        <TableComponent
          head={tableHeaders}
          rows={<Rows data={data} />}
          loading={loading}
        />

        <EmptyTable
          rows={data || []}
          loading={loading}
          title="There are no profiles"
          text="When a profile is created, it will appear here."
        />

        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={calculateTotalPages(limit, meta?.total)}
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
  // "Actions",
];

export default function EligibilityCenterSus() {
  return (
    <Suspense>
      <EligibilityCenter />
    </Suspense>
  );
}

const Rows = ({ data }: { data: OnboardingBusinessData[] | null }) => {
  const { push } = useRouter();

  return data?.map((row) => (
    <TableTr
      key={row.id}
      onClick={() => push(`/admin/eligibility-center/${row.id}`)}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{row.businessName}</TableTd>
      <TableTd>{dayjs(row.createdAt).format("Do MMMM, YYYY")}</TableTd>
      <TableTd>{row.businessCountry}</TableTd>
      <TableTd>
        <BadgeComponent
          tier
          status={
            row.services?.every((s) => s.name === "Remittance")
              ? "Tier 1"
              : "Tier 2"
          }
          variant="filled"
        />
      </TableTd>
      <TableTd>
        <BadgeComponent
          stage
          status={row?.processStatus || "QUESTIONNAIRE"}
          c={row?.status === "ACTIVATION" ? "var(--prune-text-gray-800)" : ""}
          w={150}
        />
      </TableTd>
    </TableTr>
  ));
};
