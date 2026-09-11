"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "../styles.module.scss";
import { useAdminGetCompanyCurrencyAccountByID } from "@/lib/hooks/accounts";
import {
  TransactionType,
  useBusinessAccountTransactions,
} from "@/lib/hooks/transactions";
import {
  DefaultAccountHead,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import { Space } from "@mantine/core";
import { Suspense, useMemo, useState } from "react";
import { useUserBusiness } from "@/lib/hooks/businesses";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import PaginationComponent from "@/ui/components/Pagination";
import { useDebouncedValue } from "@mantine/hooks";

function Account() {
  const params = useParams<{ account: string }>();
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

  const { business, meta, revalidate, loading: loadingBiz } = useUserBusiness();

  const {
    currencyAccount: account,
    loading,
    revalidate: revalidateAcct,
  } = useAdminGetCompanyCurrencyAccountByID(params?.account, currency || undefined);

  const [chartFrequency, setChartFrequency] = useState("Monthly");

  const currencyCode = account?.AccountRequests?.Currency?.symbol || currency;

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

  const {
    transactions,
    loading: loadingTrx,
    meta: trxMeta,
    revalidate: revalidateTrx,
  } = useBusinessAccountTransactions(
    account?.id ?? params.account,
    customParams,
    transactionsEnabled
  );

  const location = `${currencyCode || accountType || "ghs"}-business-account`.toLowerCase();

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/accounts" },
          { title: "Own Accounts", href: "/accounts" },
          {
            title: account?.accountName || "",
            href: `/accounts/default`,
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
        open={() => {}}
      />

      <SingleDefaultAccountBody
        accountType={currencyCode || accountType}
        account={account}
        location={location}
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
