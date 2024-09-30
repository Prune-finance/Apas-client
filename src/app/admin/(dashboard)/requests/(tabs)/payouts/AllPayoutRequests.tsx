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
import { Fragment, useState } from "react";
import {
  BusinessFilterType,
  businessFilterValues,
  businessFilterSchema,
} from "../../../businesses/schema";
import Filter from "@/ui/components/Filter";

export const AllPayoutRequests = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const [openedFilter, { toggle }] = useDisclosure(false);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const form = useForm<BusinessFilterType>({
    initialValues: businessFilterValues,
    validate: zodResolver(businessFilterSchema),
  });

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
