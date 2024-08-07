"use client";

import { useParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";

import { useState } from "react";

import { useSingleAccount } from "@/lib/hooks/accounts";

import { useTransactions } from "@/lib/hooks/transactions";
import SingleAccount from "@/ui/components/SingleAccount";
import { useSingleBusiness } from "@/lib/hooks/businesses";

export default function Account() {
  const params = useParams<{ id: string }>();

  const {
    loading: loadingTrx,
    transactions,
    meta,
  } = useTransactions(params.id);

  const {
    loading,
    account,
    revalidate: revalidateAcct,
  } = useSingleAccount(params.id);

  const {
    loading: loadingBiz,
    business,
    revalidate,
  } = useSingleBusiness(account?.companyId || "");

  const [chartFrequency, setChartFrequency] = useState("Monthly");

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Businesses", href: "/admin/businesses" },
          {
            title: business?.name || "",
            href: `/admin/businesses/${params.id}`,
            loading: !business?.name || loadingBiz,
          },
          {
            title: account?.accountName || "",
            href: `/admin/businesses/accounts/${params.id}`,
            loading: loading,
          },
        ]}
      />

      <SingleAccount
        setChartFrequency={setChartFrequency}
        account={account}
        transactions={transactions}
        trxLoading={loadingTrx}
        loading={loading}
        params={params}
        revalidate={revalidateAcct}
      />
    </main>
  );
}
