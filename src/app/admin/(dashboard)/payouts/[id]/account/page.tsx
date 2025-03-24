"use client";

import {
  useBusinessDefaultAccount,
  useBusinessPayoutAccount,
  useSingleAccount,
} from "@/lib/hooks/accounts";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import {
  Meta,
  TransactionType,
  useBusinessTransactions,
  usePayoutAccountTransactions,
  usePayoutTransactions,
  useTransactions,
} from "@/lib/hooks/transactions";
import useAxios from "@/lib/hooks/useAxios";
import { calculateTotalPages } from "@/lib/utils";

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
      ...(recipientIban && { recipientIban: recipientIban }),
      ...(search && { search: search }),
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

  const { loading: loadingBiz, business } = useSingleBusiness(params.id);

  const { account, loading, revalidate } = useBusinessPayoutAccount(params.id);

  const {
    data: transactions,
    meta,
    loading: loadingTrx,
  } = useAxios<TransactionType[], Meta>({
    baseURL: "accounts",
    endpoint: `/admin/accounts/business/payout-account/${account?.id}/transactions`,
    params: param,
    enabled: !!!account?.id,
    dependencies: [...Object.values(param), account?.id],
  });
  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Payouts", href: "/admin/payouts" },
          {
            title: business?.name || "",
            href: `/admin/businesses/${params.id}`,
            loading: !business?.name || loadingBiz,
          },
          {
            title: "Accounts",
            href: `/admin/payouts/${params.id}/account`,
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
          payout
          admin
          revalidate={revalidate}
        />

        <SingleDefaultAccountBody
          accountID={params?.id}
          account={account}
          location="admin-payout"
          transactions={transactions || []}
          loading={loading}
          loadingTrx={loadingTrx}
          setChartFrequency={setChartFrequency}
          business={business}
          admin
          payout
          trxMeta={meta}
          revalidate={revalidate}
        >
          <PaginationComponent
            active={active}
            setActive={setActive}
            setLimit={setLimit}
            limit={limit}
            total={calculateTotalPages(limit, meta?.total)}
          />
        </SingleDefaultAccountBody>
      </Paper>
    </main>
  );
}
