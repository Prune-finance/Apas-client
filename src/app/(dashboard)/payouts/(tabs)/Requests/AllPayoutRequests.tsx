import { PayoutRequestsTableHeaders } from "@/lib/static";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { SearchInput, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { PayoutTrxReqTableRows } from "@/ui/components/TableRows";
import { Group } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import Filter from "@/ui/components/Filter";
import {
  Meta,
  PayoutTransactionRequest,
  useUserPayoutTransactionRequests,
} from "@/lib/hooks/requests";
import Transaction from "@/lib/store/transaction";

import { PayoutTransactionRequestDrawer } from "./drawer";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { PayoutReqSearchProps } from ".";
import { calculateTotalPages } from "@/lib/utils";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";

interface Props {
  requests: PayoutTransactionRequest[];
  loading: boolean;
  meta?: Meta;
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<string | null>>;
  limit: string | null;
}

export const AllPayoutRequests = () => {
  const searchParams = useSearchParams();
  const [limit, setLimit] = useState<string | null>("100");
  const [active, setActive] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const {
    status,
    endDate,
    date,
    beneficiaryName,
    destinationIban,
    senderIban,
    destinationBank,
  } = Object.fromEntries(searchParams.entries());

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
    status: status?.toUpperCase(),
    beneficiaryName,
    destinationIban,
    destinationBank,
    senderIban,
    limit: parseInt(limit ?? "100", 10),
    page: active,
    not: "PENDING",
    search: debouncedSearch,
  };

  const [openedFilter, { toggle }] = useDisclosure(false);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const { requests, loading, meta } =
    useUserPayoutTransactionRequests(queryParams);
  usePaginationReset({ queryParams, setActive });

  const { data, opened, close } = Transaction();

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
        customStatusOption={["Approved", "Rejected"]}
      >
        <TextBox
          placeholder="Beneficiary Name"
          {...form.getInputProps("beneficiaryName")}
        />

        <TextBox
          placeholder="Beneficiary IBAN"
          {...form.getInputProps("destinationIban")}
        />

        <TextBox
          placeholder="Sender IBAN"
          {...form.getInputProps("senderIban")}
        />

        <TextBox
          placeholder="Bank"
          {...form.getInputProps("destinationBank")}
        />
      </Filter>

      <TableComponent
        head={PayoutRequestsTableHeaders}
        rows={<PayoutTrxReqTableRows data={requests} />}
        loading={loading}
      />

      <EmptyTable
        rows={requests}
        loading={loading}
        title="There are no data here for now"
        text="When a payout request is made, it will appear here."
      />

      <PaginationComponent
        total={calculateTotalPages(limit, meta?.total)}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />

      <PayoutTransactionRequestDrawer
        selectedRequest={data}
        opened={opened}
        close={close}
      />
    </Fragment>
  );
};
