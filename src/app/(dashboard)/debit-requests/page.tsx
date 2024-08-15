"use client";
import dayjs from "dayjs";

// Mantine Imports
import { useDisclosure } from "@mantine/hooks";
import { Box, Divider, Drawer, Group, Modal, Paper } from "@mantine/core";
import { Button, TextInput, Table, TableScrollContainer } from "@mantine/core";
import { Text } from "@mantine/core";
import { TableTr, TableTd, TableTbody } from "@mantine/core";
import { Flex, TableTh, TableThead } from "@mantine/core";

// Tabler Imports
import { IconAlignCenter, IconPlus, IconX } from "@tabler/icons-react";
import { IconListTree, IconSearch } from "@tabler/icons-react";

// Lib Imports
import { DebitRequest, useUserDebitRequests } from "@/lib/hooks/requests";
import { DynamicSkeleton2 } from "@/lib/static";

// UI Imports
import styles from "./styles.module.scss";

// Asset Imports
import EmptyImage from "@/assets/empty.png";
import { Suspense, useState } from "react";
import { formatNumber } from "@/lib/utils";
import { useForm, zodResolver } from "@mantine/form";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import Filter from "@/ui/components/Filter";
import { useSearchParams } from "next/navigation";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { SearchInput } from "@/ui/components/Inputs";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import { TableComponent } from "@/ui/components/Table";
import DebitRequestModal from "./new/modal";

function DebitRequests() {
  const searchParams = useSearchParams();

  const { status, createdAt, sort } = Object.fromEntries(
    searchParams.entries()
  );

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const queryParams = {
    page: active,
    limit: parseInt(limit ?? "10", 10),
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    // ...(type && { type: type.toLowerCase() }),
  };

  const { loading, requests, meta } = useUserDebitRequests({
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    ...(createdAt && { date: dayjs(createdAt).format("DD-MM-YYYY") }),
    ...(status && { status: status.toLowerCase() }),
    ...(sort && { sort: sort.toLowerCase() }),
    page: active,
  });

  const [selectedRequest, setSelectedRequest] = useState<DebitRequest | null>(
    null
  );
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const searchIcon = <IconSearch style={{ width: 20, height: 20 }} />;

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
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
      <TableTd className={styles.table__td}>
        {element.Account.Company.name}
      </TableTd>
      <TableTd className={styles.table__td}>
        {formatNumber(element.amount, true, "EUR")}
      </TableTd>
      <TableTd className={styles.table__td}>
        {element.Account.accountNumber}
      </TableTd>
      <TableTd className={`${styles.table__td}`}>
        {dayjs(element.createdAt).format("ddd DD MMM YYYY")}
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
          <SearchInput />

          <Group gap={12}>
            <SecondaryBtn
              text="Filter"
              icon={IconAlignCenter}
              action={toggle}
            />
            <PrimaryBtn icon={IconPlus} text="New Request" action={open} />
          </Group>
        </Group>

        <Filter<FilterType> opened={openedFilter} toggle={toggle} form={form} />

        <TableComponent rows={rows} head={tableHeaders} loading={loading} />

        <EmptyTable
          rows={rows}
          loading={loading}
          title="There are no debit requests"
          text="When a request is created, it will appear here"
        />

        <PaginationComponent
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
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
        <DebitRequestModal close={close} />
      </Modal>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        withCloseButton={false}
        size="30%"
      >
        <Flex justify="space-between" pb={28}>
          <Text fz={18} fw={600} c="#1D2939">
            Debit Request Details
          </Text>

          <IconX onClick={closeDrawer} />
        </Flex>

        <Box>
          <Flex direction="column">
            <Text c="#8B8B8B" fz={12} tt="uppercase">
              Amount
            </Text>

            <Text c="#97AD05" fz={32} fw={600}>
              {formatNumber(selectedRequest?.amount || 0, true, "EUR")}
            </Text>
          </Flex>

          <Divider mt={30} mb={20} />

          <Text fz={16} mb={24}>
            Account Details
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
                Source Account:
              </Text>

              <Text fz={14}>{selectedRequest?.Account.accountName}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Date Created:
              </Text>

              <Text fz={14}>
                {dayjs(selectedRequest?.createdAt).format("DD MMM, YYYY")}
              </Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Status:
              </Text>

              <BadgeComponent status={selectedRequest?.status as string} />
            </Flex>
          </Flex>

          <Divider my={30} />

          <Text fz={16} mb={24}>
            Destination Details
          </Text>

          <Flex direction="column" gap={30}>
            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                IBAN
              </Text>

              <Text fz={14}>{selectedRequest?.destinationIBAN}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                BIC
              </Text>

              <Text fz={14}>{selectedRequest?.destinationBIC}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Country
              </Text>

              <Text fz={14}>{selectedRequest?.destinationCountry}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Bank
              </Text>

              <Text fz={14}>{selectedRequest?.destinationBank}</Text>
            </Flex>

            <Flex justify="space-between">
              <Text fz={14} c="#8B8B8B">
                Reference:
              </Text>

              <Text fz={14}>{selectedRequest?.reference}</Text>
            </Flex>
          </Flex>

          <Divider my={30} />

          <Text fz={16} c="#1D2939" fw={600}>
            Reason
          </Text>

          <div
            style={{
              marginTop: "15px",
              background: "#F9F9F9",
              padding: "12px 16px",
            }}
          >
            <Text fz={14} c="#667085">
              {selectedRequest?.reason || ""}
            </Text>
          </div>
        </Box>
      </Drawer>
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
  "Business Name",
  "Amount",
  "Source Account",
  "Date Created",
  "Status",
];
