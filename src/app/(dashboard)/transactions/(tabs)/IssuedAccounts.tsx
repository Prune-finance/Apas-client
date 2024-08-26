import form from "@/app/auth/login/form";
import {
  TransactionType,
  TrxData,
  useUserDefaultTransactions,
  useUserTransactions,
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
import { useUserAccounts } from "@/lib/hooks/accounts";
import { useSearchParams } from "next/navigation";

export const IssuedAccountsTab = () => {
  const searchParams = useSearchParams();
  const { status, createdAt, sort, type } = Object.fromEntries(
    searchParams.entries()
  );

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  // const { loading, accounts, revalidate, meta } = useUserAccounts({
  //   ...(isNaN(Number(limit))
  //     ? { limit: 10 }
  //     : { limit: parseInt(limit ?? "10", 10) }),
  //   ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
  //   ...(status && { status: status.toUpperCase() }),
  //   ...(sort && { sort: sort.toLowerCase() }),
  //   ...(type && { type: type.toUpperCase() }),
  //   page: active,
  // });

  const { transactions, revalidate, loading } = useUserTransactions();

  const [opened, { toggle }] = useDisclosure(false);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [selectedRequest, setSelectedRequest] =
    useState<TransactionType | null>(null);

  const form = useForm<FilterType>({
    initialValues: filterValues,
    validate: zodResolver(filterSchema),
  });

  const searchProps = ["senderIban", "recipientIban", "amount"];

  const rows = filteredSearch(transactions, searchProps, debouncedSearch).map(
    (element) => (
      <TableTr
        key={element.id}
        onClick={() => {
          // window.location.href = `/transactions/${element.senderIban}`;
          setSelectedRequest(element);
          openDrawer();
        }}
        style={{ cursor: "pointer" }}
      >
        <TableTd
          className={styles.table__td}
          td="underline"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/transactions/${element.senderIban}`;
          }}
        >
          {element.senderIban}
        </TableTd>
        <TableTd className={styles.table__td}>{element.recipientIban}</TableTd>
        <TableTd className={styles.table__td}>
          <Flex align="center" gap={5}>
            <IconArrowUpRight
              color="#D92D20"
              size={16}
              className={styles.table__td__icon}
            />
            {formatNumber(element.amount, true, "EUR")}
          </Flex>
        </TableTd>

        <TableTd className={styles.table__td}>
          {dayjs(element.createdAt).format("Do MMMM, YYYY - hh:mm a")}
        </TableTd>
        <TableTd className={styles.table__td}>
          <BadgeComponent status={element.status} />
        </TableTd>
      </TableTr>
    )
  );

  return (
    <TabsPanel value="Issued Accounts">
      <Group justify="space-between" mt={30}>
        <SearchInput search={search} setSearch={setSearch} />

        <SecondaryBtn text="Filter" action={toggle} icon={IconListTree} />
      </Group>
      <Filter<FilterType> opened={opened} toggle={toggle} form={form} />

      <TableComponent rows={rows} loading={loading} head={tableHeaders} />

      <EmptyTable
        rows={rows}
        loading={loading}
        title="There are no accounts"
        text="When an account is created, it will appear here"
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

const tableHeaders = [
  "Sender Name",
  "Beneficiary Name",
  "Amount",
  "Date Created",
  "Status",
];
