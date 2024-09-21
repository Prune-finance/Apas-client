"use client";

import { useUserDefaultPayoutAccount } from "@/lib/hooks/accounts";
import { useUserBusiness } from "@/lib/hooks/businesses";
import { TransactionType, useUserTransactions } from "@/lib/hooks/transactions";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  DefaultAccountHead,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import { Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SingleUserPayoutAccount() {
  const params = useParams<{ id: string }>();
  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const [opened, { open, close }] = useDisclosure(false);
  const { loading, account } = useUserDefaultPayoutAccount();

  const { business, loading: loadingBiz } = useUserBusiness();

  const { transactions, loading: trxLoading } = useUserTransactions();
  // const { transactions, loading: trxLoading } = useUserTransactions(params.id);

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Payouts", href: "/payouts" },

          {
            title: account?.accountName || "",
            href: `/payouts/${params.id}`,
            loading: loading,
          },
        ]}
      />

      <Space mt={32} />
      <DefaultAccountHead
        loading={loading}
        account={account}
        payout
        open={open}
        business={business}
        loadingBiz={loadingBiz}
      />

      <SingleDefaultAccountBody
        account={account}
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={trxLoading}
        setChartFrequency={setChartFrequency}
        business={business}
        payout
      />
    </main>
  );
}
