import useNotification from "@/lib/hooks/notification";
import { DebitRequest, useCompanyDebitRequests } from "@/lib/hooks/requests";
import { filteredSearch } from "@/lib/search";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";

import { useParams } from "next/navigation";
import { useState } from "react";
import { parseError } from "@/lib/actions/auth";
import { calculateTotalPages, formatNumber } from "@/lib/utils";

import { BadgeComponent } from "@/ui/components/Badge";
import { TableTr, TableTd, Box, Group } from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";

import DebitDrawer from "@/app/admin/(dashboard)/requests/drawer";
import PaginationComponent from "@/ui/components/Pagination";
import { debitTableHeaders } from "@/lib/static";
import { SearchInput } from "@/ui/components/Inputs";
import createAxiosInstance from "@/lib/axios";

export const Debit = () => {
  const { id } = useParams<{ id: string }>();
  const axios = createAxiosInstance("payouts");

  const [limit, setLimit] = useState<string | null>("10");
  const [active, setActive] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { loading, requests, revalidate, meta } = useCompanyDebitRequests(id, {
    search: debouncedSearch,
    limit: parseInt(limit ?? "10", 10),
    page: active,
  });

  const [selectedRequest, setSelectedRequest] = useState<DebitRequest | null>(
    null
  );

  const { handleSuccess, handleError } = useNotification();
  const [processing, setProcessing] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `/admin/debit/requests/${selectedRequest.id}/reject`,
        {}
      );

      await revalidate();
      close();
      closeDrawer();
      handleSuccess("Action Completed", "Request Denied");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `/admin/debit/requests/${selectedRequest.id}/approve`,
        {}
      );

      await revalidate();
      closeApprove();
      closeDrawer();
      handleSuccess("Action Completed", "Request Approved");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  // filteredSearch(
  //   requests,
  //   ["destinationFirstName", "destinationLastName"],
  //   debouncedSearch
  // );

  const rows = requests.map((element, index) => (
    <TableTr
      key={index}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      style={{ cursor: "pointer" }}
      tt="capitalize"
    >
      <TableTd>{element.Account.accountName}</TableTd>
      <TableTd>{formatNumber(element.amount, true, "EUR")}</TableTd>

      <TableTd>{dayjs(element.createdAt).format("Do, MMMM, YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));
  return (
    <Box>
      <Group mt={32} justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        {/* <Group>
          <Select
            placeholder="Type"
            data={["All", "Freeze", "Unfreeze", "Activate", "Deactivate"]}
            w={120}
            styles={{ option: { fontSize: 12 }, input: { fontSize: 12 } }}
            value={type}
            onChange={(e) => setType(e)}
          />
          <SecondaryBtn
            icon={IconListTree}
            action={toggle}
            text="Filter"
            fw={600}
          />
        </Group> */}
      </Group>
      <TableComponent head={debitTableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no debit requests"
        text="When a debit request is made, it will appear here"
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={calculateTotalPages(limit, meta?.total)}
      />

      <DebitDrawer
        opened={drawerOpened}
        close={closeDrawer}
        selectedRequest={selectedRequest}
        revalidate={revalidate}
      />
    </Box>
  );
};
