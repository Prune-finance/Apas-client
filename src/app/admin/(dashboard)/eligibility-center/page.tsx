"use client";

import React, { Suspense, useState } from "react";
import styles from "@/ui/styles/accounts.module.scss";
import classes from "./style.module.scss";
import {
  Badge,
  Box,
  Flex,
  Grid,
  GridCol,
  Group,
  Skeleton,
  Stack,
  TableTd,
  TableTr,
  TabsPanel,
  Text,
  Title,
} from "@mantine/core";
import {
  IconUsersGroup,
  IconCircleCheck,
  IconBuildingSkyscraper,
  IconClock,
} from "@tabler/icons-react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { calculateTotalPages, STAGE } from "@/lib/utils";
import { FilterSchema, FilterType, FilterValues, Tab } from "@/lib/schema";
import { useForm, zodResolver } from "@mantine/form";
import PaginationComponent from "@/ui/components/Pagination";
import CountryFlag from "@/ui/components/CountryFlag";
import { IconListTree } from "@tabler/icons-react";
import { SelectBox, TextBox } from "@/ui/components/Inputs";
import OnboardedBusinesses from "../businesses/(tabs)/Onboarded";
import TabsComponent from "@/ui/components/Tabs";
import { PrimaryBtn } from "@/ui/components/Buttons";
import { IconPlus } from "@tabler/icons-react";

const statusToStage: Record<string, STAGE> = {
  IN_PROGRESS: "In Progress",
  ONBOARDING_INVITED: "Onboarding Invited",
  SUBMITTED: "Submitted",
  NOT_ELIGIBLE: "REJECTED",
  QUESTIONNAIRE_COMPLETED: "Questionnaire Completed",
};

const SERVICE_OPTIONS = [
  "VIRTUAL_ACCOUNTS",
  "OPERATIONS_ACCOUNT",
  "PAYOUT",
  "ACCOUNT_LOOKUP",
  "REMITTANCE",
];

function EligibilityCenter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "questionnaire";

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    router.push(`/admin/eligibility-center?tab=${value}`);
  };

  const { stats, loading: statsLoading } = useQuestionnairesStats();

  const InfoCards = [
    {
      title: "Total leads",
      num: stats?.totalLeads,
      icon: IconUsersGroup,
      iconBg: "#D1FAE5",
      iconColor: "#059669",
    },
    {
      title: "Total approved",
      num: stats?.approved,
      icon: IconCircleCheck,
      iconBg: "#D1FAE5",
      iconColor: "#059669",
    },
    {
      title: "Total onboarded",
      num: stats?.onboarded,
      icon: IconBuildingSkyscraper,
      iconBg: "#F2F4F7",
      iconColor: "#344054",
    },
    {
      title: "Pending",
      num: stats?.pending,
      icon: IconClock,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
    },
  ];

  return (
    <Box px={20}>
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Title order={2} fw={700}>Eligibility Center</Title>
          <Text fz={14} c="var(--prune-text-gray-500)" mt={4}>
            View and manage all eligibility profiles on the platform.
          </Text>
        </Box>
        <PrimaryBtn
          text="New Business"
          link="/admin/eligibility-center/new/business/new"
          leftSection={<IconPlus size={16} />}
          fw={600}
          fz={14}
        />
      </Flex>

      {/* Stat cards */}
      <Grid align="stretch" mt={32} mb={24}>
        {InfoCards.map((d, i) => (
          <GridCol span={{ base: 12, xs: 6, md: 3 }} key={i}>
            <Box className={classes.stat__card}>
              <Flex align="flex-start" justify="space-between">
                <div
                  className={classes.icon__wrap}
                  style={{ backgroundColor: d.iconBg }}
                >
                  <d.icon size={20} color={d.iconColor} stroke={1.8} />
                </div>
              </Flex>

              <Box mt={16}>
                <Text fz={13} fw={400} c="var(--prune-text-gray-500)">
                  {d.title}
                </Text>
                {statsLoading ? (
                  <Skeleton w={60} h={32} mt={4} />
                ) : (
                  <Text
                    fz={30}
                    fw={600}
                    c="var(--prune-text-gray-800)"
                    lh={1.2}
                    mt={4}
                  >
                    {d.num ?? 0}
                  </Text>
                )}
              </Box>
            </Box>
          </GridCol>
        ))}
      </Grid>

      {/* Tabs */}
      <TabsComponent
        tabs={eligibilityTabs}
        mt={32}
        value={currentTab}
        onChange={handleTabChange}
      >
        <TabsPanel value="questionnaire">
          <QuestionnaireTab />
        </TabsPanel>

        <TabsPanel value="onboarding">
          {currentTab === "onboarding" && (
            <OnboardedBusinesses
              hideOverview
              status="ONBOARDING"
              getDetailHref={(id) => `/admin/eligibility-center/${id}/business`}
            />
          )}
        </TabsPanel>
      </TabsComponent>
    </Box>
  );
}

