"use client";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import { useParams } from "next/navigation";
import { useTransactions } from "@/lib/hooks/transactions";

import { useState } from "react";
import SingleAccountTransaction from "@/ui/components/SingleAccountTransaction";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import { useSingleAccount } from "@/lib/hooks/accounts";

export default function TransactionForAccount() {
  const params = useParams<{ id: string }>();

  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const customParams = {
    page: active,
    limit: parseInt(limit ?? "10", 10),
  };

  const { loading, transactions, meta } = useTransactions(
    params.id,
    customParams
  );

  const { loading: loadingAcct, account } = useSingleAccount(params.id);

  const { loading: loadingBiz, business } = useSingleBusiness(
    account?.companyId || ""
  );

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
            loading: loadingAcct,
          },
          {
            title: "Transactions",
            href: `/admin/businesses/accounts/${params.id}/transactions`,
          },
        ]}
      />

      <SingleAccountTransaction
        loadingTrx={loading}
        transactions={transactions}
      />
    </main>
  );
}
