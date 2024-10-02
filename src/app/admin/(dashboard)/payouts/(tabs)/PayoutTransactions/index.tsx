"use client";

import { usePayoutTransactions } from "@/lib/hooks/transactions";

import TabsComponent from "@/ui/components/Tabs";
import { TabsPanel } from "@mantine/core";

import { IconArrowsSort, IconListTree, icons } from "@tabler/icons-react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
import { Fragment, Suspense, useMemo, useState } from "react";
import { AllPayoutTransactions } from "./(tabs)/All";
import { CancelledPayoutTransactions } from "./(tabs)/Cancelled";
import { TransactionDrawer } from "@/app/(dashboard)/transactions/drawer";
import Transaction from "@/lib/store/transaction";
import { useSearchParams } from "next/navigation";

const PayoutTrx = () => {
  const [active, setActive] = useState(1);
  const [limit, setLimit] = useState<string | null>("10");
  const searchParams = useSearchParams();

  const { status, createdAt, type, senderName, recipientName, recipientIban } =
    Object.fromEntries(searchParams.entries());

  const param = useMemo(() => {
    return {
      ...(status && { status }),
      ...(createdAt && { date: dayjs(createdAt).format("YYYY-MM-DD") }),
      ...(type && { type }),
      ...(senderName && { senderName }),
      ...(recipientName && { recipientName }),
      ...(recipientIban && { recipientIban }),
      page: active,
      limit: parseInt(limit ?? "10", 10),
    };
  }, [status, createdAt, type, senderName, recipientName, recipientIban]);
  const { transactions, loading, meta, revalidate } = usePayoutTransactions();

  const { data, opened, close } = Transaction();

  return (
    <Fragment>
      <TabsComponent tabs={tabs} mt={25} tt="capitalize">
        <TabsPanel value={tabs[0].value}>
          <AllPayoutTransactions
            transactions={transactions.filter(
              (trx) => trx.status !== "CANCELLED"
            )}
            loading={loading}
            setActive={setActive}
            setLimit={setLimit}
            active={active}
            limit={limit}
          />
        </TabsPanel>
        <TabsPanel value={tabs[1].value}>
          <CancelledPayoutTransactions
            transactions={transactions.filter(
              (trx) => trx.status === "CANCELLED"
            )}
            loading={loading}
            setActive={setActive}
            setLimit={setLimit}
            active={active}
            limit={limit}
          />
        </TabsPanel>
      </TabsComponent>

      <TransactionDrawer opened={opened} close={close} selectedRequest={data} />
    </Fragment>
  );
};

const tabs = [
  { value: "All", icon: <IconArrowsSort size={14} /> },
  { value: "Cancelled", icon: <IconArrowsSort size={14} /> },
];

export const PayoutTransactions = () => {
  return (
    <Suspense>
      <PayoutTrx />
    </Suspense>
  );
};
