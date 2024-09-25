import form from "@/app/auth/login/form";
import { RequestData, useUserRequests } from "@/lib/hooks/requests";
import { filterSchema, filterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import { BadgeComponent } from "@/ui/components/Badge";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Group, Select, TableTd, TableTr } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { Fragment, useState } from "react";
import { AccountRequestsDrawer } from "../account-requests/drawer";
import { getUserType } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export const PendingAccounts = () => {
  const searchParams = useSearchParams();
  const { type, createdAt } = Object.fromEntries(searchParams.entries());

  const [openedFilter, { toggle }] = useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const { loading, requests, revalidate, meta } = useUserRequests({
    ...(isNaN(Number(limit))
      ? { limit: 10 }
      : { limit: parseInt(limit ?? "10", 10) }),
    status: "PENDING",
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(type && { type: type === "Individual" ? "USER" : "CORPORATE" }),
    page: active,
  });

  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(
    null
  );

  const form = useForm({
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
      <TableTd tt="capitalize">{`${element.firstName} ${element.lastName}`}</TableTd>
      <TableTd tt="capitalize">{element?.country}</TableTd>
      <TableTd tt="capitalize">
        {getUserType(element.accountType ?? "USER")}
      </TableTd>
      {/* <TableTd className={styles.table__td}>{element.Company.name}</TableTd> */}
      <TableTd>{dayjs(element.createdAt).format("Do MMMM, YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
      {/* <TableTd>
        {element.}
      </TableTd> */}

      {/* <TableTd className={`${styles.table__td}`}>
        <MenuComponent id={element.id} status={element.status} />
      </TableTd> */}
    </TableTr>
  ));
  return (
    <Fragment>
      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} />
      </Group>

      <Filter
        opened={openedFilter}
        toggle={toggle}
        form={form}
        approvalStatus
        isStatus
      >
        <Select
          placeholder="Type"
          {...form.getInputProps("type")}
          data={["Corporate", "Individual"]}
          size="xs"
          w={120}
          h={36}
        />
      </Filter>

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no accounts"
        text="When an account is created, it will appear here"
      />

      <PaginationComponent
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />

      <AccountRequestsDrawer
        opened={drawerOpened}
        close={closeDrawer}
        selectedRequest={selectedRequest}
        revalidate={revalidate}
        setSelectedRequest={setSelectedRequest}
      />
    </Fragment>
  );
};

const tableHeaders = [
  "Account Name",
  "Country",
  "Account Type",
  "Date Created",
  "Status",
];
