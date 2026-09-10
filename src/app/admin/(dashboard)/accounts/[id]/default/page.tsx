"use client";

import { useBusinessDefaultAccount } from "@/lib/hooks/accounts";
import { useSingleBusiness } from "@/lib/hooks/businesses";
import {
  TransactionType,
  useBusinessAccountTransactions,
} from "@/lib/hooks/transactions";

import Breadcrumbs from "@/ui/components/Breadcrumbs";
import PaginationComponent from "@/ui/components/Pagination";
import {
  DefaultAccountHead,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import { Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useBusinessPayoutAccount } from "@/lib/hooks/accounts";

export default function BusinessDefaultAccount() {
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
    accountType,
    currency,
  } = Object.fromEntries(searchParams.entries());
  const [acctId, setAcctId] = useState(accountId);
  const isPayout = accountType === "payout";

  const customParams = useMemo(() => {
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

  const {
    loading: loadingBiz,
    business,
    revalidate,
  } = useSingleBusiness(params.id);

  // const {
  //   loading,
  //   data: account,
  //   queryFn: revalidateAcct,
  // } = useAxios<DefaultAccount>({
  //   endpoint: `/admin/company/${params.id}/default-account`,
  //   baseURL: "accounts",
  //   onSuccess(data) {
  //     setAcctId(data.id);
  //   },
  // });

  // const {
  //   loading: loadingTrx,
  //   data: transactions,
  //   meta,
  // } = useAxios<TransactionType[], Meta>({
  //   endpoint: `/admin/accounts/business/company-account/${acctId}/transactions`,
  //   baseURL: "accounts",
  //   enabled: !!!acctId,
  //   dependencies: [limit, active, acctId, ...Object.values(customParams)],
  //   params: customParams,
  // });

  const {
    account: defaultAccount,
    loading: loadingDefault,
    revalidate: revalidateDefault,
  } = useBusinessDefaultAccount(params.id, !isPayout ? currency : undefined);

  const {
    account: payoutAccount,
    loading: loadingPayout,
    revalidate: revalidatePayout,
  } = useBusinessPayoutAccount(params.id, isPayout ? currency : undefined);

  const account = isPayout ? payoutAccount : defaultAccount;
  const loading = isPayout ? loadingPayout : loadingDefault;
  const revalidateAcct = isPayout ? revalidatePayout : revalidateDefault;

  const {
    loading: loadingTrx,
    transactions,
    revalidate: revalidateTrx,
    meta,
  } = useBusinessAccountTransactions(accountId ?? account?.id, customParams);

  return (
    <main>
      <Breadcrumbs
        items={[
          { title: "Accounts", href: "/admin/accounts?tab=business-accounts" },

          {
            title: account?.accountName ?? "",
            href: `/admin/accounts/${params.id}/default`,
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
          currencyType={currency as "GBP" | "GHS" | "EUR" | "NGN" | "USD" | undefined}
          admin
        />

        <SingleDefaultAccountBody
          account={account}
          accountID={params?.id}
          location={isPayout ? "admin-payout" : "admin-default"}
          currency={currency}
          transactions={transactions as TransactionType[]}
          revalidateTrx={revalidateTrx}
          loading={loading}
          loadingTrx={loadingTrx}
          setChartFrequency={setChartFrequency}
          business={business}
          admin
          isDefault
          trxMeta={meta}
          revalidate={revalidateAcct}
          page={active}
          limit={limit}
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
