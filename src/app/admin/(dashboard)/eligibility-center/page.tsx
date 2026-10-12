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
  Text,
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

const HERO_WAVE_PATHS = [
  "M0 190.183C230.134 318.683 354.184 488.16 425.728 626.804C485.367 742.392 484.309 789.675 547.637 875.912C685.065 1063.05 948.323 1192.09 1075.91 1031.28C1138.76 952.058 1115.51 851.668 1145.58 661.623C1172.62 490.664 1242.55 255.536 1437.77 7.62939e-06",
  "M0.463539 231.634C224.307 342.07 347.116 501.506 418.623 631.259C478.789 740.465 483.681 784.136 550.947 868.891C692.056 1046.69 939.289 1170.48 1067.06 1020.42C1132.87 943.141 1117.9 844.468 1153.12 654.98C1184.14 488.157 1255.49 257.05 1447.35 3.80571",
  "M0.909836 273.098C218.458 365.476 340.123 514.912 411.513 635.733C472.331 738.662 482.928 778.622 554.252 861.89C698.73 1030.56 930.632 1149.17 1058.2 1009.6C1127.12 934.193 1120.17 837.387 1160.67 648.364C1195.52 485.717 1268.43 258.601 1456.94 7.6601",
  "M1.3827 314.535C212.627 388.854 333.267 528.325 404.421 640.209C465.969 736.934 482.073 773.115 557.592 854.849C705.152 1014.63 922.365 1128.14 1049.38 998.731C1121.54 925.21 1122.36 830.352 1168.25 641.708C1206.78 483.277 1281.4 260.119 1466.52 11.4638",
  "M1.84836 355.989C206.816 412.238 326.551 541.76 397.327 644.643C459.713 735.321 481.145 767.681 560.888 847.836C711.275 998.955 914.396 1107.49 1040.51 987.887C1116.07 916.233 1124.38 823.385 1175.78 635.074C1217.87 480.87 1294.34 261.653 1476.09 15.3182",
  "M2.28322 397.451C200.952 435.641 319.973 555.21 390.218 649.115C453.576 733.813 480.053 762.337 564.194 840.826C717.178 983.548 906.739 1087.19 1031.65 977.058C1110.74 907.316 1126.26 816.461 1183.33 628.449C1228.83 478.467 1307.27 263.201 1485.66 19.1239",
  "M2.74574 438.911C195.12 459.014 313.594 568.6 383.125 653.585C447.594 732.385 478.905 757.083 567.512 833.82C722.907 968.392 899.372 1067.27 1022.81 966.22C1105.56 898.478 1128.06 809.535 1190.88 621.828C1239.68 476.039 1320.24 264.747 1495.24 22.962",
  "M3.24276 480.366C189.322 482.428 307.447 581.917 376.066 658.045C441.813 730.991 477.726 751.933 570.863 826.803C728.499 953.483 892.288 1047.69 1014 955.373C1100.54 889.738 1129.74 802.588 1198.48 615.19C1250.41 473.571 1333.19 266.3 1504.85 26.784",
  "M3.68906 521.816C183.474 505.819 301.466 595.107 368.956 662.51C436.176 729.621 476.392 746.944 574.169 819.781C733.92 938.827 885.373 1028.48 1005.14 944.531C1095.59 881.142 1131.22 795.582 1206.02 608.553C1261.01 471.052 1346.15 267.813 1514.45 30.6059",
  "M4.13535 563.263C177.63 529.208 295.705 608.122 361.846 666.968C430.697 728.22 475.009 742.028 577.47 812.763C739.205 924.411 878.616 1009.61 996.276 933.681C1090.74 872.722 1132.58 788.506 1213.56 601.913C1271.48 468.468 1359.09 269.347 1524 34.4258",
  "M4.61513 604.723C171.836 552.604 290.201 620.927 354.774 671.432C425.472 726.733 473.609 737.296 580.808 805.745C744.452 910.236 872.05 991.109 987.449 922.844C1086.03 864.527 1133.83 781.339 1221.13 595.281C1281.88 465.821 1372.06 270.888 1533.6 38.264",
  "M5.07867 646.179C165.984 575.995 284.893 633.456 347.682 675.897C420.429 725.076 472.164 732.726 584.127 798.734C749.621 896.287 865.589 972.932 978.606 912.002C1081.39 856.591 1134.94 774.059 1228.69 588.654C1292.18 463.095 1385.01 272.424 1543.19 42.0859",
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
  const { stats, loading: statsLoading } = useQuestionnairesStats();

  const isLoading = loading || statsLoading;

  const InfoCards = [
    { title: "Total leads", num: stats?.totalLeads, icon: IconUsersGroup, iconBg: "#D1FAE5", iconColor: "#059669" },
    { title: "Total approved", num: stats?.approved, icon: IconCircleCheck, iconBg: "#D1FAE5", iconColor: "#059669" },
    { title: "Total onboarded", num: stats?.onboarded, icon: IconBuildingSkyscraper, iconBg: "#F2F4F7", iconColor: "#344054" },
    { title: "Pending", num: stats?.pending, icon: IconClock, iconBg: "#FEF3C7", iconColor: "#D97706" },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.table__container}>
        {/* Page header */}
        <div className={classes.hero}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <Text fz={28} fw={700} c="var(--prune-text-gray-800)" style={{ fontFamily: "'EksellDisplay', serif" }}>
              Eligibility Center
            </Text>
            <Text fz={14} c="var(--prune-text-gray-500)" mt={4}>
              Manage business applications and onboarding.
            </Text>
          </div>

          {/* Prune brand wave decoration */}
          <div className={classes.hero__wave}>
            <svg
              viewBox="200 0 1240 1200"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {HERO_WAVE_PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="var(--prune-primary-700)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity={+(0.3 - i * 0.018).toFixed(3)}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Stat cards */}
        <Grid align="stretch" mb={8}>
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
                  {isLoading ? (
                    <Skeleton w={60} h={32} mt={4} />
                  ) : (
                    <Text fz={30} fw={600} c="var(--prune-text-gray-800)" lh={1.2} mt={4}>
                      {d.num ?? 0}
                    </Text>
                  )}
                </Box>

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
          columnWidths={["25%", "15%", "10%", "30%", "20%"]}
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
              {row.answers?.legalBusinessName || row.answers?.contactName || "—"}
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
            <Text fz={14} c="var(--prune-text-gray-400)">—</Text>
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
                  {s.service.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
              ))
            ) : (
              <Text fz={12} c="var(--prune-text-gray-400)">—</Text>
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
