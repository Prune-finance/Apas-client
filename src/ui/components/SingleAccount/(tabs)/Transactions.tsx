import { Drawer, Group, TableTd, TableTr } from "@mantine/core";
import {
  IconListTree,
  IconArrowUpRight,
  IconCircleArrowDown,
} from "@tabler/icons-react";
import { SecondaryBtn } from "../../Buttons";
import InfoCards from "../../Cards/InfoCards";
import EmptyTable from "../../EmptyTable";
import { SearchInput } from "../../Inputs";
import { TableComponent } from "../../Table";
import { TransactionType } from "@/lib/hooks/transactions";
import { formatNumber } from "@/lib/utils";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { BadgeComponent } from "../../Badge";
import Transaction from "@/lib/store/transaction";
import { AccountTransactionDrawer } from "./drawer";

interface Props {
  transactions: TransactionType[];
  loading: boolean;
}

export const Transactions = ({ transactions, loading }: Props) => {
  const totalBal = transactions.reduce((prv, curr) => prv + curr.amount, 0);

  const overviewDetails = [
    {
      title: "Total Balance",
      value: totalBal,
      currency: "EUR",
      formatted: true,
    },
    { title: "Money In", value: 0, currency: "EUR", formatted: true },
    { title: "Money Out", value: totalBal, currency: "EUR", formatted: true },
  ];
  return (
    <>
      <InfoCards title="Overview" details={overviewDetails} />

      <Group mt={32} justify="space-between">
        <SearchInput />

        <Group gap={12}>
          <SecondaryBtn text="Filter" icon={IconListTree} />
          <SecondaryBtn text="Filter" icon={IconArrowUpRight} />
          <SecondaryBtn text="Download Statement" icon={IconCircleArrowDown} />
        </Group>
      </Group>

      <TableComponent
        rows={<RowComponent data={transactions} />}
        head={tableHeaders}
        loading={loading}
      />

      <EmptyTable
        loading={loading}
        rows={transactions}
        title="There are no transactions for this account"
        text="When a transaction is recorded, it will appear here"
      />

      <AccountTransactionDrawer />
    </>
  );
};

const tableHeaders = [
  "Beneficiary",
  "IBAN",
  // "Account Number",
  "Amount",
  "Date",
  "Status",
];

const RowComponent = ({
  data,
}: // id,
{
  data: TransactionType[];
  // id: string;
}) => {
  const { push } = useRouter();
  const handleRowClick = (id: string) => {
    push(`/admin/accounts/${id}/transactions`);
  };

  const { setData, open } = Transaction();
  return data.map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        // handleRowClick(element.id);
        setData(element);
        open();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd>{element.senderIban}</TableTd>
      {/* <TableTd className={styles.table__td}>
        {element.recipientBankAddress}
      </TableTd> */}
      <TableTd>{element.recipientIban}</TableTd>
      <TableTd>
        <Group gap={3}>
          <IconArrowUpRight
            color="#D92D20"
            size={16}
            // className={styles.table__td__icon}
          />
          {formatNumber(element.amount, true, "EUR")}
          {/* <Text fz={12}></Text> */}
        </Group>
      </TableTd>
      <TableTd>{dayjs(element.createdAt).format("DD MMM, YYYY")}</TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));
};
