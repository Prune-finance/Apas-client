"use client";

import { useUserInquiries } from "@/lib/hooks/inquiries";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";

import { InquiriesTableHeaders } from "@/lib/static";

import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, SelectBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { InquiryTableRows } from "@/ui/components/TableRows";
import { Box, Group } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useSearchParams } from "next/navigation";

dayjs.extend(advancedFormat);
import { useState } from "react";

export const InquiriesTab = () => {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const { status, type, date, endDate } = Object.fromEntries(
    searchParams.entries()
  );

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, { toggle }] = useDisclosure(false);

  const queryParams = {
    ...(type && { type: type.toUpperCase() }),
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    limit: parseInt(limit ?? "10", 10),
    page: active,
  };

  const { inquiries, loading, meta } = useUserInquiries(queryParams);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <Box mt={25}>
      <Group justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>

      <Filter<FilterType>
        opened={opened}
        form={form}
        toggle={toggle}
        customStatusOption={["Closed", "Processing"]}
      >
        <SelectBox
          placeholder="Type"
          {...form.getInputProps("type")}
          data={["Query", "Recall", "Trace"]}
          clearable
        />
      </Filter>

      <TableComponent
        head={InquiriesTableHeaders.slice(1)}
        rows={
          <InquiryTableRows
            data={inquiries}
            // data={inquiriesData}
            searchProps={["Transaction.centrolinkRef", "type", "status"]}
            search={debouncedSearch}
            business
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
