"use client";

import { PayoutTransactionDrawer } from "@/app/(dashboard)/payouts/PayoutDrawer";
import { usePayoutTransactions } from "@/lib/hooks/transactions";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";

import { PayoutTableHeaders } from "@/lib/static";

import { SecondaryBtn } from "@/ui/components/Buttons";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { PayoutTransactionTableRows } from "@/ui/components/TableRows";
import { Box, Group } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useSearchParams } from "next/navigation";

dayjs.extend(advancedFormat);
import { useMemo, useState } from "react";

export const CancelledPayoutTransactions = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, { toggle }] = useDisclosure(false);

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const searchParams = useSearchParams();

  const { date, endDate, type, senderName, recipientName, recipientIban } =
    Object.fromEntries(searchParams.entries());

  const param = useMemo(() => {
    return {
      status: "CANCELLED",
      ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
      ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
      ...(type && { type }),
      ...(senderName && { senderName }),
      ...(recipientName && { recipientName }),
      ...(recipientIban && { recipientIban }),
      page: active,
      limit: parseInt(limit ?? "10", 10),
      search: debouncedSearch,
    };
  }, [
    date,
    endDate,
    type,
    senderName,
    recipientName,
    recipientIban,
    active,
    limit,
    debouncedSearch,
  ]);
  const { transactions, loading, meta, revalidate } =
    usePayoutTransactions(param);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  return (
    <Box mt={25}>
      <Group justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn
          text="Filter"
          action={toggle}
          icon={IconListTree}
          fw={600}
        />
      </Group>

      <Filter<FilterType> opened={opened} toggle={toggle} form={form} isStatus>
        <TextBox
          placeholder="Sender Name"
          {...form.getInputProps("senderName")}
        />
        <TextBox
          placeholder="Beneficiary Name"
          {...form.getInputProps("recipientName")}
        />
        <TextBox
          placeholder="Beneficiary IBAN"
          {...form.getInputProps("recipientIban")}
        />
        <SelectBox
          placeholder="Type"
          {...form.getInputProps("type")}
          data={["DEBIT", "CREDIT"]}
        />
      </Filter>

      <TableComponent
        head={PayoutTableHeaders}
        // rows={rows}
        rows={<PayoutTransactionTableRows data={transactions} />}
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
          (meta?.total || transactions.length) / parseInt(limit ?? "10", 10)
        )}
      />

      <PayoutTransactionDrawer revalidate={revalidate} />
    </Box>
  );
};
