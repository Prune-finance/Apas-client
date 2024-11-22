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
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { useRouter } from "next/navigation";
import { BadgeComponent } from "../../Badge";
import Transaction from "@/lib/store/transaction";
import { PayoutDrawer } from "@/app/(dashboard)/payouts/drawer";
import { IssuedAccountTableHeaders } from "@/lib/static";
import { AmountGroup } from "../../AmountGroup";
import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";

interface Props {
  transactions: TransactionType[];
  loading: boolean;
  payout?: boolean;
}

export const Transactions = ({ transactions, loading, payout }: Props) => {
  const totalBal = transactions.reduce((prv, curr) => prv + curr.amount, 0);
  const { data, opened, close } = Transaction();

  const overviewDetails = [
    {
      title: "Total Transactions",
      value: transactions?.length,
      // currency: "EUR",
      // formatted: true,
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
          {/* <SecondaryBtn text="Filter" icon={IconArrowUpRight} /> */}
          <SecondaryBtn text="Download Statement" icon={IconCircleArrowDown} />
        </Group>
      </Group>

      <TableComponent
        rows={
          payout ? (
            <PayoutRowComponent data={transactions} />
          ) : (
            <RowComponent data={transactions} />
          )
        }
        head={payout ? payoutTableHeaders : IssuedAccountTableHeaders}
        loading={loading}
      />

      <EmptyTable
        loading={loading}
        rows={transactions}
        title="There are no transactions for this account"
        text="When a transaction is recorded, it will appear here"
      />

      {!payout && (
        <TransactionDrawer
          opened={opened}
          close={close}
          selectedRequest={data}
        />
      )}

      {payout && <PayoutDrawer />}
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

const payoutTableHeaders = [
  "Beneficiary Name",
  "Destination Account",
  "Ultimate Debtor",
  "Amount",
  "Date & Time",
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
      <TableTd>{"N/A"}</TableTd>
      <TableTd>{element.recipientName || element.recipientIban}</TableTd>
      <TableTd>
        <AmountGroup type={element.type} fz={12} fw={400} />
      </TableTd>
      <TableTd>{formatNumber(element.amount, true, "EUR")}</TableTd>
      <TableTd>{element.reference}</TableTd>

      <TableTd>
        {dayjs(element.createdAt).format("Do MMMM, YYYY - hh:mm a")}
      </TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));
};

const PayoutRowComponent = ({
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
  return data?.map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        // handleRowClick(element.id);
        setData(element);
        open();
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd>
        {element.destinationFirstName && element.destinationLastName
          ? `${element.destinationFirstName} ${element.destinationLastName}`
          : "N/A"}
      </TableTd>
      <TableTd>{element.recipientIban}</TableTd>
      <TableTd>{element.intermediary ?? "N/A"}</TableTd>
      <TableTd>
        <Group gap={3}>
          <IconArrowUpRight color="#D92D20" size={16} />
          {formatNumber(element.amount, true, "EUR")}
          {/* <Text fz={12}></Text> */}
        </Group>
      </TableTd>
      <TableTd>
        {dayjs(element.createdAt).format("Do MMMM, YYYY - hh:mm a")}
      </TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));
};
