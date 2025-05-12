import useNotification from "@/lib/hooks/notification";
import { CurrencyRequest, useCurrencyRequests } from "@/lib/hooks/requests";
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
import { IconCheck, IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useState } from "react";
import SingleCurrencyModal from "./SingleCurrencyModal";

function OperationAccount() {
  const searchParams = useSearchParams();

  const { status, date, endDate, business } = Object.fromEntries(
    searchParams.entries()
  );
  const { handleError, handleSuccess } = useNotification();
  const [selectedRequest, setSelectedRequest] =
    useState<CurrencyRequest | null>(null);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [
    currencyApproveOpened,
    { open: currencyOpenApprove, close: currencyCloseApprove },
  ] = useDisclosure(false);
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

  const { currencyRequests, revalidate, loading, meta } = useCurrencyRequests({
    ...queryParams,
  });

  const rows = currencyRequests.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => {
        setSelectedRequest(element);
        openApprove();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{element?.accountName}</TableTd>
      <TableTd tt="capitalize">{element?.Currency?.symbol}</TableTd>
      <TableTd></TableTd>

      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

  const data = {
    accountName: selectedRequest?.accountName,
    requestedDate: selectedRequest?.createdAt,
    status: selectedRequest?.status,
  };

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });
  return (
    <Fragment>
      <Group justify="space-between">
        <SearchInput />

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

      <SingleCurrencyModal
        approveOpened={approveOpened}
        currencyOpenApprove={currencyOpenApprove}
        closeApprove={() => {
          closeApprove();
          // setSelectedRequest(null);
        }}
        selectedRequest={selectedRequest}
      />

      <ModalComponent
        size={400}
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={currencyApproveOpened}
        close={currencyCloseApprove}
        action={() => {}}
        processing={false}
        title="GBP Account Request Approval"
        text="This means you are approving the request for GBP account for this business."
        customApproveMessage="Yes, Approve"
      />
    </Fragment>
  );
}

const tableHeaders = [
  "Business Name",
  "Requested Currency",
  "Existing Currencies",
  "Status",
];

export default OperationAccount;
