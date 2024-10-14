import { useUserPayoutTransactions } from "@/lib/hooks/transactions";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";

import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Group, TabsPanel } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { PayoutTableHeaders } from "@/lib/static";
import { PayoutTransactionTableRows } from "@/ui/components/TableRows";

export const PayoutsTab = () => {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const {
    status,
    date,
    endDate,
    type,
    recipientName,
    recipientIban,
    senderName,
  } = Object.fromEntries(searchParams.entries());

  const queryParams = {
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(recipientIban && { recipientIban }),
    ...(recipientName && { recipientName }),
    ...(senderName && { senderName }),
    ...(type && { type: type.toUpperCase() }),
    page: active,
    limit: parseInt(limit ?? "10", 10),
  };

  const { transactions, revalidate, loading } =
    useUserPayoutTransactions(queryParams);

  const [opened, { toggle }] = useDisclosure(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const infoDetails = [
    {
      title: "Total Balance",
      value: 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money In",
      value: 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value: 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Total Transactions",
      value: [].length,
    },
  ];

  // const infoDetails = [
  //   {
  //     title: "Total Balance",
  //     value: transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
  //     formatted: true,
  //     currency: "EUR",
  //   },
  //   {
  //     title: "Money In",
  //     value:
  //       transactions
  //         .filter((trx) => trx.type === "CREDIT")
  //         .reduce((prv, curr) => prv + curr.amount, 0) || 0,
  //     formatted: true,
  //     currency: "EUR",
  //   },
  //   {
  //     title: "Money Out",
  //     value:
  //       transactions
  //         .filter((trx) => trx.type === "DEBIT")
  //         .reduce((prv, curr) => prv + curr.amount, 0) || 0,
  //     formatted: true,
  //     currency: "EUR",
  //   },
  //   {
  //     title: "Total Transactions",
  //     value: transactions.length,
  //   },
  // ];

  const searchProps = ["senderIban", "recipientIban", "amount"];

  return (
    <>
      <InfoCards details={infoDetails} title="Overview" />
      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn
          text="Filter"
          action={toggle}
          icon={IconListTree}
          fw={600}
        />
      </Group>
      <Filter<FilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        approvalStatus
        customStatusOption={[
          "Confirmed",
          "Pending",
          "Failed",
          "Rejected",
          "Cancelled",
        ]}
      >
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
          data={["Debit", "Credit"]}
          clearable
        />
      </Filter>

      <TableComponent
        rows={
          <PayoutTransactionTableRows
            data={transactions}
            search={debouncedSearch}
            searchProps={searchProps}
          />
        }
        // rows={rows}
        loading={loading}
        head={PayoutTableHeaders}
      />

      <EmptyTable
        rows={transactions}
        loading={loading}
        title="There are no transactions"
        text="When a transaction is made, it will appear here"
      />
      <PaginationComponent
        total={Math.ceil([].length / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};
