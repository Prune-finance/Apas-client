"use client";

import { usePayoutTransactions } from "@/lib/hooks/transactions";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import { PayoutTableHeaders } from "@/lib/static";
import { formatNumber } from "@/lib/utils";
import { AmountGroup } from "@/ui/components/AmountGroup";
import { BadgeComponent } from "@/ui/components/Badge";
import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Box, Group, TableTd, TableTr } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";

export const PayoutTransactions = () => {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, { toggle }] = useDisclosure(false);

  const { transactions, loading, meta, revalidate } = usePayoutTransactions();

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const rows = filteredSearch(
    transactions,
    ["senderIban", "recipientIban", "recipientBic", "recipientBankAddress"],
    debouncedSearch
  ).map((element, index) => (
    <TableTr
      key={index}
      //    onClick={() => handleRowClick(element.id)}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{`${"N/A"}`}</TableTd>
      <TableTd>{`${element.senderIban}`}</TableTd>
      <TableTd>{element.reference}</TableTd>
      <TableTd>{element.recipientName}</TableTd>
      <TableTd>
        <AmountGroup type={element.type} />
      </TableTd>
      <TableTd>{formatNumber(element.amount, true, "EUR")}</TableTd>
      <TableTd>{"N/A"}</TableTd>

      <TableTd>{dayjs(element.createdAt).format("Do MMMM YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.status} w={100} />
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

      <TableComponent head={PayoutTableHeaders} rows={rows} loading={loading} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no payout transactions"
        text="When a payout transaction is created, it will appear here."
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

const data = [
  {
    name: "John Doe",
    createdAt: new Date(),
    status: "PENDING",
    amount: 300,
    type: "DEBIT",
    recipientName: "Bilkis Lawal",
  },
  {
    name: "John Jane",
    createdAt: new Date(),
    status: "SUCCESSFUL",
    amount: 300,
    type: "DEBIT",
    recipientName: "Bilkis Lawal",
  },
  {
    name: "John Doe",
    createdAt: new Date(),
    status: "REJECTED",
    amount: 300,
    type: "DEBIT",
    recipientName: "Bilkis Lawal",
  },
];
