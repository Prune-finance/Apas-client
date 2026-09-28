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
import { SearchInput } from "@/ui/components/Inputs";
import { SecondaryBtn } from "@/ui/components/Buttons";
import Filter from "@/ui/components/Filter";
import { switzer } from "@/ui/fonts";
import {
  QuestionnaireAdminItem,
  useQuestionnairesAdmin,
  useQuestionnairesStats,
} from "@/lib/hooks/eligibility-center";
import dayjs from "dayjs";
import { BadgeComponent } from "@/ui/components/Badge";
import { useRouter } from "next/navigation";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { calculateTotalPages, STAGE } from "@/lib/utils";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { useForm, zodResolver } from "@mantine/form";
import PaginationComponent from "@/ui/components/Pagination";
import CountryFlag from "@/ui/components/CountryFlag";
import { IconListTree } from "@tabler/icons-react";
import { SelectBox, TextBox } from "@/ui/components/Inputs";

const statusToStage: Record<string, STAGE> = {
  IN_PROGRESS: "In Progress",
  ONBOARDING_INVITED: "Onboarding Invited",
  SUBMITTED: "Submitted",
  NOT_ELIGIBLE: "REJECTED",
};

const SERVICE_OPTIONS = [
  "VIRTUAL_ACCOUNTS",
  "OPERATIONS_ACCOUNT",
  "PAYOUT",
  "ACCOUNT_LOOKUP",
  "REMITTANCE",
];

function EligibilityCenter() {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const [opened, { toggle }] = useDisclosure(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterType>(FilterValues);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const activeFilterCount = [
    appliedFilters.country,
    appliedFilters.type,
    appliedFilters.createdAt?.[0],
  ].filter(Boolean).length;

  const queryParams = {
    search: debouncedSearch,
    countryCode: appliedFilters.country ?? "",
    service: appliedFilters.type ?? "",
    dateFrom: appliedFilters.createdAt?.[0]
      ? toLocalDateStr(appliedFilters.createdAt[0])
      : "",
    dateTo: appliedFilters.createdAt?.[1]
      ? toLocalDateStr(appliedFilters.createdAt[1])
      : "",
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
            <GridCol span={{ base: 12, xs: 6, md: 3 }} key={i}>
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

        <Flex
          className={`${styles.container__search__filter} ${switzer.className}`}
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={12}
        >
          <SearchInput search={search} setSearch={setSearch} />

          <SecondaryBtn
            text="Filter"
            action={toggle}
            icon={IconListTree}
            indicator={activeFilterCount}
            fw={600}
            fz={12}
          />
        </Flex>

        <Filter<FilterType>
          opened={opened}
          toggle={toggle}
          form={form}
          noDate={false}
          onApply={(values) => {
            setAppliedFilters(values);
            setActive(1);
          }}
          onClear={() => {
            setAppliedFilters(FilterValues);
            form.reset();
            setActive(1);
          }}
        >
          <TextBox
            placeholder="Country Code (e.g. NG, GH)"
            {...form.getInputProps("country")}
          />
          <SelectBox
            placeholder="Service"
            {...form.getInputProps("type")}
            data={SERVICE_OPTIONS}
          />
        </Filter>

        <TableComponent
          head={tableHeaders}
          rows={<Rows data={data} />}
          loading={loading}
          columnWidths={["30%", "20%", "15%", "15%", "20%"]}
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
