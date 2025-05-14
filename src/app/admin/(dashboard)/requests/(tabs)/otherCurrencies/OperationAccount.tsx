import useNotification from "@/lib/hooks/notification";
import { CurrencyRequest, useCurrencyRequests } from "@/lib/hooks/requests";
import {
  currencyRequest,
  FilterSchema,
  FilterType,
  FilterValues,
} from "@/lib/schema";
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
import SingleCurrencyModal from "./SingleCurrencyModal";
import RejectModalComponent from "./RejectCurrencyModal";
import axios from "axios";
import { parseError } from "@/lib/actions/auth";
import Cookies from "js-cookie";

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
  const [processing, setProcessing] = useState(false);
  const [approveOpened, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [
    currencyApproveOpened,
    { open: currencyOpenApprove, close: currencyCloseApprove },
  ] = useDisclosure(false);
  const [
    currencyRejectedOpened,
    { open: currencyRejectedApprove, close: currencyRejectApprove },
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
      <TableTd>EUR</TableTd>

      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const requestForm = useForm({
    initialValues: {
      reason: "",
      supportingDocumentName: "",
      supportingDocumentUrl: "",
    },
    validate: zodResolver(currencyRequest),
  });

  const handleRejectCurrencyRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      const { reason, supportingDocumentName, supportingDocumentUrl } =
        requestForm.values;

      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/currency-account/admin-reject-business-currency-account-request/${selectedRequest?.id}`,
        {
          rejectComment: reason,
          ...(supportingDocumentName && { supportingDocumentName }),
          ...(supportingDocumentUrl && { supportingDocumentUrl }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      currencyRejectApprove();
      handleSuccess(
        `${selectedRequest?.Currency?.symbol} Operations account Rejected`,
        `Request for ${selectedRequest?.Currency?.symbol} rejected`
      );
      setSelectedRequest(null);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleApprovedCurrencyRequest = async () => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_URL}/currency-account/admin-approve-business-currency-account-request/${selectedRequest?.id}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      currencyCloseApprove();
      closeApprove();
      handleSuccess(
        `${selectedRequest?.Currency?.symbol} Operations account Approved`,
        `Request for ${selectedRequest?.Currency?.symbol} approved`
      );
      setSelectedRequest(null);
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Fragment>
      <Group justify="space-between">
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
        text="When an Operation account is requested, it will appear here"
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
        currencyRejectedApprove={currencyRejectedApprove}
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
        action={handleApprovedCurrencyRequest}
        processing={processing}
        title="GBP Account Request Approval"
        text="This means you are approving the request for GBP account for this business."
        customApproveMessage="Yes, Approve"
      />

      <RejectModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={currencyRejectedOpened}
        close={currencyRejectApprove}
        action={handleRejectCurrencyRequest}
        processing={processing}
        title="Reject This Account Issuance Request?"
        text="This means you are rejecting the account issuance request of this business."
        customApproveMessage="Yes, Reject"
        form={requestForm}
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
