"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import styles from "./styles.module.scss";
import { useUserDefaultAccount } from "@/lib/hooks/accounts";
import {
  TransactionType,
  useUserDefaultTransactions,
} from "@/lib/hooks/transactions";
import {
  DefaultAccountHead,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import { Space } from "@mantine/core";
import { Suspense, useMemo, useState } from "react";
import { useUserBusiness } from "@/lib/hooks/businesses";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import PaginationComponent from "@/ui/components/Pagination";

function Account() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const {
    status,
    date,
    type,
    senderName,
    endDate,
    recipientName,
    recipientIban,
  } = Object.fromEntries(searchParams.entries());

  const param = useMemo(() => {
    return {
      ...(status && { status: status.toUpperCase() }),
      ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
      ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
      ...(type && { type: type }),
      ...(senderName && { senderName: senderName }),
      ...(recipientName && { recipientName: recipientName }),
      ...(recipientIban && { recipientIban: recipientIban }),
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
  ]);

  const {
    account,
    loading,
    revalidate: revalidateAcct,
  } = useUserDefaultAccount();
  const {
    transactions,
    loading: loadingTrx,
    meta: trxMeta,
  } = useUserDefaultTransactions(param);

  const { business, meta, revalidate, loading: loadingBiz } = useUserBusiness();

  const [chartFrequency, setChartFrequency] = useState("Monthly");

  return (
    <main className={styles.main}>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/accounts" },
          { title: "Own Accounts", href: "/accounts/default" },
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
        account={account}
        location="own-account"
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={loadingTrx}
        setChartFrequency={setChartFrequency}
        trxMeta={trxMeta}
        revalidate={revalidateAcct}
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
