import {
  TransactionType,
  useUserDefaultTransactions,
} from "@/lib/hooks/transactions";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Group } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import { IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";
import { OwnAccountTableHeaders } from "@/lib/static";
import { useSearchParams } from "next/navigation";
import { BusinessTransactionTableRows } from "@/ui/components/TableRows";
import { usePaginationReset } from "@/lib/hooks/pagination-reset";
import { calculateTotalPages } from "@/lib/utils";

export const AccountsTab = () => {
  const searchParams = useSearchParams();

  const [opened, { toggle }] = useDisclosure(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const { status, date, endDate, type, recipientName, recipientIban } =
    Object.fromEntries(searchParams.entries());

  const queryParams = {
    date: date ? dayjs(date).format("YYYY-MM-DD") : undefined,
    endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
    status: status?.toUpperCase(),
    recipientIban,
    recipientName,
    type: type?.toUpperCase(),
    page: active,
    limit: parseInt(limit ?? "10", 10),
    search: debouncedSearch,
  };

  const { transactions, loading, meta } =
    useUserDefaultTransactions(queryParams);
  usePaginationReset({ queryParams, setActive });

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const infoDetails = [
    {
      title: "Total Balance",
      value: meta?.totalAmount || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money In",
      value: meta?.in || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value: meta?.out || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Total Transactions",
      value: meta?.total || 0,
    },
  ];

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
          <BusinessTransactionTableRows data={transactions} business isUser />
        }
        loading={loading}
        head={OwnAccountTableHeaders}
      />

      <EmptyTable
        rows={transactions}
        loading={loading}
        title="There are no transactions"
        text="When a transaction is recorded, it will appear here"
      />
      <PaginationComponent
        // total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        total={calculateTotalPages(limit, meta?.total)}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};
