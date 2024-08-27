"use client";

import { useParams } from "next/navigation";

import Breadcrumbs from "@/ui/components/Breadcrumbs";

import { useState } from "react";
import { useSingleAccount } from "@/lib/hooks/accounts";

import { TransactionType, useTransactions } from "@/lib/hooks/transactions";
import {
  IssuedAccountHead,
  SingleAccount,
  SingleAccountBody,
} from "@/ui/components/SingleAccount";
import { useDisclosure } from "@mantine/hooks";
import { Space } from "@mantine/core";

export default function Account() {
  const params = useParams<{ id: string }>();
  const {
    loading: trxLoading,
    transactions,
    meta,
  } = useTransactions(params.id);

  const { loading, account, revalidate } = useSingleAccount(params.id);
  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const [opened, { open, close }] = useDisclosure(false);
  const [openedFreeze, { open: openFreeze, close: closeFreeze }] =
    useDisclosure(false);

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

      {/* <SingleAccount
        setChartFrequency={setChartFrequency}
        account={account}
        transactions={transactions}
        trxLoading={trxLoading}
        loading={loading}
        params={params}
        revalidate={revalidate}
      /> */}

      {/* Add OpenFreeze useDisclosure */}
      <Space mt={32} />
      <IssuedAccountHead
        account={account}
        loading={loading}
        open={open}
        openFreeze={openFreeze}
        admin
      />

      <SingleAccountBody
        account={account}
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={trxLoading}
        setChartFrequency={setChartFrequency}
      />
    </main>
  );
}
