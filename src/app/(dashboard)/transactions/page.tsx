"use client";
import dayjs from "dayjs";

import { Box, Divider, Drawer, Group, Paper } from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { Text } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Flex, TableTh, TableThead } from "@mantine/core";

import styles from "./styles.module.scss";
import {
  IconArrowUpRight,
  IconSearch,
  IconListTree,
  IconX,
  IconPointFilled,
} from "@tabler/icons-react";

import { DynamicSkeleton2 } from "@/lib/static";
import { formatNumber, frontendPagination } from "@/lib/utils";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  TrxData,
  useTransactions,
  useUserTransactions,
} from "@/lib/hooks/transactions";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import Filter from "@/ui/components/Filter";
import { Suspense, useState } from "react";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { filteredSearch } from "@/lib/search";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { TableComponent } from "@/ui/components/Table";
import { SearchInput } from "@/ui/components/Inputs";
import InfoCards from "@/ui/components/Cards/InfoCards";

function AccountTrx() {
  const searchParams = useSearchParams();
  const [selectedRequest, setSelectedRequest] = useState<TrxData | null>(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { status, createdAt, sort } = Object.fromEntries(
    searchParams.entries()
  );

  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { loading, transactions } = useUserTransactions(undefined, {
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { createdAt: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    page: active,
  });

  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;
  const [opened, { toggle }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const searchProps = ["recipientIban", "recipientBankAddress", "reference"];

  const rows = frontendPagination(
    filteredSearch(transactions, searchProps, debouncedSearch),
    active,
    parseInt(limit ?? "10", 10)
  ).map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
      <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd>
      <TableTd className={styles.table__td}>{element.reference}</TableTd>
      {/* <TableTd className={styles.table__td}>{dayjs().format()}</TableTd> */}
      <TableTd className={`${styles.table__td}`}>
        <Flex align="center" gap={5}>
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            className={styles.table__td__icon}
            // style={{ marginTop: "-20px" }}
          />
          {formatNumber(element.amount, true, "EUR")}
        </Flex>
        {/* <Text fz={12}></Text> */}
      </TableTd>
      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("DD MMM, YYYY")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const infoDetails = [
    {
      title: "Total Balance",
      value: transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money In",
      value: 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value: transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
    },
  ];

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs
        items={[
          {
            title: "Transactions",
            href: `/accounts/transactions`,
          },
        ]}
      /> */}

      <Paper className={styles.table__container}>
        <div className={styles.container__header}>
          <Flex gap={10} align="center">
            {/* <UnstyledButton onClick={() => router.back()}>
              <ThemeIcon color="rgba(212, 243, 7)" radius="lg">
                <IconArrowLeft
                  color="#1D2939"
                  style={{ width: "70%", height: "70%" }}
                />
              </ThemeIcon>
            </UnstyledButton> */}

            <Text fz={18} fw={600}>
              Transactions
            </Text>
          </Flex>
        </div>

        <InfoCards details={infoDetails} title="Overview" />
        <Group justify="space-between" mt={30}>
          <SearchInput search={search} setSearch={setSearch} />

          <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
        </Group>
        <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

        <TableComponent rows={rows} loading={loading} head={tableHeaders} />

        <EmptyTable
          rows={rows}
          loading={loading}
          title="There are no transactions"
          text="When a transaction is recorded, it will appear here"
        />
        <PaginationComponent
          total={Math.ceil(transactions.length / parseInt(limit ?? "10", 10))}
          active={active}
          setActive={setActive}
          limit={limit}
          setLimit={setLimit}
        />
      </Paper>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        withCloseButton={false}
        size="30%"
      >
        <Flex justify="space-between" pb={28}>
          <Text fz={18} fw={600} c="#1D2939">
            Transaction Details
          </Text>

          <IconX onClick={closeDrawer} />
        </Flex>

        <Box>
          <Flex direction="column">
            <Text c="#8B8B8B" fz={12}>
              Amount Sent
            </Text>

            <Text c="#97AD05" fz={32} fw={600}>
              {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
            </Text>
          </Flex>

          <Divider mt={30} mb={20} />

          <Text fz={16} mb={24}>
            Receiver Details
          </Text>

          <Flex direction="column" gap={30}>
            {/* <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Business Name:
              </Text>

              <Text fz={14}>{selectedRequest?.Account.Company.name}</Text>
            </Flex> */}

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Account IBAN:
              </Text>

              <Text fz={14}>{selectedRequest?.recipientIban}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Bank:
              </Text>

              <Text fz={14}>{selectedRequest?.recipientBankAddress}</Text>
            </Flex>
          </Flex>

          <Divider my={30} />

          <Text fz={16} mb={24}>
            Other Details
          </Text>

          <Flex direction="column" gap={30}>
            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Alert Type
              </Text>

              <Flex align="center">
                <IconArrowUpRight
                  color="#F04438"
                  size={16}
                  className={styles.table__td__icon}
                  // style={{ marginTop: "-20px" }}
                />

                <Text c="#F04438" fz={14}>
                  Debit
                </Text>
              </Flex>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Date and Time
              </Text>

              <Text fz={14}>
                {dayjs(selectedRequest?.createdAt).format(
                  "DD MMMM, YYYY - HH:mm"
                )}
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Transaction ID
              </Text>

              <Text fz={14}>{selectedRequest?.id}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Status:
              </Text>

              <Box bg="#FFFAEB" p={5} style={{ borderRadius: "3px" }}>
                <Flex align="center">
                  <IconPointFilled size={14} color="#C6A700" />
                  <Text c="#C6A700" tt="capitalize" fz={14}>
                    {selectedRequest?.status.toLocaleLowerCase()}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Drawer>
    </main>
  );
}

export default function AccountTrxSuspense() {
  return (
    <Suspense>
      <AccountTrx />
    </Suspense>
  );
}

const tableHeaders = [
  "Recipient IBAN",
  "Bank",
  "Reference",
  "Amount",
  "Date Created",
  "Status",
];
