import {
  TransactionType,
  TrxData,
  useUserDefaultTransactions,
} from "@/lib/hooks/transactions";
import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import { frontendPagination, formatNumber } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput, SelectBox, TextBox } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import {
  Flex,
  Group,
  Stack,
  TableTd,
  TableTr,
  TabsPanel,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import { IconArrowUpRight, IconListTree } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useState } from "react";
import styles from "../styles.module.scss";
import { TransactionDrawer } from "../drawer";
import { OwnAccountTableHeaders } from "@/lib/static";
import { AmountGroup } from "@/ui/components/AmountGroup";
import { useSearchParams } from "next/navigation";
import { BusinessTransactionTableRows } from "@/ui/components/TableRows";
import Transaction from "@/lib/store/transaction";

export const AccountsTab = () => {
  const searchParams = useSearchParams();

  const [opened, { toggle }] = useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [selectedRequest, setSelectedRequest] =
    useState<TransactionType | null>(null);

  const { status, date, endDate, type, recipientName, recipientIban } =
    Object.fromEntries(searchParams.entries());

  const queryParams = {
    ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
    ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
    ...(status && { status: status.toUpperCase() }),
    ...(recipientIban && { recipientIban }),
    ...(recipientName && { recipientName }),
    ...(type && { type: type.toUpperCase() }),
    page: active,
    limit: parseInt(limit ?? "10", 10),
  };

  const { transactions, loading } = useUserDefaultTransactions(queryParams);

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const infoDetails = [
    {
      title: "Total Balance",
      value: transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money In",
      value:
        transactions
          .filter((trx) => trx.type === "CREDIT")
          .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value:
        transactions
          .filter((trx) => trx.type === "DEBIT")
          .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
    },
  ];

  const searchProps = ["recipientIban", "recipientBankAddress", "reference"];

  const rows = frontendPagination(
    filteredSearch(transactions, searchProps, debouncedSearch),
    active,
    parseInt(limit ?? "10", 10)
  ).map((element) => (
    <TableTr
      key={element?.id}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>
        <Stack>
          <Text fz={12} fw={400}>
            {element?.recipientName}
          </Text>
          <Text fz={10} fw={400}>
            {element.recipientIban}
          </Text>
        </Stack>
      </TableTd>
      <TableTd className={styles.table__td}>
        <AmountGroup type={element?.type} fz={12} fw={400} />
      </TableTd>
      <TableTd>{formatNumber(element?.amount, true, "EUR")}</TableTd>
      <TableTd w="20%" className={styles.table__td}>
        {element?.centrolinkRef}
      </TableTd>

      <TableTd className={styles.table__td}>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {dayjs(element?.createdAt).format("Do MMMM, YYYY")}
          </Text>
          <Text fz={10} fw={400}>
            {dayjs(element?.createdAt).format("hh:mm a")}
          </Text>
        </Stack>
      </TableTd>
      <TableTd className={styles.table__td}>
        <BadgeComponent status={element?.status} />
      </TableTd>
    </TableTr>
  ));

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
          <BusinessTransactionTableRows
            data={transactions}
            search={debouncedSearch}
            active={active}
            limit={limit}
            searchProps={searchProps}
            business
          />
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
        total={Math.ceil(transactions.length / parseInt(limit ?? "10", 10))}
        active={active}
        setActive={setActive}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};
