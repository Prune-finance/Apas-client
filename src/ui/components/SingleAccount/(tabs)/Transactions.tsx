import { Drawer, Group, TableTd, TableTr } from "@mantine/core";
import {
  IconListTree,
  IconArrowUpRight,
  IconCircleArrowDown,
} from "@tabler/icons-react";
import { SecondaryBtn } from "../../Buttons";
import InfoCards from "../../Cards/InfoCards";
import EmptyTable from "../../EmptyTable";
import { SearchInput, SelectBox, TextBox } from "../../Inputs";
import { TableComponent } from "../../Table";
import { TransactionType } from "@/lib/hooks/transactions";
import { formatNumber } from "@/lib/utils";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useRouter } from "next/navigation";
import { BadgeComponent } from "../../Badge";
import Transaction from "@/lib/store/transaction";
import { AccountTransactionDrawer } from "./drawer";
import { PayoutDrawer } from "@/app/(dashboard)/payouts/drawer";
import { IssuedAccountTableHeaders, PayoutTableHeaders } from "@/lib/static";
import { AmountGroup } from "../../AmountGroup";
import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import {
  IssuedTransactionTableRows,
  PayoutTransactionTableRows,
} from "../../TableRows";
import { useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { filteredSearch } from "@/lib/search";
import PaginationComponent from "../../Pagination";
import { PayoutTransactionDrawer } from "@/app/(dashboard)/payouts/PayoutDrawer";
import form from "@/app/auth/login/form";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import Filter from "../../Filter";
import { useForm, zodResolver } from "@mantine/form";

interface Props {
  transactions: TransactionType[];
  loading: boolean;
  payout?: boolean;
}

export const Transactions = ({ transactions, loading, payout }: Props) => {
  const totalBal = transactions.reduce((prv, curr) => prv + curr.amount, 0);
  const { data, opened, close } = Transaction();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [openedFilter, { toggle }] = useDisclosure(false);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const overviewDetails = [
    {
      title: "Total Transactions",
      value: transactions?.length,
      // currency: "EUR",
      // formatted: true,
    },
    {
      title: "Money In",
      value:
        transactions
          .filter((trx) => trx.type === "CREDIT")
          .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      currency: "EUR",
      formatted: true,
    },
    {
      title: "Money Out",
      value:
        transactions
          .filter((trx) => trx.type === "DEBIT")
          .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      currency: "EUR",
      formatted: true,
    },
  ];
  return (
    <>
      <InfoCards title="Overview" details={overviewDetails} />

      <Group mt={32} justify="space-between">
        <SearchInput search={search} setSearch={setSearch} />

        <Group gap={12}>
          <SecondaryBtn
            action={toggle}
            text="Filter"
            icon={IconListTree}
            fw={600}
          />

          <SecondaryBtn
            text="Download Statement"
            icon={IconCircleArrowDown}
            style={{ cursor: "not-allowed" }}
            fw={600}
          />
        </Group>
      </Group>

      <Filter<FilterType>
        opened={openedFilter}
        toggle={toggle}
        form={form}
        customStatusOption={["PENDING", "COMPLETED", "REJECTED", "CANCELLED"]}
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
          data={["DEBIT", "CREDIT"]}
          clearable
        />
      </Filter>

      <TableComponent
        rows={
          payout ? (
            <PayoutTransactionTableRows
              data={transactions}
              active={active}
              limit={limit}
              searchProps={searchProps}
              search={debouncedSearch}
            />
          ) : (
            <IssuedTransactionTableRows
              data={transactions}
              active={active}
              limit={limit}
              searchProps={searchProps}
              search={debouncedSearch}
            />
          )
        }
        head={payout ? PayoutTableHeaders : IssuedAccountTableHeaders}
        loading={loading}
      />

      <EmptyTable
        loading={loading}
        rows={transactions}
        title="There are no transactions for this account"
        text="When a transaction is recorded, it will appear here"
      />

      <PaginationComponent
        active={active}
        setActive={setActive}
        setLimit={setLimit}
        limit={limit}
        total={Math.ceil(
          filteredSearch(transactions, searchProps, search).length /
            parseInt(limit ?? "10", 10)
        )}
      />

      {!payout && (
        <TransactionDrawer
          opened={opened}
          close={close}
          selectedRequest={data}
        />
      )}

      {payout && <PayoutTransactionDrawer />}
    </>
  );
};

const searchProps = [
  "senderIban",
  "recipientIban",
  "recipientBankAddress",
  "senderName",
  "recipientName",
];
