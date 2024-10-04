import { PayoutRequestsTableHeaders } from "@/lib/static";
import { PrimaryBtn, SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { PayoutTrxReqTableRows } from "@/ui/components/TableRows";
import { Group } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCheck, IconListTree, IconX } from "@tabler/icons-react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";

import { parseError } from "@/lib/actions/auth";
import Filter from "@/ui/components/Filter";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import Cookies from "js-cookie";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { usePayoutTransactionRequests } from "@/lib/hooks/requests";
import Transaction from "@/lib/store/transaction";
import { notifications } from "@mantine/notifications";
import { PayoutTransactionRequestDrawer } from "./drawer";
import ModalComponent from "@/ui/components/Modal";

export const PendingPayoutRequests = () => {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [reason, setReason] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const { handleError, handleSuccess, handleInfo } = useNotification();

  const [openedFilter, { toggle }] = useDisclosure(false);
  const [openedApprove, { open: openApprove, close: closeApprove }] =
    useDisclosure(false);
  const [openedReject, { open: openReject, close: closeReject }] =
    useDisclosure(false);

  const { requests, loading, meta, revalidate } = usePayoutTransactionRequests({
    limit: parseInt(limit ?? "10", 10),
    page: active,
    status: "PENDING",
  });

  const { data, opened, close } = Transaction();

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const handleRequest = async (type: "reject" | "approve") => {
    notifications.clean();

    if (!data) return;

    if (type === "reject" && !reason)
      return handleInfo(
        "Please provide a reason for rejecting the payout transaction request.",
        ""
      );

    setProcessing(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PAYOUT_URL}/admin/transaction/requests/${data.id}/${type}`,
        {
          ...(type === "reject" && { reason }),
        },
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      revalidate();
      close();
      if (type === "approve") closeApprove();
      if (type === "reject") closeReject();

      handleSuccess(
        "Action Completed",
        `Request ${type === "reject" ? "rejected" : "approved"} successfully`
      );
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

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>

      {/* <Filter<BusinessFilterType>
        opened={openedFilter}
        toggle={toggle}
        form={form}
      /> */}

      <TableComponent
        head={PayoutRequestsTableHeaders}
        rows={
          <PayoutTrxReqTableRows
            search={debouncedSearch}
            data={requests}
            searchProps={[
              "beneficiaryFullName",
              "destinationIBAN",
              "destinationCountry",
              "destinationBank",
            ]}
          />
        }
        loading={loading}
      />

      <EmptyTable
        rows={requests}
        loading={loading}
        title="There are no data here for now"
        text="When a payout request is made, it will appear here."
      />

      <PaginationComponent
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />

      <PayoutTransactionRequestDrawer
        selectedRequest={data}
        opened={opened}
        close={close}
      >
        <Group justify="end" pr={28} mt={20}>
          <SecondaryBtn
            icon={IconX}
            text="Reject"
            fw={600}
            action={openReject}
          />

          <PrimaryBtn
            icon={IconCheck}
            text="Approve"
            fw={600}
            action={openApprove}
          />
        </Group>
      </PayoutTransactionRequestDrawer>

      <ModalComponent
        color="#FEF3F2"
        icon={<IconX color="#D92D20" />}
        opened={openedReject}
        close={closeReject}
        action={() => handleRequest("reject")}
        processing={processing}
        title="Reject This Payout Transaction Request?"
        text="This means you are rejecting the request to send money out of this account."
        customApproveMessage="Yes, Reject It"
        reason={reason}
        setReason={setReason}
        addReason
      />

      <ModalComponent
        color="#ECFDF3"
        icon={<IconCheck color="#12B76A" />}
        opened={openedApprove}
        close={closeApprove}
        action={() => handleRequest("approve")}
        processing={processing}
        title="Approve This Payout Transaction Request?"
        text="This means you are approving the request to disburse money from this account."
        customApproveMessage="Yes, Approve It"
      />
    </Fragment>
  );
};
