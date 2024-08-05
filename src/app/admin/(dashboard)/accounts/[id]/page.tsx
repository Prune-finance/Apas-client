"use client";

import { useParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";

import { useState } from "react";
import { useSingleAccount } from "@/lib/hooks/accounts";

import { useTransactions } from "@/lib/hooks/transactions";
import SingleAccount from "@/ui/components/SingleAccount";

export default function Account() {
  const params = useParams<{ id: string }>();
  const {
    loading: trxLoading,
    transactions,
    meta,
  } = useTransactions(params.id);

  const { loading, account } = useSingleAccount(params.id);
  const [chartFrequency, setChartFrequency] = useState("Monthly");

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
        ]}
      />

      <SingleAccount
        setChartFrequency={setChartFrequency}
        account={account}
        transactions={transactions}
        trxLoading={trxLoading}
        loading={loading}
        params={params}
      />
    </main>
  );
}
