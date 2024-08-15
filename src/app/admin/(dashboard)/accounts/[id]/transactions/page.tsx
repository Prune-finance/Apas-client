"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useSingleAccount } from "@/lib/hooks/accounts";
import { useTransactions } from "@/lib/hooks/transactions";

import SingleAccountTransaction from "@/ui/components/SingleAccountTransaction";
import dayjs from "dayjs";

export default function TransactionForAccount() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const status = searchParams.get("status")?.toUpperCase();
  const createdAt = searchParams.get("createdAt");

  const { loading, account } = useSingleAccount(params.id);
  const { loading: loadingTrx, transactions } = useTransactions(params.id, {
    ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
    ...(status && { status }),
  });

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/admin/accounts" },

          {
            title: account?.accountName || "",
            href: `/admin/accounts/${params.id}`,
            loading: loading,
          },

          {
            title: "Transactions",
            href: `/admin/accounts/${params.id}/transactions`,
          },
        ]}
      />

      <SingleAccountTransaction
        loadingTrx={loadingTrx}
        transactions={transactions}
      />
    </main>
  );
}
