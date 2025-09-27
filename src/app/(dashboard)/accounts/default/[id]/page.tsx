"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "../styles.module.scss";
import {
  useUserCurrencyAccountByID,
  useUserDefaultAccount,
} from "@/lib/hooks/accounts";
import {
  TransactionType,
  useUserCurrencyTransactions,
  useUserDefaultTransactions,
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
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const {
    currency,
    status,
    date,
    type,
    accountType,
    senderName,
    endDate,
    recipientName,
    recipientIban,
    search,
  } = Object.fromEntries(searchParams.entries());

  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const param = useMemo(() => {
    return {
      ...(status && { status: status.toUpperCase() }),
      ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
      ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
      ...(type && { type: type }),
      ...(accountType && { accountType: accountType }),
      ...(senderName && { senderName: senderName }),
      ...(recipientName && { beneficiaryName: recipientName }),
      ...(recipientIban && { beneficiaryAccountNumber: recipientIban }),
      ...(debouncedSearch && { search: debouncedSearch }),
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
  ]);

  const {
    transactions,
    loading: loadingTrx,
    meta: trxMeta,
    revalidate: revalidateTrx,
  } = useUserCurrencyTransactions(param, currency);

  const { business, meta, revalidate, loading: loadingBiz } = useUserBusiness();

  const {
    currencyAccount: account,
    loading,
    revalidate: revalidateAcct,
  } = useUserCurrencyAccountByID(params?.id, currency);

  const [chartFrequency, setChartFrequency] = useState("Monthly");

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
        payout={accountType === "PAYOUT_ACCOUNT"}
        currencyType={currency as "GBP" | "GHS" | "EUR" | "NGN"}
        open={() => {}}
      />

      <SingleDefaultAccountBody
        accountType={account?.AccountRequests?.Currency?.symbol}
        account={account}
        location={currency === "GBP" ? "gbp-account" : "ghs-account"}
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={loadingTrx}
        setChartFrequency={setChartFrequency}
        trxMeta={trxMeta}
        revalidate={revalidateAcct}
        revalidateTrx={revalidateTrx}
        business={business}
        isUser
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
