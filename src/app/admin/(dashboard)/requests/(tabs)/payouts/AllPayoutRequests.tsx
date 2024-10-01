import { PayoutRequestsTableHeaders } from "@/lib/static";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import { SearchInput } from "@/ui/components/Inputs";
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
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [openedFilter, { toggle }] = useDisclosure(false);

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

  const { requests, loading, meta } = usePayoutTransactionRequests({
    limit: parseInt(limit ?? "10", 10),
    page: active,
    not: "PENDING",
  });

  const { data, opened, close } = Transaction();

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
        total={Math.ceil(0 / parseInt(limit ?? "10", 10))}
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
