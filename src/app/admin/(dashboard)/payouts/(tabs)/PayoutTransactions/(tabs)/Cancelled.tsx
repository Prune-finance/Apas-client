"use client";

import {
  TransactionType,
  usePayoutTransactions,
} from "@/lib/hooks/transactions";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";

import { PayoutTableHeaders } from "@/lib/static";

import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { PayoutTransactionTableRows } from "@/ui/components/TableRows";
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

export const CancelledPayoutTransactions = ({
  transactions,
  loading,
}: Props) => {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, { toggle }] = useDisclosure(false);

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
        head={PayoutTableHeaders}
        // rows={rows}
        rows={
          <PayoutTransactionTableRows
            data={transactions.toReversed()}
            searchProps={[
              "senderIban",
              "recipientIban",
              "recipientBic",
              "recipientBankAddress",
            ]}
            search={debouncedSearch}
            active={active}
            limit={limit}
          />
        }
        loading={loading}
      />

      <EmptyTable
        rows={transactions}
        loading={loading}
        title="There are no cancelled payout transactions"
        text="When a payout transaction is cancelled, it will appear here."
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil(
          (transactions.length ?? 0) / parseInt(limit ?? "10", 10)
        )}
      />
    </Box>
  );
};
