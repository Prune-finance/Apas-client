import { TransactionType } from "@/lib/hooks/transactions";
import { filteredSearch } from "@/lib/search";
import Transaction from "@/lib/store/transaction";
import { formatNumber, frontendPagination } from "@/lib/utils";
import { Stack, TableTd, TableTr, Text } from "@mantine/core";
import Link from "next/link";
import { AmountGroup } from "../AmountGroup";
import dayjs from "dayjs";
import { BadgeComponent } from "../Badge";

export const BusinessTransactionTableRows = ({
  data,
  id,
  search,
  active,
  limit,
  searchProps,
}: {
  data: TransactionType[];
  id: string;
  search: string;
  active: number;
  limit: string | null;
  searchProps: string[];
}) => {
  const { open, setData } = Transaction();
  return frontendPagination(
    filteredSearch(data.reverse(), searchProps, search),
    active,
    parseInt(limit ?? "10", 10)
  ).map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd
        td="underline"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link href={`/admin/transactions/${element.senderIban}`}>
          {element.senderName || "N/A"}
        </Link>
      </TableTd>

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {element.recipientName}
          </Text>
          <Text fz={10} fw={400}>
            {element.recipientIban}
          </Text>
        </Stack>
      </TableTd>

      <TableTd>
        <AmountGroup type={element.type} fz={12} fw={400} />
      </TableTd>

      <TableTd>{formatNumber(element.amount, true, "EUR")}</TableTd>

      <TableTd w="15%">{element.reference}</TableTd>

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {dayjs(element.createdAt).format("Do MMMM, YYYY")}
          </Text>
          <Text fz={10} fw={400}>
            {dayjs(element.createdAt).format("hh:mm a")}
          </Text>
        </Stack>
      </TableTd>

      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));
};

export const IssuedTransactionTableRows = ({
  data,

  search,
  active,
  limit,
  searchProps,
}: {
  data: TransactionType[];
  search: string;
  active: number;
  limit: string | null;
  searchProps: string[];
}) => {
  const { open, setData } = Transaction();
  return frontendPagination(
    filteredSearch(data.reverse(), searchProps, search),
    active,
    parseInt(limit ?? "10", 10)
  ).map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd
        td="underline"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link href={`/admin/transactions/${element.senderIban}`}>
          {element.senderName || "N/A"}
        </Link>
      </TableTd>

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {element.recipientName}
          </Text>
          <Text fz={10} fw={400}>
            {element.recipientIban}
          </Text>
        </Stack>
      </TableTd>

      <TableTd w="15%">{element.reference}</TableTd>

      <TableTd>
        <AmountGroup type={element.type} fz={12} fw={400} />
      </TableTd>

      <TableTd>{formatNumber(element.amount, true, "EUR")}</TableTd>

      <TableTd w="15%">{element.reference}</TableTd>

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {dayjs(element.createdAt).format("Do MMMM, YYYY")}
          </Text>
          <Text fz={10} fw={400}>
            {dayjs(element.createdAt).format("hh:mm a")}
          </Text>
        </Stack>
      </TableTd>

      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));
};

export const PayoutTransactionTableRows = ({
  data,
  id,
  search,
  active,
  limit,
  searchProps,
}: {
  data: TransactionType[];
  id: string;
  search: string;
  active: number;
  limit: string | null;
  searchProps: string[];
}) => {
  const { open, setData } = Transaction();
  return frontendPagination(
    filteredSearch(data.reverse(), searchProps, search),
    active,
    parseInt(limit ?? "10", 10)
  ).map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd
        td="underline"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* <Link href={`/admin/transactions/${element.senderIban}`}> */}
        {element.senderName || "N/A"}
        {/* </Link> */}
      </TableTd>
      <TableTd w="15%">{element.reference}</TableTd>
      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {element.recipientName}
          </Text>
          <Text fz={10} fw={400}>
            {element.recipientIban}
          </Text>
        </Stack>
      </TableTd>
      <TableTd>
        <AmountGroup type={element.type} fz={12} fw={400} />
      </TableTd>

      <TableTd>{formatNumber(element.amount, true, "EUR")}</TableTd>

      <TableTd w="15%">{element.reference}</TableTd>

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {dayjs(element.createdAt).format("Do MMMM, YYYY")}
          </Text>
          <Text fz={10} fw={400}>
            {dayjs(element.createdAt).format("hh:mm a")}
          </Text>
        </Stack>
      </TableTd>
      <TableTd>
        <BadgeComponent status={element.status} />
      </TableTd>
    </TableTr>
  ));
};
