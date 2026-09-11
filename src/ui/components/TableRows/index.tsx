import { TransactionType } from "@/lib/hooks/transactions";
import { filteredSearch } from "@/lib/search";
import Transaction from "@/lib/store/transaction";
import { formatNumber, frontendPagination, isDummyIBAN } from "@/lib/utils";

function getSenderIdentifier(element: TransactionType, currency?: string): string | undefined {
  const curr = currency ?? element.currencyType ?? "EUR";
  if (curr === "GHS") return element.senderWalletId || undefined;
  if (curr === "GBP" || curr === "USD") return element.senderAccountNumber || undefined;
  return element.senderIban || undefined;
}

function isSenderClickable(identifier: string | undefined, currency?: string, type?: string): boolean {
  if (!identifier) return false;
  if (type?.toUpperCase() === "CREDIT") return false;
  const curr = currency ?? "EUR";
  return curr !== "EUR" || !isDummyIBAN(identifier);
}
import { Stack, TableTd, TableTr, Text } from "@mantine/core";
import Link from "next/link";
import { AmountGroup } from "../AmountGroup";
import dayjs from "dayjs";
import { BadgeComponent } from "../Badge";
import { useRouter } from "next/navigation";
import { Inquiry } from "@/lib/hooks/inquiries";
import { PayoutTransactionRequest } from "@/lib/hooks/requests";
import { BusinessData } from "@/lib/hooks/businesses";

export const BusinessTransactionTableRows = ({
  data,
  business,
  isUser,
  currency,
  noLink,
}: {
  data: TransactionType[];
  business?: boolean;
  isUser?: boolean;
  currency?: string;
  noLink?: boolean;
}) => {
  const { open, setData } = Transaction();
  return data.map((element) => {
    const currCode = currency ?? element.currencyType ?? "EUR";
    const identifier = getSenderIdentifier(element, currency);
    const clickable = !noLink && isSenderClickable(identifier, currCode, element.type);

    return (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      {!business && (
        clickable ? (
          <TableTd td="underline" onClick={(e) => e.stopPropagation()}>
            <Link href={`${!isUser ? "/admin" : ""}/transactions/${identifier}?currencyCode=${currCode}`}>
              {element?.senderName || "N/A"}
            </Link>
          </TableTd>
        ) : (
          <TableTd>{element?.senderName || "N/A"}</TableTd>
        )
      )}

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {element.recipientName ?? element?.beneficiaryName}
          </Text>
          <Text fz={10} fw={400}>
            {element.recipientIban ?? element?.beneficiaryAccountNumber}
          </Text>
        </Stack>
      </TableTd>

      <TableTd>
        <AmountGroup type={element.type} fz={12} fw={400} />
      </TableTd>

      <TableTd>
        {formatNumber(
          element.amount,
          true,
          currency ?? element?.currencyType ?? "EUR",
        )}
      </TableTd>

      <TableTd w="15%">{element.centrolinkRef ?? element?.accessId}</TableTd>

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
    );
  });
};

