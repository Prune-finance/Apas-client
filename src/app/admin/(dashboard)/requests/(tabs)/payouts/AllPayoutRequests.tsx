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
import {
  BusinessFilterType,
  businessFilterValues,
  businessFilterSchema,
} from "../../../businesses/schema";
import Filter from "@/ui/components/Filter";
import {
  Meta,
  PayoutTransactionRequest,
  usePayoutTransactionRequests,
} from "@/lib/hooks/requests";
import Transaction from "@/lib/store/transaction";

import { PayoutTransactionRequestDrawer } from "./drawer";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";

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
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(beneficiaryName && { beneficiaryName }),
    ...(destinationIban && { destinationIban }),
    ...(destinationBank && { destinationBank }),
    ...(senderIban && { senderIban }),
    limit: parseInt(limit ?? "100", 10),
    page: active,
    not: "PENDING",
  };

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [openedFilter, { toggle }] = useDisclosure(false);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });
  // {
  //     limit: parseInt(limit ?? "10", 10),
  //     page: active,
  //     not: "PENDING",
  //   }
  const { requests, loading, meta } = usePayoutTransactionRequests(queryParams);

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
        rows={
          <PayoutTrxReqTableRows
            search={debouncedSearch}
            data={requests}
            searchProps={["Transaction", "type"]}
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
      />
    </Fragment>
  );
};
