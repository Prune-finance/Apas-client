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
  usePayoutAccountTransactions,
  usePayoutTransactions,
  useTransactions,
} from "@/lib/hooks/transactions";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import PaginationComponent from "@/ui/components/Pagination";
import {
  DefaultAccountHead,
  SingleAccountBody,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import { Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

export default function BusinessPayoutAccount() {
  const params = useParams<{ id: string }>();
  const [chartFrequency, setChartFrequency] = useState("Monthly");
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");

  const searchParams = useSearchParams();

  const {
    status,
    date,
    type,
    senderName,
    endDate,
    recipientName,
    recipientIban,
    accountId,
    search,
  } = Object.fromEntries(searchParams.entries());

  const param = useMemo(() => {
    return {
      ...(status && { status: status.toUpperCase() }),
      ...(date && { date: dayjs(date).format("YYYY-MM-DD") }),
      ...(endDate && { endDate: dayjs(endDate).format("YYYY-MM-DD") }),
      ...(type && { type: type }),
      ...(senderName && { senderName: senderName }),
      ...(recipientName && { recipientName: recipientName }),
      ...(search && { search: search }),
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
    search,
  ]);

  const {
    loading: loadingBiz,
    business,
    revalidate,
  } = useSingleBusiness(params.id);

  const {
    account,
    loading,
    revalidate: revalidateAcct,
  } = useBusinessPayoutAccount(params.id);

  const {
    loading: loadingTrx,
    revalidate: revalidateTrx,
    transactions,
    meta,
  } = usePayoutAccountTransactions(accountId ?? account?.id, param);

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
          admin
        />

        <SingleDefaultAccountBody
          account={account}
          accountID={params?.id}
          location="admin-payout"
          transactions={transactions as TransactionType[]}
          loading={loading}
          loadingTrx={loadingTrx}
          setChartFrequency={setChartFrequency}
          business={business}
          admin
          payout
          trxMeta={meta}
          revalidateTrx={revalidateTrx}
          revalidate={revalidateAcct}
        >
          <PaginationComponent
            active={active}
            setActive={setActive}
            setLimit={setLimit}
            limit={limit}
            total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
          />
        </SingleDefaultAccountBody>
      </Paper>
    </main>
  );
}
