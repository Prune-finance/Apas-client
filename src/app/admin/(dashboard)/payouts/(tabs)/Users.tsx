"use client";

import { usePayoutAccount } from "@/lib/hooks/accounts";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import { BadgeComponent } from "@/ui/components/Badge";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Box, Group, Table, TableData, TableTd, TableTr } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";

export const Users = () => {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");

  const { accounts, revalidate, meta, loading } = usePayoutAccount();

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const tableData: TableData = {
    head: tableHeaders,
    body: filteredSearch(
      accounts ?? [],
      ["Company.name", "legalEntity"],
      debouncedSearch
    ).map((element, index) => [
      `${element.Company.name}`,
      dayjs(element.createdAt).format("Do MMM, YYYY"),
      <BadgeComponent status={element.status} active />,
    ]),
  };

  const rows = filteredSearch(
    accounts ?? [],
    ["Company.name", "legalEntity"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      //    onClick={() => handleRowClick(element.id)}
      onClick={() =>
        window.open(`/admin/payouts/${element.Company.id}/account`)
      }
      style={{ cursor: "pointer" }}
    >
      <TableTd>{`${element.Company.name}`}</TableTd>

      <TableTd>{dayjs(element.createdAt).format("Do MMM, YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.status} active />
      </TableTd>
    </TableTr>
  ));

  return (
    <Box mt={25}>
      <Group justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>

      <Filter<FilterType> opened={opened} form={form} toggle={toggle} />

      {/* <Table
        data={tableData}
        styles={{
          table: { borderColor: "#f5f5f5", marginTop: "30px" },
          th: {
            color: "var(--prune-text-gray-600)",
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "capitalize",
            letterSpacing: "0.5px",
          },
          td: {
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--prune-text-gray-800)",
          },
          thead: { backgroundColor: "#f9f9f9" },
        }}
        horizontalSpacing={"calc(100% / 6"}
      /> */}

      <TableComponent head={tableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no users requests"
        text="When a request is created, it will appear here."
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil(1 / parseInt(limit ?? "10", 10))}
      />
    </Box>
  );
};

const tableHeaders = ["Business Name", "Date Created", "Status"];
