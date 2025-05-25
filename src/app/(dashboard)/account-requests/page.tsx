"use client";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

// Mantine Imports
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { Box, Group, Image, Paper, TabsPanel } from "@mantine/core";

import { Text, Pagination } from "@mantine/core";
import { TableTr, TableTd } from "@mantine/core";

// Tabler Imports
import { IconCircleDashedPlus, IconUsers, IconX } from "@tabler/icons-react";
import { IconTrash, IconListTree, IconSearch } from "@tabler/icons-react";

// Lib Imports
import {
  RequestData,
  useRequests,
  useUserRequests,
} from "@/lib/hooks/requests";

// UI Imports
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import ModalComponent from "@/ui/components/Modal";
import styles from "./styles.module.scss";

// Asset Imports
import { Suspense, useState } from "react";
import useNotification from "@/lib/hooks/notification";
import { useSearchParams } from "next/navigation";
import { useForm, zodResolver } from "@mantine/form";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import Filter from "@/ui/components/Filter";
import { BadgeComponent } from "@/ui/components/Badge";
import EmptyTable from "@/ui/components/EmptyTable";
import PaginationComponent from "@/ui/components/Pagination";
import { AccountRequestsDrawer } from "./drawer";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import { filteredSearch } from "@/lib/search";
import { TableComponent } from "@/ui/components/Table";
import { SecondaryBtn } from "@/ui/components/Buttons";
import { getUserType } from "@/lib/utils";
import createAxiosInstance from "@/lib/axios";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";
import TabsComponent from "@/ui/components/Tabs";
import AccountRequestIcon from "@/assets/account-req-icon.png";
import AdditionalCurrency from "./AdditionalCurrency";

const axios = createAxiosInstance("accounts");

function AccountRequests() {
  const searchParams = useSearchParams();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { status, date, endDate, firstName, lastName, country, type } =
    Object.fromEntries(searchParams.entries());

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
    firstName,
    lastName,
    country,
    status: status?.toUpperCase(),
    type: type ? (type === "Individual" ? "USER" : "CORPORATE") : undefined,
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
  };

  const { loading, requests, revalidate, meta } = useUserRequests(queryParams);
  usePaginationReset({ queryParams, setActive });
  const { handleSuccess } = useNotification();
  const [opened, { open, close }] = useDisclosure(false);
  const [cancelOpened, { open: cancelOpen, close: cancelClose }] =
    useDisclosure(false);
  const [rowId, setRowId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const [openedFilter, { toggle }] = useDisclosure(false);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const cancelRequest = async (id: string) => {
    setProcessing(true);
    try {
      await axios.patch(`/accounts/requests/${id}/cancel`, {});

      revalidate();
      handleSuccess("Action Completed", "Account frozen");
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const rows = filteredSearch(
    requests,
    ["firstName", "lastName", "country", "accountName"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      style={{ cursor: "pointer" }}
      key={index}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
    >
      <TableTd tt="capitalize">{element.firstName}</TableTd>
      <TableTd tt="capitalize">{element.lastName}</TableTd>
      <TableTd tt="capitalize">{element?.country}</TableTd>
      <TableTd tt="capitalize">{getUserType(element.accountType)}</TableTd>
      <TableTd>{dayjs(element.createdAt).format("Do MMMM, YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>

      {/* <TableTd className={`${styles.table__td}`}>
        <MenuComponent id={element.id} status={element.status} />
      </TableTd> */}
    </TableTr>
  ));

  return (
    <main className={styles.main}>
      <Paper className={styles.table__container}>
        <div className={styles.container__header}>
          <Box>
            <Text fz={18} fw={600}>
              Account Requests
            </Text>

            <Text fz={14} fw={400} c="#667085" mt={4}>
              Here’s an overview of your requested accounts
            </Text>
          </Box>
        </div>

        <TabsComponent
          tabs={accountRequestTabs}
          mt={30}
          tt="capitalize"
          fz={12}
          style={{ position: "relative" }}
        >
          <TabsPanel value={accountRequestTabs[0].value}>
            <AdditionalCurrency />
          </TabsPanel>

          <TabsPanel value={accountRequestTabs[1].value}>
            <Group justify="space-between" mt={30}>
              <SearchInput search={search} setSearch={setSearch} />

              <SecondaryBtn
                text="Filter"
                action={toggle}
                icon={IconListTree}
                fw={600}
              />
            </Group>

            <Filter<FilterType>
              opened={openedFilter}
              toggle={toggle}
              form={form}
              approvalStatus
              customStatusOption={["Approved", "Pending", "Rejected"]}
            >
              <TextBox
                placeholder="First Name"
                {...form.getInputProps("firstName")}
              />

              <TextBox
                placeholder="Last Name"
                {...form.getInputProps("lastName")}
              />

              <TextBox
                placeholder="Country"
                {...form.getInputProps("country")}
              />

              <SelectBox
                placeholder="Type"
                {...form.getInputProps("type")}
                data={["Corporate", "Individual"]}
                clearable
              />
            </Filter>

            <TableComponent head={tableHeaders} rows={rows} loading={loading} />

            <EmptyTable
              rows={rows}
              loading={loading}
              title="There are no account requests"
              text="When a request is created, it will appear here"
            />

            <PaginationComponent
              total={Math.ceil(
                (meta?.total ?? 0) / parseInt(limit ?? "10", 10)
              )}
              active={active}
              setActive={setActive}
              limit={limit}
              setLimit={setLimit}
            />
          </TabsPanel>
        </TabsComponent>
      </Paper>

      <ModalComponent
        processing={processing}
        action={() => cancelRequest(rowId || "")}
        color="#F2F4F7"
        icon={<IconX color="#344054" />}
        opened={cancelOpened}
        close={cancelClose}
        title="Cancel Account Request?"
        text="You are about to cancel this account request"
      />

      <ModalComponent
        color="#FEF3F2"
        icon={<IconTrash color="#D92D20" />}
        opened={opened}
        close={close}
        title="Delete Account Request?"
        text="You are about to delete this account request"
      />

      <AccountRequestsDrawer
        opened={drawerOpened}
        close={closeDrawer}
        selectedRequest={selectedRequest}
        revalidate={revalidate}
        setSelectedRequest={setSelectedRequest}
      />
    </main>
  );
}

const accountRequestTabs = [
  { value: "Additional Currency", icon: <IconCircleDashedPlus size={18} /> },
  {
    value: "Issued Account Request",
    icon: <Image src={AccountRequestIcon.src} h={18} w={18} alt="icon" />,
  },
];

const tableHeaders = [
  "First Name",
  "Last Name",
  "Country(short)",
  "Type",
  "Date Created",
  "Status",
];

export default function AccountRequestsSus() {
  return (
    <Suspense>
      <AccountRequests />
    </Suspense>
  );
}
