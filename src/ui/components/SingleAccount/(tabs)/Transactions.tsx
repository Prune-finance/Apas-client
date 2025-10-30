import { Box, Flex, Group, Modal, Text } from "@mantine/core";
import {
  IconListTree,
  IconCircleArrowDown,
  IconCalendarMonth,
} from "@tabler/icons-react";
import { PrimaryBtn, SecondaryBtn } from "../../Buttons";
import InfoCards from "../../Cards/InfoCards";
import EmptyTable from "../../EmptyTable";
import { SearchInput, SelectBox, TextBox } from "../../Inputs";
import { TableComponent } from "../../Table";
import { TransactionType } from "@/lib/hooks/transactions";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import Transaction from "@/lib/store/transaction";
import { IssuedAccountTableHeaders, PayoutTableHeaders } from "@/lib/static";

import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import {
  IssuedTransactionTableRows,
  PayoutTransactionTableRows,
} from "../../TableRows";
import { useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

import { PayoutTransactionDrawer } from "@/app/(dashboard)/payouts/PayoutDrawer";

import { FilterSchema, FilterType, FilterValues } from "@/lib/schema";
import Filter from "../../Filter";
import { useForm, zodResolver } from "@mantine/form";
import DownloadStatement from "@/ui/components/DownloadStatement";
import { handleCsvDownload, handlePdfStatement, parseError } from "@/lib/actions/auth";
import axios from "axios";
import Cookies from "js-cookie";
import { DatePickerInput } from "@mantine/dates";
import useNotification from "@/lib/hooks/notification";
import { notifications } from "@mantine/notifications";
import { useQueryState } from "nuqs";
export const Transactions = ({
  transactions,
  loading,
  payout,
  meta,
  children,
  accountID,
  location,
  isUser,
  currencyType,
}: Props) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const totalBal = transactions.reduce((prv, curr) => prv + curr.amount, 0);
  const { data, opened, close } = Transaction();

  // const [search, setSearch] = useState("");
  // const [debouncedSearch] = useDebouncedValue(search, 500);
  const [openedFilter, { toggle }] = useDisclosure(false);
  const [openedPreview, { open: openPreview, close: closePreview }] =
    useDisclosure(false);
  const [openedTransactionsPreview, { open: openTransactionsPreview, close: closeTransactionsPreview }] =
    useDisclosure(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [documentType, setDocumentType] = useState<string>("PDF");
  const { handleSuccess, handleError, handleInfo } = useNotification();

  const [downloadData, setDownloadData] = useState<DownloadStatementData[]>([]);
  const [exportData, setExportData] = useState<DownloadStatementData[]>([]);

  const [downloadMeta, setDownloadMeta] =
    useState<downloadStatementMeta | null>(null);
    
  const [loadingStatement, setLoadingStatement] = useState<boolean>(false);

  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    history: "push",
    throttleMs: 500,
    shallow: false,
  });

  const getStatementDataChunks = (data: DownloadStatementData[]) => {
    const chunkSize = 20; // Define your chunk size
    const chunks: DownloadStatementData[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const form = useForm<FilterType>({
    initialValues: FilterValues,
    validate: zodResolver(FilterSchema),
  });

  const overviewDetails = [
    {
      title: "Total Transactions",
      value: meta?.total,
      // currency: "EUR",
      // formatted: true,
    },
    {
      title: "Money In",
      // value:
      //   transactions
      //     .filter((trx) => trx.type === "CREDIT")
      //     .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      value: meta?.in,
      currency: currencyType ?? "EUR",
      formatted: true,
    },
    {
      title: "Money Out",
      // value:
      //   transactions
      //     .filter((trx) => trx.type === "DEBIT")
      //     .reduce((prv, curr) => prv + curr.amount, 0) || 0,
      value: meta?.out,
      currency: currencyType ?? "EUR",
      formatted: true,
    },
  ];

  const handleDownloadAccountStatement = async () => {
    console.log(location);

    if (!dateRange[0] || !dateRange[1]) {
      return handleInfo(
        "Account Statement",
        "Please select a valid date range"
      );
    }

    notifications.clean();
    setLoadingStatement(true);

    const [startDate, endDate] = dateRange.map((date) =>
      dayjs(date).format("YYYY-MM-DD")
    );
    const baseUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL;

    const headers = { Authorization: `Bearer ${Cookies.get("auth")}` };

    // Define the possible URLs based on location
    const urlMap: { [key: string]: string } = {
      payout: `${baseUrl}/payouts/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}`,
      "admin-account": `${baseUrl}/admin/accounts/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}`,
      "admin-payout": `${baseUrl}/admin/accounts/payout/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}`,
      "admin-default": `${baseUrl}/admin/accounts/business/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}`,
      "own-account": `${baseUrl}/accounts/company/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}`,
      "issued-account": `${baseUrl}/accounts/${accountID}/statement?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "gbp-account": `${baseUrl}/currency-accounts/transactions/get-company-currency-account-transaction-statement/${accountID}?date=${startDate}&endDate=${endDate}`,
      "ghs-account": `${baseUrl}/currency-accounts/transactions/get-company-currency-account-transaction-statement/${currencyType}/${accountID}?date=${startDate}&endDate=${endDate}`,
      "usd-account": `${baseUrl}/currency-accounts/transactions/get-company-currency-account-transaction-statement/${currencyType}/${accountID}?date=${startDate}&endDate=${endDate}`,
      "ghs-business-account": `${baseUrl}/admin/accounts/business/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "eur-business-account": `${baseUrl}/admin/accounts/business/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "gbp-business-account": `${baseUrl}/admin/accounts/business/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "usd-business-account": `${baseUrl}/admin/accounts/business/${accountID}/transactions/statement?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
    };

    // Use the default URL if location is undefined or not in urlMap
    const url =
      urlMap[location ?? "default"] ||
      `${baseUrl}/accounts/${accountID}/statement?date=${startDate}&endDate=${endDate}`;

    try {
      const { data: res } = await axios.get(url, { headers });

      if (!res?.data?.length) {
        return handleInfo(
          "Account Statement",
          "No transactions found for the selected date range"
        );
      }

      console.log(res?.data, res?.meta);

      setDownloadData(res.data);
      setDownloadMeta(res.meta);

      // Simulate delay for processing
      await new Promise((resolve) => setTimeout(resolve, 5000));
      if (documentType === "PDF") {
        handlePdfStatement(pdfRef);
      } else {
        console.log("downloadData:", downloadData);
        handleCsvDownload(downloadData, "account_statement.csv", currencyType || "EUR");
      }
      closePreview();
      handleSuccess(
        "Account Statement",
        "Account statement downloaded successful"
      );
      setDateRange([null, null]);
    } catch (error) {
      console.error("Error fetching account statement:", error);
      handleError(
        "Account Statement",
        error instanceof Error
          ? parseError(error)
          : "error downloading account statement"
      );
    } finally {
      setLoadingStatement(false);
    }
  };

  const handleExportStatement = async () => {
    console.log(location);

    if (!dateRange[0] || !dateRange[1]) {
      return handleInfo(
        "Transactions Export",
        "Please select a valid date range"
      );
    }

    notifications.clean();
    setLoadingStatement(true);

    const [startDate, endDate] = dateRange.map((date) =>
      dayjs(date).format("YYYY-MM-DD")
    );

    const baseUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL;
    const headers = { Authorization: `Bearer ${Cookies.get("auth")}` };

    // Define the possible URLs based on location
    const urlMap: { [key: string]: string } = {
      payout: `${baseUrl}/payouts/${accountID}/transactions/export?date=${startDate}&endDate=${endDate}`,
      "admin-account": `${baseUrl}/admin/accounts/${accountID}/transactions/export?date=${startDate}&endDate=${endDate}`,
      "admin-payout": `${baseUrl}/admin/accounts/payout/${accountID}/transactions/export?date=${startDate}&endDate=${endDate}`,
      "admin-default": `${baseUrl}/admin/accounts/business/${accountID}/transactions/export?date=${startDate}&endDate=${endDate}`,
      "own-account": `${baseUrl}/accounts/${accountID}/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "issued-account": `${baseUrl}/accounts/${accountID}/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "gbp-account": `${baseUrl}/accounts/${accountID}/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "ghs-account": `${baseUrl}/accounts/${accountID}/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "ghs-business-account": `${baseUrl}/admin/accounts/business/${accountID}/transactions/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "eur-business-account": `${baseUrl}/admin/accounts/business/${accountID}/transactions/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "gbp-business-account": `${baseUrl}/admin/accounts/business/${accountID}/transactions/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
      "usd-business-account": `${baseUrl}/admin/accounts/business/${accountID}/transactions/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`,
    };

    const url =
      urlMap[location ?? "default"] ||
      `${baseUrl}/accounts/${accountID}/export?date=${startDate}&endDate=${endDate}&currency=${currencyType}`;

    try {
      const { data: res } = await axios.get(url, { headers });

      if (!res?.data?.length) {
        return handleInfo(
          "Transactions Export",
          "No transactions found for the selected date range"
        );
      }

      setExportData(res.data);
      // Simulate delay for processing
      await new Promise((resolve) => setTimeout(resolve, 5000));

      handleCsvDownload(res.data, "transactions_export.csv", currencyType || "EUR");

      closeTransactionsPreview();
      handleSuccess(
        "Transactions Export",
        "Transactions export downloaded successful"
      );
      setDateRange([null, null]);
    } catch (error) {
      console.error("Error exporting transactions:", error);
      handleError(
        "Transactions Export",
        error instanceof Error
          ? parseError(error)
          : "error exporting transactions"
      );
    } finally {
      setLoadingStatement(false);
    }
  };

  const closeAccountStatement = () => {
    closePreview();
    setDateRange([null, null]);
    notifications.clean();
  };

  return (
    <>
      <InfoCards title="Overview" details={overviewDetails} />

      <Group mt={32} justify="space-between">
        <SearchInput
          // search={search} setSearch={setSearch}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

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
            // style={{ cursor: "not-allowed" }}
            fw={600}
            // action={() => handlePdfStatement(pdfRef)}
            action={openPreview}
          />

          <SecondaryBtn
            text="Export Transactions"
            icon={IconCircleArrowDown}
            // style={{ cursor: "not-allowed" }}
            fw={600}
            // action={() => handlePdfStatement(pdfRef)}
            action={openTransactionsPreview}
          />
        </Group>
      </Group>

      <Filter<FilterType>
        opened={openedFilter}
        toggle={toggle}
        form={form}
        customStatusOption={[
          "PENDING",
          currencyType === "GHS" || currencyType === "USD"
            ? "COMPLETED"
            : "CONFIRMED",
          "REJECTED",
          "CANCELLED",
          "FAILED",
        ]}
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
          placeholder={
            currencyType === "GBP"
              ? "Account Number"
              : currencyType === "GHS"
              ? "Wallet ID"
              : "Beneficiary IBAN"
          }
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
              // searchProps={searchProps}
              // search={debouncedSearch}
            />
          ) : (
            <IssuedTransactionTableRows
              data={transactions}
              // searchProps={searchProps}
              // search={debouncedSearch}
              isUser={isUser}
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
      {/* Add Pagination as children */}
      {children}

      {!payout && (
        <TransactionDrawer
          opened={opened}
          close={close}
          selectedRequest={data}
        />
      )}

      {payout && <PayoutTransactionDrawer />}

      <Modal
        opened={openedPreview}
        onClose={closeAccountStatement}
        size={"35%"}
        centered
        withCloseButton={true}
        style={{backgroundColor: "white"}}
      >
        <Flex
          w="100%"
          align="center"
          justify="center"
          direction="column"
          px={30}
        >
          <Text fz={18} fw={500} c="#000">
            Download Statement
          </Text>

          <DatePickerInput
            placeholder="Select Date Range"
            valueFormat="YYYY-MM-DD"
            value={dateRange}
            onChange={(value: [Date | null, Date | null]) =>
              setDateRange(value)
            }
            size="xs"
            w="100%"
            h={44}
            styles={{ input: { height: "48px" } }}
            mt={12}
            type="range"
            allowSingleDateInRange
            leftSection={<IconCalendarMonth size={20} />}
            numberOfColumns={2}
            clearable
            disabled={loadingStatement}
          />

          <PrimaryBtn
            action={handleDownloadAccountStatement}
            loading={loadingStatement}
            text="Submit"
            mt={22}
            ml="auto"
            mb={38}
            w="100%"
            h={44}
          />
        </Flex>
      </Modal>

      <Modal
        opened={openedTransactionsPreview}
        onClose={closeTransactionsPreview}
        size={"35%"}
        centered
        withCloseButton={true}
        style={{backgroundColor: "white"}}
      >
        <Flex
          w="100%"
          align="center"
          justify="center"
          direction="column"
          px={30}
        >
          <Text fz={18} fw={500} c="#000">
            Export Transactions
          </Text>

          <DatePickerInput
            placeholder="Select Date Range"
            valueFormat="YYYY-MM-DD"
            value={dateRange}
            onChange={(value: [Date | null, Date | null]) =>
              setDateRange(value)
            }
            size="xs"
            w="100%"
            h={44}
            styles={{ input: { height: "48px" } }}
            mt={12}
            type="range"
            allowSingleDateInRange
            leftSection={<IconCalendarMonth size={20} />}
            numberOfColumns={2}
            clearable
            disabled={loading}
          />

          <SelectBox
            placeholder="Select Document Type"
            data={["CSV"]}
            value={"CSV"}
            disabled
            onChange={(value) => setDocumentType(value!)}
            mt={16}
            size="xs"
            w="100%"
            h={44}
            styles={{ input: { height: "48px" } }}
          />

          <PrimaryBtn
            action={handleExportStatement}
            loading={loadingStatement}
            text="Submit"
            mt={22}
            ml="auto"
            mb={38}
            w="100%"
            h={44}
          />
        </Flex>
      </Modal>

      <Box pos="absolute" left={-9999} bottom={700} w="60vw" m={0} p={0}>
        <>
          {
            getStatementDataChunks(downloadData).map((dataChunk, index) => {
              return (
                <DownloadStatement
                  key={index}
                  currencyType={currencyType || "EUR"}
                  receiptRef={pdfRef}
                  data={dataChunk} // Render remaining data on other pages
                  meta={downloadMeta}
                />
              );
            })
          }
        </>
      </Box>
    </>
  );
};

// const searchProps = [
//   "senderIban",
//   "recipientIban",
//   "recipientBankAddress",
//   "senderName",
//   "recipientName",
//   "centrolinkRef",
//   "reference",
// ];

interface Meta {
  out: number;
  total: number;
  in: number;
  totalAmount: number;
}
interface Props {
  transactions: TransactionType[];
  loading: boolean;
  payout?: boolean;
  meta: Meta | null;
  children: React.ReactNode;
  accountID?: string;
  location?: string;
  isUser?: boolean;
  currencyType?: string;
}

export interface BalanceDetail {
  id: string;
  type: "DEBIT" | "CREDIT";
  amount: number;
  balance: number;
  accountId: string;
  companyAccountId: string | null;
  payoutAccountId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountDetails {
  id: string;
  iban: string;
  country: string;
  accountIban?: string;
  accountNumber?: string;
  "SWIFT/BIC"?: string;
  accountName: string;
  createdAt: string;
  sortCode?: string;
}

export interface ExportStatementData {
  accountId: string;
  amount: number;
  balance: number;
  description: string;
  ref: string;
  companyAccountId: string | null;
  createdAt: string; // ISO date string
  deletedAt: string | null; // ISO date string or null
  id: string;
  narration: string | null;
  payoutAccountId: string | null;
  beneficiaryAccountNumber?: string;
  senderAccountName?: string;
  beneficiarySortCode?: string;
  reference: string;
  senderBic: string;
  senderIban: string;
  senderAccountNumber: string;
  beneficiaryName?: string;

  senderName: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "pending"; // assuming possible values based on context
  type: "DEBIT" | "CREDIT"; // assuming possible transaction types
  updatedAt: string; // ISO date string
}

export interface DownloadStatementData {
  accountId: string;
  amount: number;
  balance: number;
  description: string;
  ref: string;
  companyAccountId: string | null;
  createdAt: string; // ISO date string
  deletedAt: string | null; // ISO date string or null
  id: string;
  narration: string | null;
  payoutAccountId: string | null;
  beneficiaryAccountNumber?: string;
  senderAccountName?: string;
  beneficiarySortCode?: string;
  reference: string;
  senderBic: string;
  senderIban: string;
  senderAccountNumber: string;
  beneficiaryName?: string;
  senderWalletId?: string;
  senderName: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "pending"; // assuming possible values based on context
  type: "DEBIT" | "CREDIT"; // assuming possible transaction types
  updatedAt: string; // ISO date string
  beneficiaryWalletId?: string;
  GhsAccount: {
    accountName: string;
    id: string;
    walletId: string;
  };
}

export interface downloadStatementMeta {
  summary: {
    openingBalance: BalanceDetail;
    closingBalance: BalanceDetail;
    range: string;
    moneyIn: number;
    moneyOut: number;
    address: string;
  };
  accountDetails: AccountDetails;
  out: number;
  in: number;
  totalAmount: number;
  total: number;
}
