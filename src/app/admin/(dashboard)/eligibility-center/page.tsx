"use client";

import React, { Suspense, useState } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import classes from "./style.module.scss";
import {
  Box,
  Flex,
  Grid,
  GridCol,
  Group,
  Skeleton,
  Stack,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";
// import { PrimaryBtn } from "@/ui/components/Buttons";
import { SearchInput } from "@/ui/components/Inputs";
import { switzer } from "@/ui/fonts";
import {
  QuestionnaireAdminItem,
  useQuestionnairesAdmin,
  useQuestionnairesStats,
} from "@/lib/hooks/eligibility-center";
import dayjs from "dayjs";
import { BadgeComponent } from "@/ui/components/Badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";
import { calculateTotalPages, STAGE } from "@/lib/utils";
import PaginationComponent from "@/ui/components/Pagination";
import CountryFlag from "@/ui/components/CountryFlag";

const statusToStage: Record<string, STAGE> = {
  IN_PROGRESS: "In Progress",
  ONBOARDING_INVITED: "Onboarding Invited",
  SUBMITTED: "Submitted",
  NOT_ELIGIBLE: "REJECTED",
};

const SERVICE_LABELS: Record<string, string> = {
  OPERATIONS_ACCOUNT: "Ops Account",
  VIRTUAL_ACCOUNTS: "Virtual Accounts",
  PAYOUT: "Payout",
  ACCOUNT_LOOKUP: "Account Lookup",
  REMITTANCE: "Remittance",
};

function EligibilityCenter() {
  const searchParams = useSearchParams();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { countryCode, dateFrom, dateTo } = Object.fromEntries(
    searchParams.entries(),
  );

  const queryParams = {
    search: debouncedSearch,
    countryCode: countryCode ?? "",
    dateFrom: dateFrom ? dayjs(dateFrom).format("YYYY-MM-DD") : "",
    dateTo: dateTo ? dayjs(dateTo).format("YYYY-MM-DD") : "",
    sortBy: "date",
    sortOrder: "desc",
    page: active,
    limit: parseInt(limit ?? "10", 10),
  };

  const { data, meta, loading } = useQuestionnairesAdmin(queryParams);
  const { stats, loading: statsLoading } = useQuestionnairesStats();

  const isLoading = loading || statsLoading;

  const InfoCards = [
    { title: "Total leads", num: stats?.totalLeads },
    { title: "Total approved", num: stats?.approved },
    { title: "Total onboarded", num: stats?.onboarded },
    { title: "Pending", num: stats?.pending },
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
                  {isLoading ? (
                    <Skeleton w={50} h={24} />
                  ) : (
                    <Text fz={24} fw={500} c="var(--prune-text-gray-700)">
                      {d?.num ?? 0}
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

          {/* <Flex gap={12}>
            <PrimaryBtn
              text="Add New Profile"
              link="/admin/eligibility-center/new"
              fw={600}
              fz={12}
            />
          </Flex> */}
        </div>

        <TableComponent
          head={tableHeaders}
          rows={<Rows data={data} />}
          loading={loading}
          columnWidths={[300, undefined, undefined, undefined, undefined, 80]}
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

const tableHeaders = ["Business Name", "Date", "Country", "Services", "Stage"];

export default function EligibilityCenterSus() {
  return (
    <Suspense>
      <EligibilityCenter />
    </Suspense>
  );
}

const Rows = ({ data }: { data: QuestionnaireAdminItem[] | null }) => {
  const { push } = useRouter();

  return data?.map((row) => {
    const stage = statusToStage[row.status] ?? "PROFILE";
    const countryCode = row.answers?.countryCode ?? "";

    return (
      <TableTr
        key={row.reference}
        onClick={() => push(`/admin/eligibility-center/${row.reference}`)}
        style={{ cursor: "pointer" }}
      >
        <TableTd>
          <Stack gap={2}>
            <Text fw={500} fz={14} c="var(--prune-text-gray-700)" tt="capitalize">
              {row.answers?.legalBusinessName ?? ""}
            </Text>
            {row.contactEmail && (
              <Text fz={12} c="var(--prune-text-gray-500)">
                {row.contactEmail ?? ""}
              </Text>
            )}
          </Stack>
        </TableTd>
        <TableTd>{dayjs(row.createdAt).format("Do MMMM, YYYY")}</TableTd>
        <TableTd>
          <Group gap={8} wrap="nowrap">
            <CountryFlag code={countryCode} size={20} />
            <Text fz={14} c="var(--prune-text-gray-700)">
              {countryCode || ""}
            </Text>
          </Group>
        </TableTd>
        <TableTd>
          <Group gap={4} wrap="wrap">
            <Text fz={12} c="var(--prune-text-gray-400)">Not available yet</Text>
          </Group>
        </TableTd>
        <TableTd>
          <BadgeComponent stage status={stage} w={140} />
        </TableTd>
      </TableTr>
    );
  });
};