function QuestionnaireTab() {
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
    appliedFilters.status,
    appliedFilters.createdAt?.[0],
  ].filter(Boolean).length;

  const queryParams = {
    search: debouncedSearch,
    countryCode: appliedFilters.country ?? "",
    service: appliedFilters.type ?? "",
    status: appliedFilters.status ?? "",
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

  return (
    <>
      <Flex
        className={`${styles.container__search__filter} ${switzer.className}`}
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={12}
        mt={24}
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
        customStatusOption={Object.keys(statusToStage)}
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
          placeholder="Country Code (e.g. NG)"
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
        columnWidths={["28%", "16%", "10%", "30%", "16%"]}
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
    </>
  );
}

const tableHeaders = ["Business Name", "Date", "Country", "Services", "Stage"];

const eligibilityTabs: Tab[] = [
  { title: "Questionnaire", value: "questionnaire" },
  { title: "Onboarding", value: "onboarding" },
];

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
            <Text
              fw={500}
              fz={14}
              c="var(--prune-text-gray-700)"
              tt="capitalize"
            >
              {row.answers?.legalBusinessName ||
                row.answers?.contactName ||
                "—"}
            </Text>
            {row.contactEmail && (
              <Text fz={12} c="var(--prune-text-gray-500)">
                {row.contactEmail}
              </Text>
            )}
          </Stack>
        </TableTd>
        <TableTd>{dayjs(row.createdAt).format("Do MMMM, YYYY")}</TableTd>
        <TableTd>
          {countryCode ? (
            <Group gap={8} wrap="nowrap">
              <CountryFlag code={countryCode} size={20} />
              <Text fz={14} c="var(--prune-text-gray-700)">
                {countryCode}
              </Text>
            </Group>
          ) : (
            <Text fz={14} c="var(--prune-text-gray-400)">
              —
            </Text>
          )}
        </TableTd>
        <TableTd>
          <Group gap={4} wrap="wrap">
            {row.answers?.services?.length ? (
              row.answers.services.map((s) => (
                <Badge
                  key={s.service}
                  variant="outline"
                  radius="xl"
                  size="xs"
                  fw={500}
                  tt="none"
                  style={{
                    fontFamily: "inherit",
                    fontSize: 11,
                    color: "#3D5200",
                    borderColor: "#C6D97A",
                    backgroundColor: "#F4F8E6",
                    padding: "3px 8px",
                  }}
                >
                  {s.service
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
              ))
            ) : (
              <Text fz={12} c="var(--prune-text-gray-400)">
                —
              </Text>
            )}
          </Group>
        </TableTd>
        <TableTd>
          <BadgeComponent
            stage
            status={stage}
            w="auto"
            h={26}
            px={10}
            fw={500}
            fz={12}
          />
        </TableTd>
      </TableTr>
    );
  });
};
