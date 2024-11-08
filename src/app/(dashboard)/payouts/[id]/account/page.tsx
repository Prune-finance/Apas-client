"use client";

import { useUserDefaultPayoutAccount } from "@/lib/hooks/accounts";
import { useUserBusiness } from "@/lib/hooks/businesses";
import {
  TransactionType,
  useUserPayoutTransactions,
  useUserTransactions,
} from "@/lib/hooks/transactions";
import Breadcrumbs from "@/ui/components/Breadcrumbs";
import PaginationComponent from "@/ui/components/Pagination";
import {
  DefaultAccountHead,
  SingleDefaultAccountBody,
} from "@/ui/components/SingleAccount";
import { Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function SingleUserPayoutAccount() {
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
  ]);

  const { loading, account } = useUserDefaultPayoutAccount();

  const { business, loading: loadingBiz } = useUserBusiness();

  const {
    transactions,
    loading: trxLoading,
    meta,
  } = useUserPayoutTransactions(param);
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
        location="payout"
        transactions={transactions as TransactionType[]}
        loading={loading}
        loadingTrx={trxLoading}
        setChartFrequency={setChartFrequency}
        business={business}
        payout
        trxMeta={meta}
      >
        <PaginationComponent
          active={active}
          setActive={setActive}
          setLimit={setLimit}
          limit={limit}
          total={Math.ceil((meta?.total ?? 0) / parseInt(limit ?? "10", 10))}
        />
      </SingleDefaultAccountBody>
    </main>
  );
}
