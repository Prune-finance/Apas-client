import useNotification from "@/lib/hooks/notification";
import { DebitRequest, useCompanyDebitRequests } from "@/lib/hooks/requests";
import { filteredSearch } from "@/lib/search";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { parseError } from "@/lib/actions/auth";
import { formatNumber } from "@/lib/utils";
import Cookies from "js-cookie";
import { BadgeComponent } from "@/ui/components/Badge";
import { TableTr, TableTd, Box } from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { TableComponent } from "@/ui/components/Table";
import EmptyTable from "@/ui/components/EmptyTable";

import DebitDrawer from "@/app/admin/(dashboard)/requests/drawer";
import PaginationComponent from "@/ui/components/Pagination";
import { debitTableHeaders } from "@/lib/static";

export const Debit = () => {
  const { id } = useParams<{ id: string }>();

  const { loading, requests, revalidate, meta } = useCompanyDebitRequests(id);
  const [selectedRequest, setSelectedRequest] = useState<DebitRequest | null>(
    null
  );

  const { handleSuccess, handleError } = useNotification();
  const [limit, setLimit] = useState<string | null>("10");
  const [active, setActive] = useState(1);
  const [processing, setProcessing] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/debit/requests/${selectedRequest.id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
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

  const rows = filteredSearch(
    requests,
    ["destinationFirstName", "destinationLastName"],
    debouncedSearch
  ).map((element, index) => (
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
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
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
