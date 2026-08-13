import { FilterType } from "@/lib/schema";
import { Meta, TransactionType } from "@/lib/hooks/transactions";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { BusinessTransactionTableRows } from "@/ui/components/TableRows";
import { OwnAccountTableHeaders } from "@/lib/static";
import { calculateTotalPages } from "@/lib/utils";
import { Box, Group, LoadingOverlay } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Dispatch, SetStateAction } from "react";
import { IconListTree } from "@tabler/icons-react";

interface Props {
  transactions: TransactionType[];
  loading: boolean;
  meta: Meta | null | undefined;
  currency: string;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  opened: boolean;
  toggle: () => void;
  form: UseFormReturnType<FilterType>;
  active: number;
  setActive: (v: number) => void;
  limit: string | null;
  setLimit: (v: string | null) => void;
}

export const CurrencyAccount = ({
  transactions,
  loading,
  meta,
  currency,
  search,
  setSearch,
  opened,
  toggle,
  form,
  active,
  setActive,
  limit,
  setLimit,
}: Props) => {
  const infoDetails = [
    {
      title: "Total Balance",
      value: meta?.totalAmount || 0,
      formatted: true,
      currency,
    },
    {
      title: "Money In",
      value: meta?.in || 0,
      formatted: true,
      currency,
    },
    {
      title: "Money Out",
      value: meta?.out || 0,
      formatted: true,
      currency,
    },
    {
      title: "Total Transactions",
      value: meta?.total || 0,
    },
  ];

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={10}
        overlayProps={{ radius: "sm", blur: 1 }}
        loaderProps={{ size: "md" }}
      />

      <InfoCards details={infoDetails} title="Overview" />

      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />
        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} fw={600} />
      </Group>

      <Filter<FilterType>
        opened={opened}
        toggle={toggle}
        form={form}
        approvalStatus
        customStatusOption={["Confirmed", "Pending", "Failed", "Rejected", "Cancelled"]}
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
        rows={<BusinessTransactionTableRows data={transactions} business isUser />}
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
        total={calculateTotalPages(limit, meta?.total)}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />
    </Box>
  );
};
