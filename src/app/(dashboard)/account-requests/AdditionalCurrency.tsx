import {
  CurrencyRequest,
  useBusinessCurrencyRequests,
} from "@/lib/hooks/requests";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { BadgeComponent } from "@/ui/components/Badge";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import ModalComponent from "@/ui/components/Modal";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Box, Flex, Group, Modal, TableTd, TableTr, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCheck, IconListTree, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useState } from "react";
import CurrencyModal from "./currencyModal";
import AdvancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(AdvancedFormat);

function AdditionalCurrency() {
  const searchParams = useSearchParams();

  const { status, date, endDate, business } = Object.fromEntries(
    searchParams.entries()
  );
  const [selectedRequest, setSelectedRequest] =
    useState<CurrencyRequest | null>(null);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const [opened, { open, close }] = useDisclosure(false);

  const [openedFilter, { toggle }] = useDisclosure(false);

  const queryParams = {
    page: active,
    limit: parseInt(limit ?? "10", 10),
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(business && { business }),
    search: debouncedSearch,
  };

  const { currencyRequests, revalidate, loading, meta } =
    useBusinessCurrencyRequests({
      ...queryParams,
    });

  const rows = currencyRequests.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => {
        setSelectedRequest(element);
        open();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{element?.accountName}</TableTd>
      <TableTd>EUR</TableTd>
      <TableTd tt="capitalize">{element?.Currency?.symbol}</TableTd>
      <TableTd tt="capitalize">
        {element?.createdAt &&
          dayjs(element?.createdAt).format("Do MMMM, YYYY")}
      </TableTd>

      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <Fragment>
      <Group justify="space-between" mt={30}>
        <SearchInput value={search} setSearch={setSearch} />

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
        customStatusOption={["Approved", "Rejected", "Pending"]}
      >
        <TextBox
          placeholder="Business Name"
          {...form.getInputProps("business")}
        />
      </Filter>

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no requests"
        text="When an account is freezed, it will appear here"
      />

      <PaginationComponent
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />

      <CurrencyModal
        opened={opened}
        close={close}
        selectedRequest={selectedRequest}
      />
    </Fragment>
  );
}

const tableHeaders = [
  "Business Name",
  "Existing Currencies",
  "Requested Currency",
  "Date Requested",
  "Status",
];

export default AdditionalCurrency;
