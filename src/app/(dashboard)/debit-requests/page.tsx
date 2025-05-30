"use client";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

// Mantine Imports
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Group, Modal, Paper } from "@mantine/core";
import { Text } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";

// Tabler Imports
import { IconAlignCenter, IconPlus } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";

// Lib Imports
import { DebitRequest, useUserDebitRequests } from "@/lib/hooks/requests";

// UI Imports
import styles from "./styles.module.scss";

// Asset Imports
import { Suspense, useState } from "react";
import { calculateTotalPages, formatNumber } from "@/lib/utils";
import { useForm, zodResolver } from "@mantine/form";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import Filter from "@/ui/components/Filter";
import { useSearchParams } from "next/navigation";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TableComponent } from "@/ui/components/Table";
import DebitRequestModal from "./new/modal";
import { DebitRequestDrawer } from "./drawer";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";

function DebitRequests() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const searchParams = useSearchParams();

  const { status, date, endDate, accountName } = Object.fromEntries(
    searchParams.entries()
  );

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
    status: status?.toUpperCase(),
    accountName,
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
    // type: type?.toLowerCase(),
  };

  const { loading, requests, meta, revalidate } =
    useUserDebitRequests(queryParams);
  usePaginationReset({ queryParams, setActive });

  const [selectedRequest, setSelectedRequest] = useState<DebitRequest | null>(
    null
  );
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const rows = requests.map((element, index) => (
    <TableTr
      style={{ cursor: "pointer" }}
      key={index}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
    >
      {/* <TableTd className={styles.table__td}>
        {element.Account.Company.name}
      </TableTd> */}
      <TableTd className={styles.table__td}>
        {formatNumber(element.amount, true, "EUR")}
      </TableTd>
      <TableTd className={styles.table__td}>
        {element.Account.accountName}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("Do MMMM YYYY - hh:mma")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

  return (
    <main className={styles.main}>
      {/* <Breadcrumbs
        items={[
          // { title: "Dashboard", href: "/dashboard" },
          { title: "Debit Requests", href: "/debit-requests" },
        ]}
      /> */}

      <Paper className={styles.table__container}>
        <div className={styles.container__header}>
          <Text fz={18} fw={600}>
            Debit Requests
          </Text>
        </div>

        <Group justify="space-between" mt={30}>
          <SearchInput search={search} setSearch={setSearch} />

          <Group gap={12}>
            <SecondaryBtn
              text="Filter"
              icon={IconAlignCenter}
              action={toggle}
              fw={600}
            />
            <PrimaryBtn icon={IconPlus} text="New Request" action={open} />
          </Group>
        </Group>

        <Filter<FilterType>
          opened={openedFilter}
          toggle={toggle}
          form={form}
          approvalStatus
        >
          <TextBox
            placeholder="Account Name"
            {...form.getInputProps("accountName")}
          />
        </Filter>

        <TableComponent rows={rows} head={tableHeaders} loading={loading} />

        <EmptyTable
          rows={rows}
          loading={loading}
          title="There are no debit requests"
          text="When a request is created, it will appear here"
        />

        <PaginationComponent
          total={calculateTotalPages(limit, meta?.total)}
          active={active}
          setActive={setActive}
          limit={limit}
          setLimit={setLimit}
        />
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        size={"50%"}
        withCloseButton={false}
      >
        <DebitRequestModal close={close} revalidate={revalidate} />
      </Modal>

      <DebitRequestDrawer
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
        opened={drawerOpened}
        close={closeDrawer}
        revalidate={revalidate}
      />
    </main>
  );
}

export default function DebitReqSuspense() {
  return (
    <Suspense>
      <DebitRequests />
    </Suspense>
  );
}

const tableHeaders = [
  // "Business Name",
  "Amount",
  "Source Account",
  "Date Created",
  "Status",
];
