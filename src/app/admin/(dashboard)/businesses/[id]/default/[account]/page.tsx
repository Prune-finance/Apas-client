"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "../styles.module.scss";
import { useAdminGetCompanyCurrencyAccountByID } from "@/lib/hooks/accounts";
import {
  TransactionType,
  useBusinessAccountTransactions,
  usePayoutAccountTransactions,
} from "@/lib/hooks/transactions";
import {
  DefaultAccountHead,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import { Space } from "@mantine/core";
import { Suspense, useMemo, useState } from "react";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import PaginationComponent from "@/ui/components/Pagination";
import { useDebouncedValue } from "@mantine/hooks";

function Account() {
  const params = useParams<{ id: string; account: string }>();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const [transactionsEnabled, setTransactionsEnabled] = useState(false);

  const {
    status,
    date,
    type,
    senderName,
    endDate,
    recipientName,
    recipientIban,
    search,
    accountType,
    currency,
  } = Object.fromEntries(searchParams.entries());

  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const { business, loading: loadingBiz } = useSingleBusiness(params.id);

  const {
    currencyAccount: account,
    loading,
    revalidate: revalidateAcct,
  } = useAdminGetCompanyCurrencyAccountByID(params?.account, currency || undefined);

  const [chartFrequency, setChartFrequency] = useState("Monthly");

  const currencyCode = account?.AccountRequests?.Currency?.symbol || currency;

  const isPayout =
    account?.accountType === "PAYOUT_ACCOUNT" || accountType === "PAYOUT_ACCOUNT";

  const customParams = useMemo(() => {
    return {
      ...(status && { status: status.toUpperCase() }),
      ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
      ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
      ...(type && { type }),
      ...(senderName && { senderName }),
      ...(recipientName && { recipientName }),
      ...(recipientIban && { recipientIban }),
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(currencyCode && { currencyCode }),
      page: active,
      limit: parseInt(limit ?? "10", 10),
    };
  }, [
    status,
    date,
    type,
    senderName,
    endDate,
    recipientName,
    recipientIban,
    active,
    limit,
    debouncedSearch,
    currencyCode,
  ]);

  const accountIdForTrx = account?.id ?? params.account;

  const {
    transactions: companyTrx,
    loading: loadingCompanyTrx,
    meta: companyTrxMeta,
    revalidate: revalidateCompanyTrx,
  } = useBusinessAccountTransactions(
    !isPayout ? accountIdForTrx : "",
    customParams,
    !isPayout && transactionsEnabled
  );

  const {
    transactions: payoutTrx,
    loading: loadingPayoutTrx,
    meta: payoutTrxMeta,
    revalidate: revalidatePayoutTrx,
  } = usePayoutAccountTransactions(
    isPayout ? accountIdForTrx : "",
    customParams,
    isPayout && transactionsEnabled
  );

  const transactions = isPayout ? payoutTrx : companyTrx;
  const loadingTrx = isPayout ? loadingPayoutTrx : loadingCompanyTrx;
  const trxMeta = isPayout ? payoutTrxMeta : companyTrxMeta;
  const revalidateTrx = isPayout ? revalidatePayoutTrx : revalidateCompanyTrx;

  const location = `${currencyCode || accountType || "ghs"}-business-account`.toLowerCase();

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Businesses", href: "/admin/businesses" },
          {
            title: business?.name || "",
            href: `/admin/businesses/${params.id}`,
            loading: loadingBiz,
          },
          {
            title: account?.accountName || "",
            href: `/admin/businesses/${params.id}/default/${params.account}`,
            loading: loading,
          },
        ]}
      />

      <Space mt={32} />
      <DefaultAccountHead
        account={account}
        business={business}
        loadingBiz={loadingBiz}
        loading={loading}
        payout={isPayout}
        open={() => {}}
      />

      <SingleDefaultAccountBody
        accountType={currencyCode || accountType}
        currency={currencyCode}
        account={account}
        location={location}
        payout={isPayout}
        transactions={(transactions || []) as TransactionType[]}
        loading={loading}
        loadingTrx={loadingTrx}
        setChartFrequency={setChartFrequency}
        trxMeta={trxMeta}
        revalidate={revalidateAcct}
        revalidateTrx={revalidateTrx}
        business={business}
        isUser
        page={active}
        limit={limit}
        onTabChange={(tab) => {
          if (tab === "Transactions") setTransactionsEnabled(true);
        }}
      >
        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((trxMeta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        />
      </SingleDefaultAccountBody>
    </main>
  );
}

export default function DefaultAccount() {
  return (
    <Suspense>
      <Account />
    </Suspense>
  );
}
