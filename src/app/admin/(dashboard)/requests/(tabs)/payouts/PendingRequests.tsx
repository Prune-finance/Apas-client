import { PayoutRequestsTableHeaders } from "@/lib/static";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { PayoutTrxReqTableRows } from "@/ui/components/TableRows";
import { Group } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import {
  businessFilterSchema,
  BusinessFilterType,
  businessFilterValues,
} from "../../../businesses/schema";
import { parseError } from "@/lib/actions/auth";
import Filter from "@/ui/components/Filter";
import { useForm, zodResolver } from "@mantine/form";
import axios from "axios";
import useNotification from "@/lib/hooks/notification";
import Cookies from "js-cookie";

export const PendingPayoutRequests = () => {
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const { handleError, handleSuccess } = useNotification();

  const [openedFilter, { toggle }] = useDisclosure(false);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

  const handleRejectRequest = async () => {
    //  if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${
          process.env.NEXT_PUBLIC_PAYOUT_URL
        }/admin/debit/requests/${""}/reject`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      //    await revalidate();
      close();
      //    closeDrawer();
      handleSuccess("Action Completed", "Request Denied");
    } catch (error) {
      handleError("An error occurred", parseError(error));
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptRequest = async () => {
    //  if (!selectedRequest) return;
    setProcessing(true);
    try {
      await axios.post(
        `${
          process.env.NEXT_PUBLIC_PAYOUT_URL
        }/admin/debit/requests/${""}/approve`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get("auth")}` } }
      );

      //    await revalidate();
      //    closeApprove();
      //    closeDrawer();
      handleSuccess("Action Completed", "Request Approved");
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
            active={active}
            limit={limit}
            search={debouncedSearch}
            data={[]}
            searchProps={["Transaction.centrolinkRef", "type"]}
          />
        }
        loading={false}
      />

      <EmptyTable
        rows={[]}
        loading={false}
        title="There are no data here for now"
        text="When a payout request is made, it will appear here."
      />

      <PaginationComponent
        total={Math.ceil(0 / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />
    </Fragment>
  );
};
