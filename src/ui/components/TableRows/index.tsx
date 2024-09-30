import { TransactionType } from "@/lib/hooks/transactions";
import { filteredSearch } from "@/lib/search";
import Transaction from "@/lib/store/transaction";
import { formatNumber, frontendPagination } from "@/lib/utils";
import { Stack, TableTd, TableTr, Text } from "@mantine/core";
import Link from "next/link";
import { AmountGroup } from "../AmountGroup";
import dayjs from "dayjs";
import { BadgeComponent } from "../Badge";
import { useRouter } from "next/navigation";
import { Inquiry } from "@/lib/hooks/inquiries";

export const BusinessTransactionTableRows = ({
  data,
  search,
  active,
  limit,
  searchProps,
  business,
}: {
  data: TransactionType[];
  search: string;
  active: number;
  limit: string | null;
  searchProps: string[];
  business?: boolean;
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
      {!business && (
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
      )}

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

      <TableTd w="15%">{element.centrolinkRef}</TableTd>

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
      key={element?.id}
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
          {element?.senderName || "N/A"}
        </Link>
      </TableTd>

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {element?.recipientName}
          </Text>
          <Text fz={10} fw={400}>
            {element?.recipientIban}
          </Text>
        </Stack>
      </TableTd>

      <TableTd w="15%">{element?.centrolinkRef}</TableTd>

      <TableTd>
        <AmountGroup type={element?.type} fz={12} fw={400} />
      </TableTd>

      <TableTd>{formatNumber(element?.amount, true, "EUR")}</TableTd>

      <TableTd w="15%">{element?.reference}</TableTd>

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {dayjs(element?.createdAt).format("Do MMMM, YYYY")}
          </Text>
          <Text fz={10} fw={400}>
            {dayjs(element?.createdAt).format("hh:mm a")}
          </Text>
        </Stack>
      </TableTd>

      <TableTd>
        <BadgeComponent status={element?.status} />
      </TableTd>
    </TableTr>
  ));
};

export const PayoutTransactionTableRows = ({
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
      <TableTd>{element.senderName || "N/A"}</TableTd>

      <TableTd w="15%">{element.centrolinkRef}</TableTd>
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

export const InquiryTableRows = ({
  data,
  business,
  search,
  searchProps,
}: {
  data: Inquiry[];
  business?: boolean;
  search: string;
  searchProps: string[];
}) => {
  const { push } = useRouter();
  return filteredSearch(data, searchProps, search).map((element) => (
    <TableTr
      key={element.id}
      onClick={() => {
        push(`${!business ? "/admin" : ""}/payouts/${element.id}/inquiry`);
      }}
      style={{ cursor: "pointer" }}
    >
      {!business && <TableTd>{element.Company.name || "N/A"}</TableTd>}

      <TableTd>{element.Transaction.centrolinkRef ?? "N/A"}</TableTd>

      <TableTd tt="capitalize">{element.type.toLowerCase()}</TableTd>

      <TableTd>
        {dayjs(element.createdAt).format("Do MMMM, YYYY - hh:mma")}
      </TableTd>

      <TableTd>
        <BadgeComponent status={element.status} w={100} />
      </TableTd>
    </TableTr>
  ));
};

export const PayoutTrxReqTableRows = ({
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
  ).map((element: TransactionType) => (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      {/* <TableTd>{element.senderName || "N/A"}</TableTd> */}

      {/* <TableTd w="15%">{element.centrolinkRef}</TableTd> */}
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

      <TableTd>{element.senderIban}</TableTd>

      <TableTd>{element.recipientBankAddress}</TableTd>

      <TableTd w="15%">{element.reference}</TableTd>

      <TableTd>{formatNumber(element.amount, true, "EUR")}</TableTd>

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
