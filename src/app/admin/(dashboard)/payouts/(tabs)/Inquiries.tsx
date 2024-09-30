"use client";

import { useInquiries } from "@/lib/hooks/inquiries";
import { TransactionType } from "@/lib/hooks/transactions";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";

import { inquiriesData, InquiriesTableHeaders } from "@/lib/static";

import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { InquiryTableRows } from "@/ui/components/TableRows";
import { Box, Group } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";

interface Props {
  transactions: TransactionType[];
  loading: boolean;
}

export const InquiriesTab = () => {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, { toggle }] = useDisclosure(false);

  const { inquiries, loading, meta } = useInquiries();

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  return (
    <Box mt={25}>
      <Group justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>

      <Filter<FilterType> opened={opened} form={form} toggle={toggle} />

      <TableComponent
        head={InquiriesTableHeaders}
        rows={
          <InquiryTableRows
            data={inquiries}
            searchProps={["Company.name", "Transaction.centrolinkRef", "type"]}
            search={debouncedSearch}
          />
        }
        loading={loading}
      />

      <EmptyTable
        rows={inquiries}
        loading={loading}
        title="There are no inquiry"
        text="When an inquiry is made, it will appear here."
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
      />
    </Box>
  );
};