export const IssuedTransactionTableRows = ({
  data,
  noLink,
  isUser,
  currency,
}: {
  data: TransactionType[];
  noLink?: boolean;
  isUser?: boolean;
  currency?: string;
}) => {
  const { open, setData } = Transaction();
  return data.map((element) => {
    const currCode = currency ?? element.currencyType ?? "EUR";
    const identifier = getSenderIdentifier(element, currency);
    const clickable = !noLink && isSenderClickable(identifier, currCode, element.type);

    return (
    <TableTr
      key={element?.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      {clickable ? (
        <TableTd td="underline" onClick={(e) => e.stopPropagation()}>
          <Link href={`${!isUser ? "/admin" : ""}/transactions/${identifier}?currencyCode=${currCode}`}>
            {element?.senderName || "N/A"}
          </Link>
        </TableTd>
      ) : (
        <TableTd onClick={(e) => e.stopPropagation()}>
          {element?.senderName || "N/A"}
        </TableTd>
      )}

      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {element?.recipientName ?? element?.beneficiaryName}
          </Text>
          <Text fz={10} fw={400}>
            {element?.recipientIban ?? element?.beneficiaryAccountNumber}
          </Text>
        </Stack>
      </TableTd>

      <TableTd w="15%">{element?.centrolinkRef ?? element?.accessId}</TableTd>

      <TableTd>
        <AmountGroup type={element?.type} fz={12} fw={400} />
      </TableTd>

      <TableTd>
        {formatNumber(
          element?.amount,
          true,
          currency ?? element?.currencyType ?? "EUR",
        )}
      </TableTd>

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
        <BadgeComponent w={"auto"} status={element?.status} />
      </TableTd>
    </TableTr>
    );
  });
};

export const PayoutTransactionTableRows = ({
  data,
  isUser,
  currency,
  noLink,
}: {
  data: TransactionType[];
  isUser?: boolean;
  currency?: string;
  noLink?: boolean;
}) => {
  const { open, setData } = Transaction();
  return data.map((element) => {
    const currCode = currency ?? element.currencyType ?? "EUR";
    const identifier = getSenderIdentifier(element, currency);
    const clickable = !noLink && isSenderClickable(identifier, currCode, element.type);

    return (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData(element);
      }}
      style={{ cursor: "pointer" }}
    >
      {clickable ? (
        <TableTd td="underline" onClick={(e) => e.stopPropagation()}>
          <Link href={`${!isUser ? "/admin" : ""}/transactions/${identifier}?currencyCode=${currCode}`}>
            {element?.senderName || "N/A"}
          </Link>
        </TableTd>
      ) : (
        <TableTd>{element?.senderName || "N/A"}</TableTd>
      )}
      <TableTd w="15%">{element?.centrolinkRef ?? element?.accessId}</TableTd>
      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {element?.recipientName ?? element?.beneficiaryName}
          </Text>
          <Text fz={10} fw={400}>
            {element?.recipientIban ?? element?.beneficiaryAccountNumber}
          </Text>
        </Stack>
      </TableTd>
      <TableTd>
        <AmountGroup type={element.type} fz={12} fw={400} />
      </TableTd>

      <TableTd>
        {formatNumber(
          element.amount,
          true,
          currency ?? element?.currencyType ?? "EUR",
        )}
      </TableTd>

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
        <BadgeComponent w={"100%"} status={element.status} />
      </TableTd>
    </TableTr>
    );
  });
};

export const InquiryTableRows = ({
  data,
  business,
}: {
  data: Inquiry[];
  business?: boolean;
}) => {
  const { push } = useRouter();
  return data.map((element) => (
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
}: {
  data: PayoutTransactionRequest[];
}) => {
  const { open, setData } = Transaction();
  return data.map((element: PayoutTransactionRequest) => (
    <TableTr
      key={element.id}
      onClick={() => {
        open();
        setData({
          recipientName: element.beneficiaryFullName,
          recipientIban: element.destinationIBAN,
          senderIban: element?.PayoutAccount?.accountNumber || "N/A",
          senderName: element?.PayoutAccount?.accountName || "N/A",
          recipientBankAddress: element.destinationBank,
          recipientBic: element.destinationBIC,
          destinationFirstName: "",
          destinationLastName: "",
          centrolinkRef: "",
          recipientBankCountry: element.destinationCountry,
          senderBic: "",
          type: "DEBIT",
          narration: element.reason,

          company: {
            id: "",
            name: "",
          } as BusinessData,
          ...element,
          status: element.status as unknown as
            | "PENDING"
            | "REJECTED"
            | "CONFIRMED"
            | "CANCELLED",
        } as unknown as TransactionType);
      }}
      style={{ cursor: "pointer" }}
    >
      <TableTd>
        <Stack gap={0}>
          <Text fz={12} fw={400}>
            {element.beneficiaryFullName}
          </Text>
          <Text fz={10} fw={400}>
            {element.destinationIBAN}
          </Text>
        </Stack>
      </TableTd>

      <TableTd>{element?.PayoutAccount?.accountNumber || "N/A"}</TableTd>

      <TableTd>{element.destinationBank}</TableTd>

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
