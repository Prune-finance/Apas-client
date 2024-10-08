"use client";

import {
  useBusinessDefaultAccount,
  useBusinessPayoutAccount,
  useSingleAccount,
} from "@/lib/hooks/accounts";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import {
  TransactionType,
  useBusinessTransactions,
  usePayoutTransactions,
  useTransactions,
} from "@/lib/hooks/transactions";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import {
  DefaultAccountHead,
  SingleAccountBody,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import { Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function BusinessPayoutAccount() {
  const params = useParams<{ id: string }>();
  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const [opened, { open, close }] = useDisclosure(false);

  const {
    loading: loadingBiz,
    business,
    revalidate,
  } = useSingleBusiness(params.id);

  const { account, loading } = useBusinessPayoutAccount(params.id);

  const { loading: loadingTrx, transactions, meta } = usePayoutTransactions();
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
            title: "Payout Account",
            href: `/admin/businesses/accounts/${params.id}/default`,
            loading: loading,
          },
        ]}
      />

      <Paper p={28} mt={20} mih="calc(100vh - 150px)">
        <DefaultAccountHead
          loading={loading}
          account={account}
          open={open}
          business={business}
          loadingBiz={loadingBiz}
        />

        <SingleDefaultAccountBody
          account={account}
          transactions={transactions as TransactionType[]}
          loading={loading}
          loadingTrx={loadingTrx}
          setChartFrequency={setChartFrequency}
          business={business}
          admin
          payout
        />
      </Paper>
    </main>
  );
}
