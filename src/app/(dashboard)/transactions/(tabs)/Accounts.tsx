import {
  TransactionType,
  TrxData,
  useUserDefaultTransactions,
} from "@/lib/hooks/transactions";
import { filterSchema, FilterType, filterValues } from "@/lib/schema";
import { filteredSearch } from "@/lib/search";
import { frontendPagination, formatNumber } from "@/lib/utils";
import { BadgeComponent } from "@/ui/components/Badge";
import { SecondaryBtn } from "@/ui/components/Buttons";
import InfoCards from "@/ui/components/Cards/InfoCards";
import EmptyTable from "@/ui/components/EmptyTable";
import Filter from "@/ui/components/Filter";
import { SearchInput } from "@/ui/components/Inputs";
import PaginationComponent from "@/ui/components/Pagination";
import { TableComponent } from "@/ui/components/Table";
import { Flex, Group, TableTd, TableTr, TabsPanel } from "@mantine/core";
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

export const AccountsTab = () => {
  const { transactions, loading } = useUserDefaultTransactions();

  const [opened, { toggle }] = useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [selectedRequest, setSelectedRequest] =
    useState<TransactionType | null>(null);

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
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
      value: 0,
      formatted: true,
      currency: "EUR",
    },
    {
      title: "Money Out",
      value: transactions.reduce((prv, curr) => prv + curr.amount, 0) || 0,
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
      key={element.id}
      onClick={() => {
        setSelectedRequest(element);
        openDrawer();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd className={styles.table__td}>
        {element.recipientName || element.recipientIban}
      </TableTd>
      <TableTd className={styles.table__td}>
        <AmountGroup type={element.type} fz={12} fw={400} />
      </TableTd>
      <TableTd>{formatNumber(element.amount, true, "EUR")}</TableTd>
      <TableTd className={styles.table__td}>{element.reference}</TableTd>

      <TableTd className={styles.table__td}>
        {dayjs(element.createdAt).format("Do MMMM, YYYY - hh:mma")}
      </TableTd>
      <TableTd className={styles.table__td}>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));

  return (
    <TabsPanel value="Own Account">
      <InfoCards details={infoDetails} title="Overview" />

      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>
      <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

      <TableComponent
        rows={rows}
        loading={loading}
        head={OwnAccountTableHeaders}
      />

      <EmptyTable
        rows={rows}
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

      <TransactionDrawer
        opened={openedDrawer}
        close={closeDrawer}
        selectedRequest={selectedRequest}
      />
    </TabsPanel>
  );
};

// const tableHeaders = [
//   "Recipient IBAN",
//   "Bank",
//   "Reference",
//   "Amount",
//   "Date Created",
//   "Status",
// ];
